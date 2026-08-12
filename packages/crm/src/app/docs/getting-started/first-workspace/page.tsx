// v1.30.2 — Docs article: Build your first workspace.

import { ArticleShell, Callout, InAppLink, Step } from "../../article-shell";

export const metadata = {
  title: "Build your first workspace · Docs",
  description: "Create a branded SeldonFrame client workspace, run the agent evals, and hand it off from one repeatable workflow.",
};

export default function Page() {
  return (
    <ArticleShell
      category="Getting started"
      categoryHref="/docs"
      title="Build your first client workspace"
      lede="Start with a client URL, apply their brand and service facts, run the agent evals, publish, and hand off the workspace."
      githubPath="app/docs/getting-started/first-workspace/page.tsx"
    >
      <h2>Step-by-step</h2>

      <Step n={1} title="Sign up as the agency operator">
        Go to <InAppLink href="/signup">/signup</InAppLink> and create your
        account with email or Google. You land on the dashboard with your
        agency workspace ready to create the first client workspace.
      </Step>

      <Step n={2} title="Start from the client's URL">
        Open <InAppLink href="/templates">Templates</InAppLink> or connect
        Claude Code. Give SeldonFrame the client's URL, industry, services,
        hours, and brand direction. The starter Soul pre-fills CRM fields,
        pipeline stages, booking types, and the first agent.
      </Step>

      <Step n={3} title="Brand the client workspace">
        Open <InAppLink href="/settings/branding">Branding</InAppLink>.
        Give the client workspace a name, upload their logo, and pick a
        primary color. The public site, booking flow, portal, and agent
        inherit the same brand.
      </Step>

      <Step n={4} title="Run evals and test a booking">
        Open the agent test surface, run the safety evals, and complete one
        non-template booking. This is the agency's proof that the client
        front office is ready before publishing.
      </Step>

      <Step n={5} title="Publish and hand off">
        The public site is available at{" "}
        <code>your-workspace.app.seldonframe.com</code>. Want a custom
        domain like <code>www.clientbiz.com</code>? See{" "}
        <InAppLink href="/docs/your-business/custom-domains">Custom domains</InAppLink>.
        Keep the agency master view and invite the client to their branded
        portal.
      </Step>

      <Callout variant="tip" title="Skip the click-through">
          Step 2 onward is faster through Claude Code — see{" "}
        <a href="/docs/getting-started/connect-claude-code">Connect Claude Code</a>.
          It can create the client workspace, brand it, build the agent, and
          prepare the handoff in one back-and-forth.
      </Callout>

      <h2>What's wired up automatically</h2>
      <ul>
        <li>
          A <strong>public landing page</strong> at your subdomain with your
          brand colors and a contact form.
        </li>
        <li>
          A <strong>CRM</strong> with starter pipeline stages and the custom
          fields your template needs (e.g. "service type" for HVAC).
        </li>
        <li>
          A <strong>starter chatbot</strong> in draft mode, tuned for your
          template. Run evals and publish when you're ready.
        </li>
        <li>
          An <strong>MCP token</strong> you can paste into Claude Code to
          drive everything from the terminal.
        </li>
      </ul>

      <h2>Next</h2>
      <ul>
        <li><InAppLink href="/docs/getting-started/connect-claude-code">Connect Claude Code</InAppLink></li>
        <li><InAppLink href="/docs/agents/build-chatbot">Build a chatbot</InAppLink></li>
        <li><InAppLink href="/docs/your-business/custom-domains">Custom domains</InAppLink></li>
      </ul>
    </ArticleShell>
  );
}
