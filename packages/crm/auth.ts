import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { authConfig } from "@/lib/auth/config";
import { captureServerEvent } from "@/lib/analytics/capture";
import { sendGa4Event } from "@/lib/analytics/ga4";
import { parseInternalIds } from "@/lib/super-admin/internal-exclusion";

// Sanitize env vars — Vercel stored them with trailing CR+LF bytes
if (process.env.AUTH_SECRET) process.env.AUTH_SECRET = process.env.AUTH_SECRET.trim();
if (process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET.trim();
if (process.env.DATABASE_URL) process.env.DATABASE_URL = process.env.DATABASE_URL.trim();
if (process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim();
if (process.env.AUTH_URL) process.env.AUTH_URL = process.env.AUTH_URL.trim();
if (process.env.GOOGLE_CLIENT_ID) process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID.trim();
if (process.env.GOOGLE_CLIENT_SECRET) process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET.trim();

// 2026-08-06 — auth secret hardening. Preview/Dev Vercel environments were
// found to have NO auth secret configured at all (Production had
// AUTH_SECRET, but "[auth][logger][error] Please define a secret" still
// surfaced on / in prod). resolveAuthSecret is pure and exported so it's
// unit-testable without booting NextAuth. It is still evaluated once at
// module load (NextAuth() itself runs at module load too, so there is no
// "call time" re-evaluation happening here — that framing in an earlier
// version of this comment was wrong), and env trimming already happened
// above at lines 10-11 before this function ever sees the values. The two
// real behavioral deltas this adds over reading `process.env.AUTH_SECRET`
// directly are: (1) an explicit fallback to NEXTAUTH_SECRET — Auth.js v5
// only auto-reads AUTH_SECRET, not the legacy v4 env var name — and (2) a
// production-only visibility log (below) when neither resolves, so a
// misconfigured prod env fails loudly instead of surfacing as a generic
// auth-provider error downstream.
export function resolveAuthSecret(env: Record<string, string | undefined>): string | undefined {
  const authSecret = env.AUTH_SECRET?.trim();
  if (authSecret) return authSecret;

  const nextAuthSecret = env.NEXTAUTH_SECRET?.trim();
  if (nextAuthSecret) return nextAuthSecret;

  return undefined;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);
}

async function createOrganizationForUser(params: { name: string }) {
  const baseSlug = slugify(params.name) || "workspace";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const slug = `${baseSlug}-${suffix}`;

    try {
      const [org] = await db
        .insert(organizations)
        .values({
          name: params.name,
          slug,
        })
        .returning();

      if (org) {
        return org;
      }
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;

      if (code === "23505") {
        continue;
      }

      throw error;
    }
  }

  return null;
}

const authUsersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("avatar_url"),
  orgId: uuid("org_id").notNull(),
  role: text("role").notNull().default("member"),
});

const authAccountsTable = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsersTable.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })]
);

const authSessionsTable = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsersTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

const authVerificationTokensTable = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

const baseAdapter = DrizzleAdapter(db, {
  usersTable: authUsersTable,
  accountsTable: authAccountsTable,
  sessionsTable: authSessionsTable,
  verificationTokensTable: authVerificationTokensTable,
});

const adapter = {
  ...baseAdapter,
  async createUser(data: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }) {
    try {
      console.log("[auth][adapter] createUser called for:", data.email);
      const email = data.email?.trim().toLowerCase();

      if (!email) {
        throw new Error("OAuth account is missing an email address.");
      }

      const defaultName = data.name?.trim() || email.split("@")[0] || "Owner";
      console.log("[auth][adapter] creating org for:", defaultName);
      const org = await createOrganizationForUser({ name: `${defaultName}'s Workspace` });

      if (!org) {
        throw new Error("Could not create organization for new account.");
      }

      console.log("[auth][adapter] org created:", org.id, "inserting user");
      const [created] = await db
        .insert(users)
        .values({
          orgId: org.id,
          role: "owner",
          name: defaultName,
          email,
          avatarUrl: data.image ?? null,
          emailVerified: data.emailVerified ?? null,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          image: users.avatarUrl,
          // 2026-08-06 funnel observability — orgId isn't part of NextAuth's
          // AdapterUser shape, but events.createUser (lib/auth/config.ts)
          // needs it to fire signed_up without a second DB query. Extra
          // fields on the returned object are ignored by NextAuth itself,
          // just carried through to the events.createUser callback.
          orgId: users.orgId,
        });

      if (!created) {
        throw new Error("Could not create user for new account.");
      }

      console.log("[auth][adapter] user created:", created.id);

      try {
        await db.update(organizations).set({ ownerId: created.id }).where(eq(organizations.id, org.id));
      } catch (error) {
        const code = (error as { code?: string } | null)?.code;

        if (code !== "42703") {
          throw error;
        }
      }

      // 2026-08-06 funnel observability — this org just gained an owner,
      // so alias the pre-owner org-keyed distinct id (workspace_created)
      // to the new user-keyed distinct id (signed_up) so PostHog can join
      // the two halves of the funnel into one person. Lazy import: this
      // file is reachable from proxy.ts (src/auth.ts -> ../auth), and a
      // static import would pull posthog-node into that module graph.
      try {
        const { aliasOrgToUser } = await import("@/lib/analytics/funnel");
        aliasOrgToUser(created.id, org.id);
      } catch (error) {
        console.warn(
          `[auth][adapter] aliasOrgToUser threw (swallowed): ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      const internalIds = parseInternalIds({
        SF_INTERNAL_USER_IDS: process.env.SF_INTERNAL_USER_IDS,
        SF_INTERNAL_AGENCY_ID: process.env.SF_INTERNAL_AGENCY_ID,
      });
      const isInternal = internalIds.userIds.includes(created.id) ||
        (org.parentAgencyId != null && org.parentAgencyId === internalIds.agencyId);
      captureServerEvent({
        event: "account_created",
        distinctId: created.id,
        groups: { workspace: org.id, ...(org.parentAgencyId ? { agency: org.parentAgencyId } : {}) },
        properties: { signup_method: "auth", creation_path: "signup", is_internal: isInternal },
      });
      void sendGa4Event({ eventName: "sign_up", userId: created.id });

      return created;
    } catch (err) {
      console.error("[auth][adapter] createUser FAILED:", err);
      throw err;
    }
  },
};

const resolvedAuthSecret = resolveAuthSecret(process.env);
if (
  !resolvedAuthSecret &&
  (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production")
) {
  console.error(
    "[auth] AUTH_SECRET/NEXTAUTH_SECRET missing or empty — sessions will fail",
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  trustHost: true,
  secret: resolvedAuthSecret,
  // 2026-05-17 — explicit cookie config to fix the PKCE-cookie-missing-on-
  // callback bug we hit repeatedly on prod Google OAuth.
  //
  // Symptom: NextAuth set `__Secure-authjs.pkce.code_verifier` on the
  // /signin/google POST (log event 19: CREATE_PKCECODEVERIFIER), then
  // the cookie was NOT sent back on the /callback/google GET (event 11:
  // present:false) → "pkceCodeVerifier value could not be parsed" →
  // /api/auth/error?error=Configuration. Setting AUTH_URL didn't fix it.
  //
  // Hypothesis: the __Secure- prefix is enforced strictly by some
  // browser configurations during cross-site OAuth callbacks. Even though
  // we're on HTTPS and the Secure flag is set, the cookie gets dropped
  // somewhere in the round trip. Removing the __Secure- prefix
  // (cookie name `authjs.pkce.code_verifier`) keeps all other security
  // properties (httpOnly + sameSite=lax + secure=true) intact but
  // removes the browser-level prefix-enforcement layer that's breaking us.
  //
  // Lax SameSite is still correct for the OAuth callback (top-level
  // navigation from accounts.google.com → app.seldonframe.com). The
  // state cookie gets the same treatment for consistency.
  cookies: {
    pkceCodeVerifier: {
      name: "authjs.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 15,
      },
    },
    state: {
      name: "authjs.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 15,
      },
    },
  },
  logger: {
    error(code, ...message) {
      console.error("[auth][logger][error]", code, ...message);
    },
    warn(code, ...message) {
      console.warn("[auth][logger][warn]", code, ...message);
    },
    debug(code, ...message) {
      console.log("[auth][logger][debug]", code, ...message);
    },
  },
  adapter,
  ...authConfig,
});
