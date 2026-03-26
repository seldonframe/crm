import type { FrameworkConfig } from "@/lib/types/config";

const config: FrameworkConfig = {
  appName: "CommerceCRM",
  appDescription: "Customer lifecycle CRM for ecommerce teams",
  logo: "/logo.svg",
  entities: {
    contact: { singular: "Customer", plural: "Customers" },
    deal: { singular: "Order Opportunity", plural: "Order Opportunities" },
    activity: { singular: "Interaction", plural: "Interactions" },
    pipeline: { singular: "Revenue Pipeline", plural: "Revenue Pipelines" },
  },
  defaultPipeline: {
    name: "Revenue Pipeline",
    stages: [
      { name: "Lead", color: "#0ea5e9", probability: 10 },
      { name: "Engaged", color: "#14b8a6", probability: 35 },
      { name: "Abandoned Cart", color: "#f59e0b", probability: 50 },
      { name: "Converted", color: "#22c55e", probability: 100 },
      { name: "Churn Risk", color: "#ef4444", probability: 25 }
    ],
  },
  defaultCustomFields: { contact: [{ key: "lifetime_value", label: "Lifetime Value", type: "number" }], deal: [{ key: "aov", label: "AOV", type: "number" }] },
  features: { deals: true, intakeForms: true, aiFeatures: true, soulSystem: true, import: true, export: true, webhooks: true, api: true },
  contactStatuses: ["new", "repeat", "vip", "churn_risk"],
  activityTypes: ["email", "order", "note", "task"],
};

export default config;
