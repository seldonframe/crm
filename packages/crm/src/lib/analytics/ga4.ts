import { createHash } from "node:crypto";

const GA4_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const ALLOWED_EVENTS = new Set(["sign_up", "begin_checkout", "purchase"]);

type Ga4Value = string | number | boolean;

export type Ga4EventInput = {
  eventName: "sign_up" | "begin_checkout" | "purchase";
  userId: string;
  params?: Record<string, Ga4Value | null | undefined>;
};

export type Ga4Config = {
  measurementId?: string;
  apiSecret?: string;
  debugMode?: boolean;
  fetchImpl?: typeof fetch;
};

function pseudonymousClientId(userId: string): string {
  return `sf.${createHash("sha256").update(userId).digest("hex").slice(0, 32)}`;
}

export async function sendGa4Event(input: Ga4EventInput, config: Ga4Config = {}): Promise<boolean> {
  const measurementId = (config.measurementId ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
  const apiSecret = (config.apiSecret ?? process.env.GA_MEASUREMENT_PROTOCOL_API_SECRET ?? "").trim();
  if (!measurementId || !apiSecret || !input.userId || !ALLOWED_EVENTS.has(input.eventName)) return false;

  const params = Object.fromEntries(
    Object.entries(input.params ?? {}).filter(([, value]) => value !== null && value !== undefined),
  );
  const debugMode = config.debugMode ?? process.env.GA_MEASUREMENT_PROTOCOL_DEBUG === "1";
  if (debugMode) params.debug_mode = 1;
  const url = `${GA4_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;

  try {
    const response = await (config.fetchImpl ?? fetch)(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: pseudonymousClientId(input.userId),
        user_id: input.userId,
        events: [{ name: input.eventName, params }],
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
