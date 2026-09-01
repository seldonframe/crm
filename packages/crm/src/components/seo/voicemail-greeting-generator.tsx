"use client";

// 2026-08-24 — The voicemail greeting generator: the interactive island of
// /tools/voicemail-greeting-generator.
//
// Pure client-side template composition (same idiom as
// ai-receptionist-script-generator.tsx): no LLM, no network calls, deterministic
// output. Four variants because a business needs four recordings, not one:
// main, after-hours, holiday/closure, and emergency overflow.
//
// The honest CTA on this page is not "record a better greeting" but "stop
// sending callers to voicemail", so the script generator sits above a callout
// that says exactly that.

import { useMemo, useState, type ReactElement } from "react";
import { copyToClipboard } from "@/components/seo/result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";

export type GreetingKind = "main" | "after-hours" | "holiday" | "emergency";
export type VoicemailBusiness =
  | "home-services"
  | "hvac"
  | "salon"
  | "medspa"
  | "dental"
  | "cleaning"
  | "auto"
  | "legal"
  | "other";

export const GREETING_KINDS: readonly { id: GreetingKind; label: string; why: string }[] = [
  { id: "main", label: "Main greeting", why: "What plays when nobody picks up during business hours." },
  { id: "after-hours", label: "After hours", why: "What plays once you are closed, with the next-open time stated out loud." },
  { id: "holiday", label: "Holiday / closure", why: "A dated message for a stretch you are closed, so callers stop wondering." },
  { id: "emergency", label: "Emergency overflow", why: "For lines where a genuine emergency needs a route that is not a callback." },
] as const;

export const VOICEMAIL_BUSINESSES: readonly { id: VoicemailBusiness; label: string }[] = [
  { id: "home-services", label: "Home services" },
  { id: "hvac", label: "HVAC" },
  { id: "salon", label: "Salon / barber" },
  { id: "medspa", label: "Med spa" },
  { id: "dental", label: "Dental" },
  { id: "cleaning", label: "Cleaning" },
  { id: "auto", label: "Auto repair" },
  { id: "legal", label: "Legal" },
  { id: "other", label: "Other" },
];

/** What the caller should say, per business type. This is the line that turns a
 *  useless "leave a message" into a voicemail you can actually act on. */
const WHAT_TO_LEAVE: Record<VoicemailBusiness, string> = {
  "home-services": "your name, the address, and what is going wrong",
  hvac: "your name, the service address, and whether the system is not heating or not cooling",
  salon: "your name, the service you want, and the days that work for you",
  medspa: "your name, the treatment you are interested in, and the best time to reach you",
  dental: "your name, whether you are a current patient, and whether you are in any pain",
  cleaning: "your name, the address, and whether you want a one-time or recurring clean",
  auto: "your name, the year and model of the vehicle, and what it is doing",
  legal: "your name, a callback number, and one sentence about the matter",
  other: "your name, a callback number, and how we can help",
};

export interface VoicemailInput {
  kind: GreetingKind;
  business: VoicemailBusiness;
  businessName: string;
  hours: string;
  /** How fast you promise to call back, in plain words ("the same day"). */
  callbackWindow: string;
  /** Optional emergency line to read out. Empty string omits the sentence. */
  emergencyNumber: string;
  /** Optional booking URL to read out. Empty string omits the sentence. */
  bookingLink: string;
  /** Only used by the holiday variant. */
  reopenDate: string;
}

const DEFAULT_NAME = "our office";

/**
 * Compose one greeting script. Deterministic. Every optional field is either
 * present and voiced, or absent and silently skipped: no placeholder text ever
 * ships into a recording script (the "[your name here]" failure mode).
 */
export function composeVoicemailGreeting(input: VoicemailInput): string {
  const name = input.businessName.trim() || DEFAULT_NAME;
  const hours = input.hours.trim();
  const callback = input.callbackWindow.trim() || "the next business day";
  const leave = WHAT_TO_LEAVE[input.business];
  const lines: string[] = [];

  switch (input.kind) {
    case "main":
      lines.push(`Thanks for calling ${name}. We are with a customer right now and can't get to the phone.`);
      lines.push(`Leave ${leave} after the tone, and we will call you back ${callback}.`);
      if (hours) lines.push(`Our hours are ${hours}.`);
      break;

    case "after-hours":
      lines.push(`You have reached ${name}. We are closed right now.`);
      if (hours) lines.push(`We are open ${hours}.`);
      lines.push(`Leave ${leave} after the tone and we will call you back once we open.`);
      break;

    case "holiday":
      lines.push(`Thanks for calling ${name}. We are closed for the holiday and will not be checking messages until we reopen.`);
      if (input.reopenDate.trim()) lines.push(`We reopen on ${input.reopenDate.trim()}.`);
      lines.push(`Leave ${leave} after the tone and we will work through messages in the order they came in.`);
      break;

    case "emergency":
      lines.push(`You have reached ${name}. Nobody is available to take your call.`);
      lines.push(`If this is a life-safety emergency, hang up and call 911.`);
      lines.push(`Leave ${leave} after the tone, and we will call you back ${callback}.`);
      break;
  }

  if (input.emergencyNumber.trim() && input.kind !== "emergency") {
    lines.push(`If this is an emergency that can't wait, call ${input.emergencyNumber.trim()}.`);
  }
  if (input.emergencyNumber.trim() && input.kind === "emergency") {
    lines.push(`For an urgent job that can't wait for a callback, call ${input.emergencyNumber.trim()} and someone will pick up.`);
  }
  if (input.bookingLink.trim()) {
    lines.push(`You can also book yourself in at ${input.bookingLink.trim()}, any time of day.`);
  }

  lines.push("Thanks, and we will talk soon.");
  return lines.join("\n\n");
}

/** Rough spoken length. 150 words per minute is a normal, unhurried pace for a
 *  recorded greeting, so this is words / 2.5 rounded up to whole seconds. */
export function estimateSpokenSeconds(script: string): number {
  const words = script.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 2.5);
}

export function VoicemailGreetingGenerator(): ReactElement {
  const [kind, setKind] = useState<GreetingKind>("main");
  const [business, setBusiness] = useState<VoicemailBusiness>("home-services");
  const [businessName, setBusinessName] = useState("");
  const [hours, setHours] = useState("Monday through Friday, 8 to 5");
  const [callbackWindow, setCallbackWindow] = useState("the same day");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [reopenDate, setReopenDate] = useState("");
  const [copied, setCopied] = useState(false);

  const script = useMemo(
    () =>
      composeVoicemailGreeting({ kind, business, businessName, hours, callbackWindow, emergencyNumber, bookingLink, reopenDate }),
    [kind, business, businessName, hours, callbackWindow, emergencyNumber, bookingLink, reopenDate],
  );
  const seconds = estimateSpokenSeconds(script);
  const kindMeta = GREETING_KINDS.find((k) => k.id === kind);

  async function handleCopy(): Promise<void> {
    const ok = await copyToClipboard(script);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <Pills label="Greeting" hint="Record all four eventually. Start with the one that plays most." options={GREETING_KINDS} value={kind} onChange={setKind} />
      {kindMeta && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.6)", lineHeight: 1.55 }}>{kindMeta.why}</p>}

      <div style={{ marginTop: 22 }}>
        <Pills label="Business type" hint="Changes what the greeting asks the caller to leave." options={VOICEMAIL_BUSINESSES} value={business} onChange={setBusiness} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 22 }}>
        <Field label="Business name" hint="Read out at the top of the greeting." value={businessName} onChange={setBusinessName} placeholder="Northside Plumbing" />
        <Field label="Callback window" hint="What you actually promise. Do not promise an hour you can't hit." value={callbackWindow} onChange={setCallbackWindow} placeholder="the same day" />
        <Field label="Business hours" hint="Spoken out loud, so write it the way you would say it." value={hours} onChange={setHours} placeholder="Monday through Friday, 8 to 5" />
        <Field label="Emergency number (optional)" hint="Left out entirely if you leave this blank." value={emergencyNumber} onChange={setEmergencyNumber} placeholder="555 0142" />
        <Field label="Booking link (optional)" hint="Read out so callers can book instead of waiting." value={bookingLink} onChange={setBookingLink} placeholder="northsideplumbing.com/book" />
        {kind === "holiday" && (
          <Field label="Reopen date" hint="Only used by the holiday greeting." value={reopenDate} onChange={setReopenDate} placeholder="Monday, January 5th" />
        )}
      </div>

      <div style={{ marginTop: 26, borderTop: `1px solid ${INK10}`, paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)" }}>
            Your script
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>about {seconds} seconds spoken</div>
        </div>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: 15,
            lineHeight: 1.65,
            color: INK,
            background: "#fff",
            border: `1px solid ${INK10}`,
            borderRadius: 12,
            padding: "18px 20px",
          }}
        >
          {script}
        </pre>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{ background: INK, color: "#F6F2EA", border: "none", padding: "11px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            {copied ? "Copied ✓" : "Copy script"}
          </button>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.55)", lineHeight: 1.55 }}>
          Read it once out loud before you record. If it takes longer than about 20 seconds, cut a sentence: most callers
          hang up before a long greeting finishes.
        </p>
      </div>

      <div style={{ marginTop: 26, borderTop: `1px solid ${INK10}`, paddingTop: 22 }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: INK }}>Or stop sending callers to voicemail entirely</div>
        <p style={{ margin: "8px 0 14px", fontSize: 14.5, lineHeight: 1.6, color: "rgba(34,29,23,0.72)" }}>
          The best greeting in the world still asks the caller to wait. A SeldonFrame AI receptionist answers instead:
          it picks up, asks the same questions this script asks for, and books the job into your calendar while the
          caller is still on the line.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <a href="/signup" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
            Answer every call. Start free.
          </a>
        </div>
      </div>
    </div>
  );
}

function Pills<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}): ReactElement {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>{label}</legend>
      <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>{hint}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const active = o.id === value;
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
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}): ReactElement {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{label}</span>
      <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 8px", lineHeight: 1.45 }}>{hint}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 14.5, fontFamily: "inherit", boxSizing: "border-box" }}
      />
    </label>
  );
}
