import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { sendGa4Event } from "../../../src/lib/analytics/ga4";

describe("sendGa4Event", () => {
  test("sends a pseudonymous server-side conversion payload without PII", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];
    const result = await sendGa4Event(
      {
        eventName: "purchase",
        userId: "user-123",
        params: { transaction_id: "cs_123", value: 29, currency: "USD", plan_id: "builder" },
      },
      {
        measurementId: "G-TEST",
        apiSecret: "secret",
        fetchImpl: async (url, init) => {
          calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
          return new Response(null, { status: 204 });
        },
      },
    );

    assert.equal(result, true);
    assert.equal(calls[0]?.url, "https://www.google-analytics.com/mp/collect?measurement_id=G-TEST&api_secret=secret");
    const body = calls[0]?.body as { client_id: string; user_id: string; events: Array<{ params: Record<string, unknown> }> };
    assert.equal(body.user_id, "user-123");
    assert.match(body.client_id, /^sf\./);
    assert.equal(body.events[0]?.params.email, undefined);
    assert.equal(body.events[0]?.params.transaction_id, "cs_123");
  });

  test("fails soft when configuration is absent or the endpoint fails", async () => {
    assert.equal(await sendGa4Event({ eventName: "sign_up", userId: "u" }, { measurementId: "", apiSecret: "" }), false);
    assert.equal(
      await sendGa4Event({ eventName: "begin_checkout", userId: "u" }, {
        measurementId: "G-TEST",
        apiSecret: "secret",
        fetchImpl: async () => { throw new Error("offline"); },
      }),
      false,
    );
  });

  test("can opt into GA4 DebugView without enabling it in production by default", async () => {
    let payload: { events: Array<{ params: Record<string, unknown> }> } = { events: [] };
    await sendGa4Event(
      { eventName: "sign_up", userId: "user-debug" },
      {
        measurementId: "G-DEBUG",
        apiSecret: "secret",
        debugMode: true,
        fetchImpl: async (_url, init) => {
          payload = JSON.parse(String(init?.body)) as { events: Array<{ params: Record<string, unknown> }> };
          return new Response(null, { status: 204 });
        },
      },
    );
    assert.equal(payload.events[0]?.params.debug_mode, 1);
  });
});
