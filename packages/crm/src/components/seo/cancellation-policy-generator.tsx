"use client";

// 2026-08-24 — The cancellation policy generator: the interactive island of
// /tools/cancellation-policy-generator.
//
// Sibling of /tools/no-show-cost-calculator: that page quantifies the problem
// in dollars, this one produces the document that fixes it. Pure client-side
// composition, deterministic, no network calls.
//
// Three outputs, not one, because a policy only works where the customer
// actually reads it: the long version for the website, a short version that
// fits in a confirmation text, and a one-line consent string for the booking
// form checkbox.
//
// HONESTY: this generates policy text, not legal advice. The page says so, and
// so does the note under the output.

import { useMemo, useState, type ReactElement } from "react";
import { copyToClipboard } from "@/components/seo/result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";

export type PolicyIndustry = "salon" | "medspa" | "dental" | "home-services" | "cleaning" | "auto" | "fitness" | "consulting";
export type FeeMode = "none" | "flat" | "percent";

export const POLICY_INDUSTRIES: readonly { id: PolicyIndustry; label: string }[] = [
  { id: "salon", label: "Salon / barber" },
  { id: "medspa", label: "Med spa" },
  { id: "dental", label: "Dental" },
  { id: "home-services", label: "Home services" },
  { id: "cleaning", label: "Cleaning" },
  { id: "auto", label: "Auto repair" },
  { id: "fitness", label: "Fitness / studio" },
  { id: "consulting", label: "Consulting" },
] as const;

/** What the appointment is called, and what happens when someone shows up late. */
const INDUSTRY_TERMS: Record<PolicyIndustry, { visit: string; lateRule: string }> = {
  salon: {
    visit: "appointment",
    lateRule: "If you arrive more than 15 minutes late we may need to shorten or reschedule your service so the guest after you is not delayed.",
  },
  medspa: {
    visit: "appointment",
    lateRule: "If you arrive more than 15 minutes late we may need to shorten or reschedule your treatment so the rest of the day runs on time.",
  },
  dental: {
    visit: "appointment",
    lateRule: "If you arrive more than 15 minutes late we may need to reschedule so every other patient is still seen on time.",
  },
  "home-services": {
    visit: "service visit",
    lateRule: "Our technician waits 15 minutes at the property for access. After that the visit is treated as a no-show.",
  },
  cleaning: {
    visit: "clean",
    lateRule: "Our team waits 15 minutes for access to the property. After that the visit is treated as a no-show.",
  },
  auto: {
    visit: "service appointment",
    lateRule: "Vehicles dropped off more than 30 minutes late may be moved to the next available slot.",
  },
  fitness: {
    visit: "session",
    lateRule: "Doors close 5 minutes after the session starts, for the safety of everyone already warmed up.",
  },
  consulting: {
    visit: "session",
    lateRule: "Sessions start and end at the scheduled time. Arriving late shortens the session rather than extending it.",
  },
};

export interface CancellationPolicyInput {
  industry: PolicyIndustry;
  businessName: string;
  /** How much warning you require, in hours. */
  noticeHours: number;
  lateFeeMode: FeeMode;
  lateFeeValue: number;
  noShowFeeMode: FeeMode;
  noShowFeeValue: number;
  depositRequired: boolean;
  depositMode: Exclude<FeeMode, "none">;
  depositValue: number;
}

export interface CancellationPolicyOutput {
  /** The long version, for a website or booking page. */
  full: string;
  /** The short version, sized for a confirmation or reminder text. */
  short: string;
  /** A one-line consent string for the booking form checkbox. */
  checkbox: string;
}

/** "18 hours", "24 hours", "7 days" — whichever a human would actually say. */
export function formatNotice(hours: number): string {
  const h = Math.max(1, Math.round(hours));
  if (h >= 96 && h % 24 === 0) return `${h / 24} days`;
  return `${h} hours`;
}

/** A fee as words, or null when the fee is switched off. */
export function formatFee(mode: FeeMode, value: number): string | null {
  if (mode === "none") return null;
  if (mode === "percent") return `${Math.round(value)}% of the service price`;
  return `$${Math.round(value)}`;
}

/** The same fee, compressed for the SMS version. The short policy has to fit in
 *  one 160-character segment, and "of the service price" is 20 of them. */
export function formatFeeShort(mode: FeeMode, value: number): string | null {
  if (mode === "none") return null;
  if (mode === "percent") return `${Math.round(value)}% of the service`;
  return `$${Math.round(value)}`;
}

/**
 * Compose the three policy texts. Deterministic, and every switched-off rule is
 * omitted rather than emitted as an empty clause: a policy that says "a fee of
 * $0 applies" is worse than no policy at all.
 */
export function composeCancellationPolicy(input: CancellationPolicyInput): CancellationPolicyOutput {
  const terms = INDUSTRY_TERMS[input.industry];
  // Named business → third person ("Rowan Studio holds…"); unnamed → first
  // person ("We hold…"), so the text reads right either way.
  const name = input.businessName.trim();
  const subject = name || "We";
  const notice = formatNotice(input.noticeHours);
  const lateFee = formatFee(input.lateFeeMode, input.lateFeeValue);
  const noShowFee = formatFee(input.noShowFeeMode, input.noShowFeeValue);
  const deposit = input.depositRequired ? formatFee(input.depositMode, input.depositValue) : null;

  const full: string[] = [];
  full.push("Cancellation and no-show policy");
  full.push("");
  full.push(
    `${subject} hold${name ? "s" : ""} your ${terms.visit} time exclusively for you, so we ask for at least ${notice} notice if you need to cancel or reschedule.`,
  );
  full.push("");
  full.push(`Cancelling or rescheduling: free of charge with at least ${notice} notice.`);
  full.push("");
  full.push(
    lateFee
      ? `Late cancellations: cancelling with less than ${notice} notice is charged ${lateFee}.`
      : `Late cancellations: there is no fee, but repeated late cancellations may mean we ask for a deposit before your next booking.`,
  );
  full.push("");
  full.push(
    noShowFee
      ? `No-shows: missing your ${terms.visit} without letting us know is charged ${noShowFee}.`
      : `No-shows: there is no fee, but a repeated no-show may mean we can no longer hold time for you in advance.`,
  );
  if (deposit) {
    full.push("");
    full.push(
      `Deposits: a ${deposit} deposit is required to hold your ${terms.visit}. It goes toward your final bill, and it is refunded in full if you cancel with at least ${notice} notice.`,
    );
  }
  full.push("");
  full.push(`Arriving late: ${terms.lateRule}`);
  full.push("");
  full.push(
    `How to cancel: reply to your confirmation message or use the reschedule link in it. Reaching us before the ${notice} mark is what matters, not how you do it.`,
  );

  // The short version goes in a reminder text, so it is written to survive a
  // single 160-character SMS segment with the fees spelled out compactly.
  const lateShort = formatFeeShort(input.lateFeeMode, input.lateFeeValue);
  const noShowShort = formatFeeShort(input.noShowFeeMode, input.noShowFeeValue);
  const shortParts: string[] = [];
  if (lateShort && noShowShort) {
    shortParts.push(`Reminder: cancelling inside ${notice} is charged ${lateShort}, and no-shows ${noShowShort}.`);
  } else if (lateShort) {
    shortParts.push(`Reminder: cancelling inside ${notice} is charged ${lateShort}.`);
  } else if (noShowShort) {
    shortParts.push(`Reminder: we need ${notice} notice to cancel. No-shows are charged ${noShowShort}.`);
  } else {
    shortParts.push(`Reminder: we need ${notice} notice to cancel or reschedule.`);
  }
  shortParts.push("Reply here to reschedule.");

  const checkboxParts: string[] = [`I understand that ${name ? `${name}'s` : "the"} cancellation policy requires ${notice} notice`];
  if (lateFee && noShowFee) {
    checkboxParts.push(`, that a late cancellation is charged ${lateFee}, and that a no-show is charged ${noShowFee}.`);
  } else if (lateFee) {
    checkboxParts.push(`, and that a late cancellation is charged ${lateFee}.`);
  } else if (noShowFee) {
    checkboxParts.push(`, and that a no-show is charged ${noShowFee}.`);
  } else {
    checkboxParts.push(".");
  }

  return {
    full: full.join("\n"),
    short: shortParts.join(" "),
    checkbox: checkboxParts.join(""),
  };
}

const NOTICE_PRESETS = [2, 4, 12, 24, 48, 72, 168] as const;

export function CancellationPolicyGenerator(): ReactElement {
  const [industry, setIndustry] = useState<PolicyIndustry>("salon");
  const [businessName, setBusinessName] = useState("");
  const [noticeHours, setNoticeHours] = useState(24);
  const [lateFeeMode, setLateFeeMode] = useState<FeeMode>("percent");
  const [lateFeeValue, setLateFeeValue] = useState(50);
  const [noShowFeeMode, setNoShowFeeMode] = useState<FeeMode>("percent");
  const [noShowFeeValue, setNoShowFeeValue] = useState(100);
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositMode, setDepositMode] = useState<Exclude<FeeMode, "none">>("flat");
  const [depositValue, setDepositValue] = useState(50);
  const [copied, setCopied] = useState<string | null>(null);

  const policy = useMemo(
    () =>
      composeCancellationPolicy({
        industry,
        businessName,
        noticeHours,
        lateFeeMode,
        lateFeeValue,
        noShowFeeMode,
        noShowFeeValue,
        depositRequired,
        depositMode,
        depositValue,
      }),
    [industry, businessName, noticeHours, lateFeeMode, lateFeeValue, noShowFeeMode, noShowFeeValue, depositRequired, depositMode, depositValue],
  );

  async function copy(text: string, key: string): Promise<void> {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>Industry</legend>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          Sets what the appointment is called and what the late-arrival rule says.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {POLICY_INDUSTRIES.map((o) => {
            const active = o.id === industry;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setIndustry(o.id)}
                aria-pressed={active}
                style={{
                  border: active ? `1.5px solid ${GREEN}` : `1.5px solid ${INK10}`,
                  background: active ? GREEN : "rgba(255,255,255,0.6)",
                  color: active ? "#F6F2EA" : INK,
                  borderRadius: 999,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label style={{ display: "block", marginTop: 22 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Business name (optional)</span>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          Leave it blank and the policy reads in the first person instead.
        </div>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Rowan Studio"
          aria-label="Business name"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      </label>

      <fieldset style={{ border: "none", padding: 0, margin: "22px 0 0" }}>
        <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>Notice window</legend>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          How far ahead someone has to cancel to avoid a fee. Currently {formatNotice(noticeHours)}.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {NOTICE_PRESETS.map((h) => {
            const active = h === noticeHours;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setNoticeHours(h)}
                aria-pressed={active}
                style={{
                  border: active ? `1.5px solid ${GREEN}` : `1.5px solid ${INK10}`,
                  background: active ? GREEN : "rgba(255,255,255,0.6)",
                  color: active ? "#F6F2EA" : INK,
                  borderRadius: 999,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                {formatNotice(h)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <FeeRow
        label="Late cancellation fee"
        hint="Charged when someone cancels inside the notice window."
        mode={lateFeeMode}
        value={lateFeeValue}
        onModeChange={setLateFeeMode}
        onValueChange={setLateFeeValue}
      />
      <FeeRow
        label="No-show fee"
        hint="Charged when nobody shows up and nobody called."
        mode={noShowFeeMode}
        value={noShowFeeValue}
        onModeChange={setNoShowFeeMode}
        onValueChange={setNoShowFeeValue}
      />

      <div style={{ marginTop: 22, borderTop: `1px solid ${INK10}`, paddingTop: 20 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={depositRequired}
            onChange={(e) => setDepositRequired(e.target.checked)}
            style={{ marginTop: 3, accentColor: GREEN, width: 17, height: 17 }}
          />
          <span>
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>Require a deposit to hold the booking</span>
            <span style={{ display: "block", fontSize: 12.5, color: "rgba(34,29,23,0.6)", marginTop: 2, lineHeight: 1.5 }}>
              The strongest no-show deterrent there is, and the one customers push back on hardest. Adds a deposit
              clause to the policy.
            </span>
          </span>
        </label>
        {depositRequired && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 14, paddingLeft: 27 }}>
            <ModeToggle mode={depositMode} onChange={(m) => setDepositMode(m as Exclude<FeeMode, "none">)} allowNone={false} />
            <input
              type="number"
              min={1}
              value={depositValue}
              onChange={(e) => setDepositValue(Math.max(1, Number(e.target.value) || 0))}
              aria-label="Deposit amount"
              style={{ width: 110, padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 14.5, fontFamily: "inherit" }}
            />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>{formatFee(depositMode, depositValue)}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${INK10}`, paddingTop: 24, display: "grid", gap: 22 }}>
        <Output
          title="Full policy (website or booking page)"
          body={policy.full}
          copied={copied === "full"}
          onCopy={() => copy(policy.full, "full")}
        />
        <Output
          title="Short version (confirmation or reminder text)"
          body={policy.short}
          copied={copied === "short"}
          onCopy={() => copy(policy.short, "short")}
        />
        <Output
          title="Booking form checkbox"
          body={policy.checkbox}
          copied={copied === "checkbox"}
          onCopy={() => copy(policy.checkbox, "checkbox")}
        />
      </div>

      <p style={{ margin: "18px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.55)", lineHeight: 1.55 }}>
        This produces policy text, not legal advice. Charging a card for a missed appointment depends on what your
        payment processor and your local consumer rules allow, so check both before you switch fees on.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
        <a href="/signup" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
          Put the policy in front of every booking. Start free.
        </a>
      </div>
    </div>
  );
}

function FeeRow({
  label,
  hint,
  mode,
  value,
  onModeChange,
  onValueChange,
}: {
  label: string;
  hint: string;
  mode: FeeMode;
  value: number;
  onModeChange: (m: FeeMode) => void;
  onValueChange: (v: number) => void;
}): ReactElement {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>{hint}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <ModeToggle mode={mode} onChange={onModeChange} allowNone />
        {mode !== "none" && (
          <>
            <input
              type="number"
              min={1}
              value={value}
              onChange={(e) => onValueChange(Math.max(1, Number(e.target.value) || 0))}
              aria-label={`${label} amount`}
              style={{ width: 110, padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 14.5, fontFamily: "inherit" }}
            />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>{formatFee(mode, value)}</span>
          </>
        )}
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange, allowNone }: { mode: FeeMode; onChange: (m: FeeMode) => void; allowNone: boolean }): ReactElement {
  const options: { id: FeeMode; label: string }[] = allowNone
    ? [
        { id: "none", label: "No fee" },
        { id: "flat", label: "Flat $" },
        { id: "percent", label: "% of service" },
      ]
    : [
        { id: "flat", label: "Flat $" },
        { id: "percent", label: "% of service" },
      ];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((o) => {
        const active = o.id === mode;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            style={{
              border: active ? `1.5px solid ${GREEN}` : `1.5px solid ${INK10}`,
              background: active ? GREEN : "rgba(255,255,255,0.6)",
              color: active ? "#F6F2EA" : INK,
              borderRadius: 999,
              padding: "8px 14px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Output({ title, body, copied, onCopy }: { title: string; body: string; copied: boolean; onCopy: () => void }): ReactElement {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)" }}>{title}</div>
        <button
          type="button"
          onClick={onCopy}
          style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "7px 15px", borderRadius: 9, fontWeight: 700, fontSize: 13, background: "rgba(255,255,255,0.6)", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          fontFamily: "inherit",
          fontSize: 14.5,
          lineHeight: 1.65,
          color: INK,
          background: "#fff",
          border: `1px solid ${INK10}`,
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        {body}
      </pre>
    </div>
  );
}
