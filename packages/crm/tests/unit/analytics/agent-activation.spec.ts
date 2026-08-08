// agent_conversation_started / workspace_activated — the activation-moment
// PostHog events. Pure event builders + the pure "should this fire" decision
// for workspace_activated's idempotency, so the decidable logic is
// unit-testable without a DB. Mirrors funnel-events.spec.ts's pattern.
//
// Run:
//   node --import tsx --test tests/unit/analytics/agent-activation.spec.ts

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  buildAgentConversationStartedEvent,
  buildWorkspaceActivatedEvent,
  shouldFireWorkspaceActivated,
} from "../../../src/lib/analytics/agent-activation";

describe("buildAgentConversationStartedEvent", () => {
  test("builds the full event with distinct_id = org_id", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "org-1",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "sms",
      isDeployedClientAgent: true,
      isFirstConversationForWorkspace: true,
    });
    assert.deepEqual(result, {
      event: "agent_conversation_started",
      distinctId: "org-1",
      properties: {
        org_id: "org-1",
        agent_id: "agent-1",
        conversation_id: "conv-1",
        channel: "sms",
        is_deployed_client_agent: true,
        is_first_conversation_for_workspace: true,
      },
    });
  });

  test("returns null and warns when orgId is missing", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "sms",
      isFirstConversationForWorkspace: false,
    });
    assert.equal(result, null);
  });

  test("returns null when agentId is missing", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "org-1",
      agentId: "",
      conversationId: "conv-1",
      channel: "sms",
      isFirstConversationForWorkspace: false,
    });
    assert.equal(result, null);
  });

  test("returns null when conversationId is missing", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "org-1",
      agentId: "agent-1",
      conversationId: "",
      channel: "sms",
      isFirstConversationForWorkspace: false,
    });
    assert.equal(result, null);
  });

  test("returns null when channel is missing", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "org-1",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "",
      isFirstConversationForWorkspace: false,
    });
    assert.equal(result, null);
  });

  test("is_deployed_client_agent omitted when unknown (undefined)", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "org-1",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "web",
      isFirstConversationForWorkspace: false,
    });
    assert.equal("is_deployed_client_agent" in (result?.properties ?? {}), false);
  });

  test("is_deployed_client_agent false is included (not treated as absent)", () => {
    const result = buildAgentConversationStartedEvent({
      orgId: "org-1",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "web",
      isDeployedClientAgent: false,
      isFirstConversationForWorkspace: false,
    });
    assert.equal(result?.properties.is_deployed_client_agent, false);
  });
});

describe("buildWorkspaceActivatedEvent", () => {
  test("builds the event, distinct_id = org_id", () => {
    const result = buildWorkspaceActivatedEvent({
      orgId: "org-1",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "email",
    });
    assert.deepEqual(result, {
      event: "workspace_activated",
      distinctId: "org-1",
      properties: {
        org_id: "org-1",
        agent_id: "agent-1",
        conversation_id: "conv-1",
        channel: "email",
      },
    });
  });

  test("returns null when orgId is missing", () => {
    const result = buildWorkspaceActivatedEvent({
      orgId: "",
      agentId: "agent-1",
      conversationId: "conv-1",
      channel: "email",
    });
    assert.equal(result, null);
  });
});

describe("shouldFireWorkspaceActivated", () => {
  test("fires when this is the first conversation ever recorded for the org", () => {
    assert.equal(shouldFireWorkspaceActivated(0), true);
  });

  test("does not fire on the second conversation", () => {
    assert.equal(shouldFireWorkspaceActivated(1), false);
  });

  test("does not fire on later conversations", () => {
    assert.equal(shouldFireWorkspaceActivated(42), false);
  });

  test("treats a non-finite count as 'do not fire' (safe default)", () => {
    assert.equal(shouldFireWorkspaceActivated(Number.NaN), false);
  });
});
