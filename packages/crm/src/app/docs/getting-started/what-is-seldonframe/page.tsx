// v1.30.2 — Docs article: What is SeldonFrame.

import { ArticleShell, Callout, InAppLink } from "../../article-shell";

export const metadata = {
  title: "What is SeldonFrame · Docs",
  description: "SeldonFrame is the agent-native, open-source front-office platform agencies use to deploy branded client workspaces.",
};

export default function Page() {
  return (
    <ArticleShell
      category="Getting started"
      categoryHref="/docs"
      title="What is SeldonFrame"
      lede="The agent-native, open-source alternative to GoHighLevel for agencies: deploy a branded website, booking flow, CRM, intake, and agent for every client from one workspace."
      githubPath="app/docs/getting-started/what-is-seldonframe/page.tsx"
    >
      <h2>The short version</h2>
      <p>
        Agencies usually stitch together a CRM, website builder, scheduler,
        forms, messaging, and an AI layer for every client. SeldonFrame
        turns that delivery work into one repeatable client workspace:
        branded website, booking page, AI receptionist, intake form, CRM,
        reminders, and client portal sharing the same data and operating
        surface.
      </p>

      <Callout variant="tip" title="Deliver, then operate">
        Start from the client's URL, apply their brand and service facts,
        run the agent evals, and publish a live workspace. Your agency keeps
        the master view while the client gets a branded portal.
      </Callout>

      <h2>What you get on day one</h2>
      <ul>
        <li>
          <strong>A CRM</strong> for your contacts, deals, and bookings.
        </li>
        <li>
          <strong>A public website</strong> at <code>your-name.app.seldonframe.com</code>{" "}
          (or the client's custom domain) with landing pages, intake forms, and
          booking pages.
        </li>
        <li>
          <strong>AI agents</strong> you can drop on your site as a chatbot.
          They can book, reschedule, and answer questions — all with an
          eval-gated safety check before going live.
        </li>
        <li>
          <strong>Email + automations.</strong> Send emails from your domain.
          Trigger reminders, follow-ups, and sequences from CRM events.
        </li>
      </ul>

      <h2>What makes it AI-native</h2>
      <p>
        Two things. First, the same workspace any agency operates in the
        dashboard is also exposed as an MCP server — so Claude Code (or any
        MCP-aware agent) can read and write the client CRM, build pages, and
        ship agents through natural language. You can say{" "}
        <em>"build me a chatbot for my HVAC business"</em> in Claude Code
        and watch it happen.
      </p>
      <p>
        Second, the runtime trusts the model. SeldonFrame uses thin
        harnesses and fat skill-packs (markdown skills the prompt composer
        reads), which means the system gets better automatically as
        Claude / GPT / Gemini get better. You don't rewrite SeldonFrame
        when a new model ships.
      </p>

      <Callout variant="tip" title="Antifragile by design">
        The agent runtime regenerates on critical-fail and pulls intelligence
        from editable markdown skill-packs — never from hard-coded heuristics.
        Better models = better outcomes, no rewrites.
      </Callout>

      <h2>Who it's for</h2>
      <p>
        Agencies and independent operators who sell AI front offices to
        service businesses. Solo operators can run their own workspace too;
        agencies get the white-label client workspaces, branded portals, and
        repeatable delivery workflow.
      </p>

      <h2>Next steps</h2>
      <ul>
        <li>
          <InAppLink href="/docs/getting-started/first-workspace">
            Build your first workspace
          </InAppLink>
        </li>
        <li>
          <InAppLink href="/docs/getting-started/connect-claude-code">
            Connect Claude Code
          </InAppLink>
        </li>
        <li>
          <InAppLink href="/docs/getting-started/demo">The 3-minute demo</InAppLink>
        </li>
      </ul>
    </ArticleShell>
  );
}
