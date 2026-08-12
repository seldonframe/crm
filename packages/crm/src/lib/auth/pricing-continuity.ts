/** Paid-plan values that can be selected from the public pricing ladder. */
export const SELLABLE_PLAN_IDS = [
  "builder",
  "managed",
  "agency_starter",
  "agency_growth",
  "agency_scale",
] as const;

export type SellablePlanId = (typeof SELLABLE_PLAN_IDS)[number];

const SELLABLE_PLAN_SET = new Set<string>(SELLABLE_PLAN_IDS);

export function normalizePaidPlan(value: unknown): SellablePlanId | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return SELLABLE_PLAN_SET.has(normalized) ? (normalized as SellablePlanId) : null;
}

export function buildPaidSignupRedirect(value: unknown): string | null {
  const plan = normalizePaidPlan(value);
  return plan ? `/pricing?plan=${encodeURIComponent(plan)}&resume_checkout=1` : null;
}
