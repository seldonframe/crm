import type { FrameworkConfig } from "@/lib/types/config";

const config: FrameworkConfig = {
  appName: "EstateFlow CRM",
  appDescription: "Pipeline management for real estate teams",
  logo: "/logo.svg",
  entities: {
    contact: { singular: "Buyer", plural: "Buyers" },
    deal: { singular: "Property Deal", plural: "Property Deals" },
    activity: { singular: "Showing", plural: "Showings" },
    pipeline: { singular: "Deal Flow", plural: "Deal Flows" },
  },
  defaultPipeline: {
    name: "Property Deal Flow",
    stages: [
      { name: "Lead", color: "#1d4ed8", probability: 10 },
      { name: "Qualified", color: "#2563eb", probability: 35 },
      { name: "Property Tour", color: "#3b82f6", probability: 55 },
      { name: "Offer", color: "#22c55e", probability: 80 },
      { name: "Closed", color: "#16a34a", probability: 100 }
    ],
  },
  defaultCustomFields: { contact: [{ key: "budget", label: "Budget", type: "number" }], deal: [{ key: "property_type", label: "Property Type", type: "text" }] },
  features: { deals: true, intakeForms: true, aiFeatures: true, soulSystem: true, import: true, export: true, webhooks: true, api: true },
  contactStatuses: ["new", "active_search", "offer_made", "closed"],
  activityTypes: ["showing", "call", "email", "task"],
};

export default config;
