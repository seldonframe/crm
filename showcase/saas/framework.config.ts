import type { FrameworkConfig } from "@/lib/types/config";

const config: FrameworkConfig = {
  appName: "SaaS Revenue CRM",
  appDescription: "Pipeline and expansion CRM for SaaS teams",
  logo: "/logo.svg",
  entities: {
    contact: { singular: "Account", plural: "Accounts" },
    deal: { singular: "Subscription", plural: "Subscriptions" },
    activity: { singular: "Usage Event", plural: "Usage Events" },
    pipeline: { singular: "Growth Pipeline", plural: "Growth Pipelines" },
  },
  defaultPipeline: {
    name: "Growth Pipeline",
    stages: [
      { name: "Trial", color: "#6366f1", probability: 10 },
      { name: "Activated", color: "#8b5cf6", probability: 35 },
      { name: "Converted", color: "#22c55e", probability: 100 },
      { name: "Expansion", color: "#16a34a", probability: 85 },
      { name: "Churn Risk", color: "#ef4444", probability: 20 }
    ],
  },
  defaultCustomFields: { contact: [{ key: "plan", label: "Plan", type: "text" }], deal: [{ key: "mrr", label: "MRR", type: "number" }] },
  features: { deals: true, intakeForms: true, aiFeatures: true, soulSystem: true, import: true, export: true, webhooks: true, api: true },
  contactStatuses: ["trial", "active", "expansion", "churn_risk"],
  activityTypes: ["usage", "email", "call", "task"],
};

export default config;
