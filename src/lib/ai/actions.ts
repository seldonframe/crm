"use server";

import { getAnthropicClient } from "@/lib/ai/client";
import { withSoulContext } from "@/lib/ai/prompts";
import { getSoul } from "@/lib/soul/server";

async function runClaude(prompt: string) {
  const client = getAnthropicClient();

  if (!client) {
    return { configured: false, message: "AI is not configured. Add ANTHROPIC_API_KEY to enable this feature." };
  }

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n");

  return { configured: true, message: text };
}

export async function smartContactSummary(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Summarize this contact context for the next call: ${input}`, soul));
}

export async function draftMessage(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Draft a follow-up message: ${input}`, soul));
}

export async function scoreLead(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Score this lead from 0-100 and explain why: ${input}`, soul));
}

export async function autoCategorize(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Suggest tags, status, and pipeline stage from this intake data: ${input}`, soul));
}

export async function renewalFollowupAlert(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Create a renewal/follow-up alert and re-engagement message: ${input}`, soul));
}

export async function draftProposal(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Draft a proposal outline using this context: ${input}`, soul));
}

export async function generateSoulFromNarrative(input: string) {
  const soul = await getSoul();
  return runClaude(withSoulContext(`Generate a complete OrgSoul JSON from this narrative: ${input}`, soul));
}
