// v1.30.0 — SeldonFrame Docs homepage. Linear-class craft.
//
// Structure mirrors linear.app/docs:
//   1. Hero (title + 1-line subtitle)
//   2. Popular: 4 large feature cards
//   3. Quick start: structured step-by-step
//   4. Core concepts: card grid
//   5. Per-category sections with link cards
//
// Card hover lifts subtly (border tint shift + scale-up icon). Generous
// padding. No badges, no marketing fluff — just clean information.
//
// The homepage is an agency-oriented map of the existing article routes.
// Keep the first click concrete: an agency should be able to move from
// promise → first workspace → client handoff without guessing.

import Link from "next/link";
import {
  Sparkles,
  Bot,
  Building2,
  Calendar,
  Boxes,
  Layout,
  Mail,
  Zap,
  CreditCard,
  Code2,
  Users,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function DocsHome() {
  return (
    <article className="space-y-16">
      {/* HERO */}
      <header className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
          SeldonFrame Docs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything an agency needs to sell and operate AI front offices:
          branded website, booking, intake, CRM, client portal, and agents
          in repeatable workspaces. Start from a client URL, run the evals,
          publish, and hand it off without rebuilding the stack every time.
        </p>
      </header>

      {/* POPULAR */}
      <section className="space-y-4" id="popular">
        <h2 className="text-base font-semibold text-foreground">Popular</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BigCard
            icon={<Sparkles className="size-5" />}
            title="Agency delivery loop"
            description="Take a client URL from workspace build to tested, branded handoff"
            href="/docs/getting-started/first-workspace"
          />
          <BigCard
            icon={<Bot className="size-5" />}
            title="Build a chatbot"
            description="One MCP call creates a website chatbot with FAQ, booking, and evals"
            href="/docs/agents/build-chatbot"
          />
          <BigCard
            icon={<Building2 className="size-5" />}
            title="Your first workspace"
            description="Create a client workspace with website, CRM, booking, and a public URL"
            href="/docs/getting-started/first-workspace"
          />
          <BigCard
            icon={<Code2 className="size-5" />}
            title="Claude Code MCP"
            description="Connect the MCP and operate client workspaces in natural language"
            href="/docs/getting-started/connect-claude-code"
          />
        </div>
      </section>

      {/* QUICK START */}
      <section className="space-y-4" id="getting-started">
        <h2 className="text-base font-semibold text-foreground">Getting started</h2>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Step
            num={1}
            title="Install the SeldonFrame MCP"
            body="In Claude Code, run claude mcp add seldonframe -- npx -y @seldonframe/mcp@latest. The MCP exposes ~140 tools for building, managing, and observing your business OS."
            code="claude mcp add seldonframe -- npx -y @seldonframe/mcp@latest"
          />
          <Step
            num={2}
            title="Build a client workspace"
            body="Give Claude Code the client's URL, industry, services, and hours. Seldon generates the public website, booking page, intake form, CRM pipeline, and agent foundation."
            code='"Build a workspace for Cypress Pine HVAC in Phoenix — services: AC repair, install, maintenance. Mon-Sat 7a-7p."'
          />
          <Step
            num={3}
            title="Add a chatbot"
            body="One MCP call wires a chatbot into the client website. Pass FAQ, pricing facts, and greeting; Seldon runs the safety evals and gives you a publishable embed."
            code="build_website_chatbot({ workspace_id, name, faq, pricing_facts, greeting })"
          />
          <Step
            num={4}
            title="Customize from the dashboard"
            body="Open the dashboard at app.seldonframe.com, apply the client's brand, review the evals, and publish the workspace. Hand the client their branded portal while you keep the agency view."
            isLast
          />
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="space-y-4" id="concepts">
        <h2 className="text-base font-semibold text-foreground">Core concepts</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SmallCard
            icon={<Sparkles className="size-4" />}
            title="Soul"
            description="The auto-derived business identity (industry, voice, services, pricing) that shapes every public surface."
            href="/docs#soul"
          />
          <SmallCard
            icon={<Bot className="size-4" />}
            title="Agents"
            description="AI assistants that talk to your customers — chatbots, voice receptionists (soon), SMS bots (soon)."
            href="/docs#agents"
          />
          <SmallCard
            icon={<Boxes className="size-4" />}
            title="Templates"
            description="Pre-built page sections (hero / services / FAQ / pricing) and workflow archetypes."
            href="/docs#templates"
          />
          <SmallCard
            icon={<Building2 className="size-4" />}
            title="Workspaces"
            description="One workspace = one business. Each gets its own subdomain, CRM, agents, and settings."
            href="/docs#workspaces"
          />
          <SmallCard
            icon={<Users className="size-4" />}
            title="Customers"
            description="Your CRM — every booking, form submission, and chat creates a customer record."
            href="/docs#contacts"
          />
          <SmallCard
            icon={<Calendar className="size-4" />}
            title="Bookings"
            description="Public booking page + calendar, with reschedule + cancel workflows."
            href="/docs#booking-pages"
          />
        </div>
      </section>

      {/* DETAILED CATEGORIES */}
      <section className="space-y-8" id="categories">
        <CategoryBlock
          icon={<Bot className="size-5" />}
          title="AI Agents"
          items={[
            { title: "Build a chatbot", description: "configure_llm + create_agent + publish in one call", href: "/docs/agents/build-chatbot" },
            { title: "Eval gate", description: "Run safety probes before the client-facing agent goes live", href: "/docs/agents/eval-gate" },
            { title: "Update an agent", description: "Edit FAQ / pricing / greeting / capabilities inline", href: "/docs/agents/update-agent" },
            { title: "Embed on your site", description: "Single <script> tag, mobile-first, brand-inheriting", href: "/docs/agents/embed" },
          ]}
        />

        <CategoryBlock
          icon={<Layout className="size-5" />}
          title="Pages & website"
          items={[
            { title: "Public pages", description: "Hero, services, FAQ, CTA — composed from the client's Soul", href: "/docs/pages/public-pages" },
            { title: "Forms", description: "Lead capture; submissions become customers automatically", href: "/docs/pages/forms" },
            { title: "Booking pages", description: "Slot picker tied to availability + appointment types", href: "/docs/pages/booking" },
            { title: "Custom domains", description: "Use the client's domain instead of a Seldon subdomain", href: "/docs/your-business/custom-domains" },
          ]}
        />

        <CategoryBlock
          icon={<Mail className="size-5" />}
          title="Email & Automation"
          items={[
            { title: "Send email", description: "One-off messages or saved templates; via Resend", href: "/docs#email" },
            { title: "Automation rules", description: "Trigger-based workflows for follow-ups, reminders, alerts", href: "/docs#automations" },
            { title: "Post-booking reminders", description: "24h-before durable reminder via Vercel Workflows", href: "/docs#reminders" },
            { title: "Suppression list", description: "Email/phone opt-outs for compliance", href: "/docs#suppression" },
          ]}
        />

        <CategoryBlock
          icon={<Zap className="size-5" />}
          title="Integrations"
          items={[
            { title: "Anthropic / OpenAI", description: "Managed AI on hosted (no key); bring your own key when you self-host", href: "/docs/integrations/llm" },
            { title: "Stripe", description: "Accept payments for bookings, services, subscriptions", href: "/docs#stripe" },
            { title: "Twilio", description: "Send SMS reminders, confirmations, follow-ups", href: "/docs#twilio" },
            { title: "Google Calendar", description: "Two-way sync for bookings", href: "/docs#google" },
          ]}
        />

        <CategoryBlock
          icon={<Code2 className="size-5" />}
          title="Developers"
          items={[
            { title: "Claude Code MCP", description: "140+ tools exposed via Model Context Protocol", href: "/docs#claude-code" },
            { title: "API keys", description: "Programmatic access for custom integrations", href: "/docs#api" },
            { title: "Webhooks", description: "Push events to external services on booking/form submission/etc.", href: "/docs#webhooks" },
            { title: "GitHub", description: "Source code, examples, contributing guide", href: "https://github.com/seldonframe/seldonframe" },
          ]}
        />

        <CategoryBlock
          icon={<CreditCard className="size-5" />}
          title="Billing"
          items={[
            { title: "Pricing", description: "Builder $29, Managed $49, Agency $99/$199/$299", href: "/docs/billing/pricing" },
            { title: "Managed AI included", description: "AI is bundled on every plan — no key to paste, no usage wallet", href: "/docs/billing/pricing" },
            { title: "Invoices", description: "Stripe customer portal for receipts + payment methods", href: "/docs/billing/invoices" },
          ]}
        />
      </section>

      {/* LEARN */}
      <section className="space-y-4" id="learn">
        <h2 className="text-base font-semibold text-foreground">Learn</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <SmallCard
            icon={<GraduationCap className="size-4" />}
            title="Video tutorials"
            description="Watch how Seldon clients build workspaces, deploy chatbots, and configure their CRM from scratch."
            href="https://youtube.com/@seldonframe"
            external
          />
          <SmallCard
            icon={<BookOpen className="size-4" />}
            title="Customer stories"
            description="Real businesses running on SeldonFrame: HVAC, dental, coaching, agency."
            href="/docs#case-studies"
          />
        </div>
      </section>

      {/* CTA */}
      <footer className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-10 text-center">
        <div className="mx-auto max-w-xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Build your first workspace</h2>
          <p className="text-muted-foreground">
            Sign up, connect Claude Code, type one prompt. Your AI front
            office is live on a real domain in 60 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/#hero-form"
              className="inline-flex h-10 items-center px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start building
            </Link>
            <Link
              href="https://seldonframe.com"
              className="inline-flex h-10 items-center gap-1.5 px-5 rounded-md border bg-background text-sm font-medium hover:bg-accent transition-colors"
            >
              See it in action
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}

// ─── components ─────────────────────────────────────────────────────────

function BigCard({
  icon,
  title,
  description,
  href,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const Wrapper = external ? "a" : Link;
  return (
    <Wrapper
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="group rounded-xl border bg-card p-6 hover:border-primary/30 hover:bg-accent/20 transition-all"
    >
      <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Wrapper>
  );
}

function SmallCard({
  icon,
  title,
  description,
  href,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const Wrapper = external ? "a" : Link;
  return (
    <Wrapper
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="group rounded-lg border bg-card p-5 hover:border-primary/30 hover:bg-accent/20 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </span>
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Wrapper>
  );
}

function Step({
  num,
  title,
  body,
  code,
  isLast,
}: {
  num: number;
  title: string;
  body: string;
  code?: string;
  isLast?: boolean;
}) {
  return (
    <div className={`flex gap-5 p-6 ${!isLast ? "border-b" : ""}`}>
      <div className="size-8 shrink-0 rounded-full border bg-background flex items-center justify-center text-sm font-semibold text-foreground">
        {num}
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
        </div>
        {code && (
          <pre className="rounded-md border bg-muted/40 px-3 py-2.5 overflow-x-auto text-xs font-mono">
            {code}
          </pre>
        )}
      </div>
    </div>
  );
}

function CategoryBlock({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: Array<{ title: string; description: string; href: string }>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="grid gap-px rounded-xl border bg-border overflow-hidden">
        {items.map((item, i) => {
          const isExternal = item.href.startsWith("http");
          const Wrapper = isExternal ? "a" : Link;
          return (
            <Wrapper
              key={i}
              href={item.href}
              {...(isExternal ? { target: "_blank", rel: "noopener" } : {})}
              className="group flex items-center justify-between gap-4 bg-card hover:bg-accent/30 transition-colors px-5 py-4"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-sm text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
