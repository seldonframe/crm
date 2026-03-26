import type { FrameworkConfig } from "@/lib/types/config";

const config: FrameworkConfig = {
  appName: "CoachCRM",
  appDescription: "Client management for coaching businesses",
  logo: "/logo.svg",
  entities: {
    contact: { singular: "Client", plural: "Clients" },
    deal: { singular: "Engagement", plural: "Engagements" },
    activity: { singular: "Session", plural: "Sessions" },
    pipeline: { singular: "Journey", plural: "Journeys" },
  },
  defaultPipeline: {
    name: "Client Journey",
    stages: [
      { name: "Inquiry", color: "#6366f1", probability: 10 },
      { name: "Discovery", color: "#8b5cf6", probability: 30 },
      { name: "Proposal", color: "#a855f7", probability: 55 },
      { name: "Active Program", color: "#22c55e", probability: 90 },
      { name: "Completed", color: "#16a34a", probability: 100 },
    ],
  },
  defaultCustomFields: {
    contact: [{ key: "goal", label: "Goal", type: "textarea" }],
    deal: [{ key: "program", label: "Program", type: "select", options: ["1:1", "Group", "VIP"] }],
  },
  features: { deals: true, intakeForms: true, aiFeatures: true, soulSystem: true, import: true, export: true, webhooks: true, api: true },
  contactStatuses: ["inquiry", "prospect", "active_client", "past_client"],
  activityTypes: ["session", "note", "task", "email"],
};

export default config;
