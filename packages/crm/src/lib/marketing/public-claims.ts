/**
 * Public-facing product facts shared by the website, docs, and generated
 * marketing surfaces. Keep this module dependency-free so it can be imported
 * from both server and client components.
 */

export const LICENSE_LABEL = "AGPL-3.0" as const;

export const AGENCY_POSITIONING =
  "SeldonFrame is the agent-native, open-source alternative to GoHighLevel for agencies selling AI front offices to local businesses." as const;

export const AGENCY_HERO_HEADLINE = "Sell AI front offices. Deploy them in minutes." as const;

export const AGENCY_HERO_SUBHEAD =
  "Build a branded website, booking flow, CRM, intake, and AI agent for every client from one workspace—then operate it under your agency brand." as const;

export const AGENCY_PLAN_FACTS = [
  { id: "builder", name: "Builder", priceMonthly: 29, audience: "one business you operate" },
  { id: "managed", name: "Managed", priceMonthly: 49, audience: "one managed workspace" },
  { id: "agency_starter", name: "Agency Starter", priceMonthly: 99, audience: "10 client workspaces" },
  { id: "agency_growth", name: "Agency Growth", priceMonthly: 199, audience: "30 client workspaces" },
  { id: "agency_scale", name: "Agency Scale", priceMonthly: 299, audience: "unlimited client workspaces" },
] as const;

export const HOSTED_AI_POLICY =
  "Managed uses SeldonFrame's keys; Builder and Agency plans are BYOK." as const;
