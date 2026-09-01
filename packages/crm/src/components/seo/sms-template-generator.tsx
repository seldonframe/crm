"use client";

// 2026-08-24 — The SMS template generator: the interactive island of
// /tools/sms-template-generator.
//
// Every page ranking for "sms templates for small business" is a static
// listicle you scroll and retype. The wedge here is that the message is
// composed for your message type × industry × tone, keeps its merge fields, and
// is counted live against the real SMS segment boundaries — because a template
// that quietly spills past 160 characters doubles what every send costs.
//
// Pure client-side string composition: no LLM, no network calls, deterministic
// (same inputs always produce the same message). Styled on the MKT palette to
// match the other free-tool pages.

import { useMemo, useState, type ReactElement } from "react";
import { copyToClipboard } from "@/components/seo/result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";
const AMBER = "#B8860B";

export type SmsKind = "missed-call" | "reminder" | "confirmation" | "review-request" | "quote-followup" | "on-my-way";
export type SmsIndustry = "home-services" | "hvac" | "salon" | "medspa" | "dental" | "cleaning" | "auto" | "legal";
export type SmsTone = "warm" | "professional" | "brief";

export const SMS_KINDS: readonly { id: SmsKind; label: string; why: string }[] = [
  { id: "missed-call", label: "Missed-call text-back", why: "Sent the moment a call goes unanswered. The single highest-leverage business text there is." },
  { id: "reminder", label: "Appointment reminder", why: "Sent a day out. The cheapest no-show reduction available to a booking business." },
  { id: "confirmation", label: "Booking confirmation", why: "Sent immediately after booking, so the appointment lands in the customer's thread." },
  { id: "review-request", label: "Review request", why: "Sent shortly after the job is done, while the customer still feels the result." },
  { id: "quote-followup", label: "Quote follow-up", why: "Sent a few days after a quote nobody replied to. Most quotes die of silence, not price." },
  { id: "on-my-way", label: "On my way", why: "Sent when the tech leaves. Kills the 'where are they' call before it happens." },
] as const;

export const SMS_INDUSTRIES: readonly { id: SmsIndustry; label: string }[] = [
  { id: "home-services", label: "Home services" },
  { id: "hvac", label: "HVAC" },
  { id: "salon", label: "Salon / barber" },
  { id: "medspa", label: "Med spa" },
  { id: "dental", label: "Dental" },
  { id: "cleaning", label: "Cleaning" },
  { id: "auto", label: "Auto repair" },
  { id: "legal", label: "Legal" },
] as const;

export const SMS_TONES: readonly { id: SmsTone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "professional", label: "Professional" },
  { id: "brief", label: "Brief" },
] as const;

/** The industry-specific nouns the templates slot in. */
const INDUSTRY_WORDS: Record<SmsIndustry, { job: string; visit: string; person: string }> = {
  "home-services": { job: "the repair", visit: "service call", person: "technician" },
  hvac: { job: "heating and cooling", visit: "service call", person: "technician" },
  salon: { job: "your next look", visit: "appointment", person: "stylist" },
  medspa: { job: "your treatment", visit: "appointment", person: "provider" },
  dental: { job: "your dental care", visit: "appointment", person: "hygienist" },
  cleaning: { job: "the clean", visit: "clean", person: "cleaner" },
  auto: { job: "your vehicle", visit: "service visit", person: "technician" },
  legal: { job: "your matter", visit: "consultation", person: "attorney" },
};

/** The merge fields the templates use, with what each one fills in. */
export const MERGE_FIELDS: readonly { token: string; fills: string }[] = [
  { token: "{{first_name}}", fills: "the customer's first name" },
  { token: "{{business_name}}", fills: "your business name" },
  { token: "{{appointment_time}}", fills: "the booked date and time" },
  { token: "{{booking_link}}", fills: "your booking page URL" },
  { token: "{{review_link}}", fills: "your direct Google review link" },
  { token: "{{tech_name}}", fills: "whoever is showing up" },
] as const;

export const OPT_OUT_LINE = " Reply STOP to opt out.";

/**
 * The message bodies, keyed kind → tone. `{job}`, `{visit}` and `{person}` are
 * industry slots filled by INDUSTRY_WORDS; everything in {{double braces}} is a
 * merge field that survives into the output untouched.
 *
 * ASCII only, on purpose: a curly apostrophe or an em dash flips the whole
 * message from GSM-7 to UCS-2 and cuts a single segment from 160 characters to
 * 70. These templates stay in the cheap encoding.
 *
 * Length budget: written so the SENT message (merge fields filled with ordinary
 * values) fits in one 160-character GSM-7 segment even with the opt-out line
 * appended. The on-screen count is higher because {{first_name}} occupies 14
 * characters as a placeholder and about 5 as a name — see the note under the
 * textarea, and the sent-length test in tests/unit/seo/free-tools.spec.ts.
 */
const BODIES: Record<SmsKind, Record<SmsTone, string>> = {
  "missed-call": {
    warm: "Hi {{first_name}}, {{business_name}} here - sorry we missed you. Tell us what you need for {job} and we will call right back.",
    professional: "{{first_name}}, this is {{business_name}} returning your missed call. Reply with what you need and we will get you scheduled.",
    brief: "{{business_name}} here, sorry we missed you. What do you need? Text back and we will sort it.",
  },
  reminder: {
    warm: "Hi {{first_name}}, quick reminder about your {visit} with {{business_name}} on {{appointment_time}}. Reply C to confirm or R to reschedule.",
    professional: "{{business_name}}: this is a reminder of your {visit} on {{appointment_time}}. Reply C to confirm or R to reschedule.",
    brief: "Reminder: {visit} with {{business_name}} on {{appointment_time}}. Reply C to confirm.",
  },
  confirmation: {
    warm: "You are all set, {{first_name}}. Your {visit} with {{business_name}} is booked for {{appointment_time}}. We will remind you the day before.",
    professional: "{{business_name}}: your {visit} is confirmed for {{appointment_time}}. View or change it here: {{booking_link}}",
    brief: "Confirmed: {{appointment_time}} with {{business_name}}. Change it here: {{booking_link}}",
  },
  "review-request": {
    warm: "Hi {{first_name}}, thanks for choosing {{business_name}}. If we did right by you, a quick Google review means a lot: {{review_link}}",
    professional: "{{first_name}}, thank you for your business. Would you take a moment to review {{business_name}} on Google? {{review_link}}",
    brief: "Thanks {{first_name}}. Mind leaving {{business_name}} a Google review? {{review_link}}",
  },
  "quote-followup": {
    warm: "Hi {{first_name}}, checking in on the quote we sent for {job}. Any questions, or shall we get you on the schedule?",
    professional: "{{first_name}}, following up on the quote {{business_name}} sent for {job}. Happy to answer questions or book a start date.",
    brief: "{{first_name}}, still want to move ahead on that quote? Reply YES and we will book it.",
  },
  "on-my-way": {
    warm: "Hi {{first_name}}, {{tech_name}} from {{business_name}} is on the way and should be with you around {{appointment_time}}.",
    professional: "{{business_name}}: your {person} {{tech_name}} is en route and expected at approximately {{appointment_time}}.",
    brief: "{{tech_name}} from {{business_name}} is on the way, about {{appointment_time}}.",
  },
};

export interface SmsTemplateInput {
  kind: SmsKind;
  industry: SmsIndustry;
  tone: SmsTone;
  /** Filled into {{business_name}} when present; the merge field is kept otherwise. */
  businessName?: string;
  includeOptOut: boolean;
}

/** Compose one message. Deterministic: same inputs, same string, always. */
export function composeSmsTemplate(input: SmsTemplateInput): string {
  const words = INDUSTRY_WORDS[input.industry];
  let body = BODIES[input.kind][input.tone]
    .replace(/\{job\}/g, words.job)
    .replace(/\{visit\}/g, words.visit)
    .replace(/\{person\}/g, words.person);

  const name = input.businessName?.trim();
  if (name) body = body.replace(/\{\{business_name\}\}/g, name);

  return input.includeOptOut ? `${body}${OPT_OUT_LINE}` : body;
}

// ─── Segment counting ────────────────────────────────────────────────────────
//
// Carriers bill per segment, not per message. GSM-7 fits 160 characters in one
// segment (153 each once a message splits, because the concatenation header
// eats 7). Any character outside the GSM-7 alphabet forces UCS-2, where a
// segment holds 70 (67 concatenated). One smart quote costs you 90 characters.

const GSM7_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ" +
  " !\"#¤%&'()*+,-./0123456789:;<=>?" +
  "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§" +
  "¿abcdefghijklmnopqrstuvwxyzäöñüà";

/** Characters that are GSM-7 but cost two units (escape + char). */
const GSM7_EXTENDED = "^{}\\[~]|€";

export interface SmsCount {
  /** Characters as typed (UTF-16 code units). */
  typedLength: number;
  /** Units the carrier actually bills, after the GSM-7 escape weighting. */
  billableLength: number;
  encoding: "GSM-7" | "UCS-2";
  segments: number;
  /** Units available in each segment at this message's length. */
  limitPerSegment: number;
}

/** Count characters and segments the way a carrier does. */
export function countSmsSegments(text: string): SmsCount {
  let gsm = true;
  let billable = 0;

  for (const char of text) {
    if (GSM7_EXTENDED.includes(char)) {
      billable += 2;
    } else if (GSM7_BASIC.includes(char)) {
      billable += 1;
    } else {
      gsm = false;
      break;
    }
  }

  if (!gsm) {
    const units = text.length; // UCS-2 bills UTF-16 code units
    const limit = units <= 70 ? 70 : 67;
    return {
      typedLength: text.length,
      billableLength: units,
      encoding: "UCS-2",
      segments: units === 0 ? 0 : Math.ceil(units / limit),
      limitPerSegment: limit,
    };
  }

  const limit = billable <= 160 ? 160 : 153;
  return {
    typedLength: text.length,
    billableLength: billable,
    encoding: "GSM-7",
    segments: billable === 0 ? 0 : Math.ceil(billable / limit),
    limitPerSegment: limit,
  };
}

export function SmsTemplateGenerator(): ReactElement {
  const [kind, setKind] = useState<SmsKind>("missed-call");
  const [industry, setIndustry] = useState<SmsIndustry>("home-services");
  const [tone, setTone] = useState<SmsTone>("warm");
  const [businessName, setBusinessName] = useState("");
  const [includeOptOut, setIncludeOptOut] = useState(true);
  const [edited, setEdited] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generated = useMemo(
    () => composeSmsTemplate({ kind, industry, tone, businessName, includeOptOut }),
    [kind, industry, tone, businessName, includeOptOut],
  );
  // The textarea is editable, but every control change resets it to the freshly
  // composed message — the generator is the source of truth, the edit is a tweak.
  const message = edited ?? generated;
  const count = countSmsSegments(message);
  const kindMeta = SMS_KINDS.find((k) => k.id === kind);

  function change<T>(setter: (v: T) => void): (v: T) => void {
    return (v: T) => {
      setter(v);
      setEdited(null);
    };
  }

  async function handleCopy(): Promise<void> {
    const ok = await copyToClipboard(message);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <PillGroup label="Message type" hint="Pick the moment this text gets sent." options={SMS_KINDS} value={kind} onChange={change(setKind)} />
      {kindMeta && (
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.6)", lineHeight: 1.55 }}>{kindMeta.why}</p>
      )}

      <div style={{ marginTop: 22 }}>
        <PillGroup label="Industry" hint="Changes the words the template uses for the job and the visit." options={SMS_INDUSTRIES} value={industry} onChange={change(setIndustry)} />
      </div>

      <div style={{ marginTop: 22 }}>
        <PillGroup label="Tone" hint="Warm reads human, professional reads clinical, brief reads like a busy owner." options={SMS_TONES} value={tone} onChange={change(setTone)} />
      </div>

      <label style={{ display: "block", marginTop: 22 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Business name (optional)</span>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          Leave it blank to keep <code>{"{{business_name}}"}</code> as a merge field for your CRM to fill.
        </div>
        <input
          type="text"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            setEdited(null);
          }}
          placeholder="Northside Plumbing"
          aria-label="Business name"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      </label>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 18, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={includeOptOut}
          onChange={(e) => {
            setIncludeOptOut(e.target.checked);
            setEdited(null);
          }}
          style={{ marginTop: 3, accentColor: GREEN, width: 17, height: 17 }}
        />
        <span>
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>Include an opt-out line</span>
          <span style={{ display: "block", fontSize: 12.5, color: "rgba(34,29,23,0.6)", marginTop: 2, lineHeight: 1.5 }}>
            US carriers expect a visible opt-out on marketing texts. Check your own A2P 10DLC registration before you
            send at volume.
          </span>
        </span>
      </label>

      <div style={{ marginTop: 26, borderTop: `1px solid ${INK10}`, paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)" }}>
            Your message
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: count.segments > 1 ? AMBER : GREEN }}>
            {count.billableLength} / {count.limitPerSegment} characters · {count.segments} segment{count.segments === 1 ? "" : "s"}
          </div>
        </div>
        <textarea
          value={message}
          onChange={(e) => setEdited(e.target.value)}
          rows={5}
          aria-label="Generated SMS message"
          style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${INK10}`, fontSize: 15, lineHeight: 1.6, fontFamily: "inherit", boxSizing: "border-box", background: "#fff", resize: "vertical" }}
        />
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.6)", lineHeight: 1.55 }}>
          Encoding: <strong>{count.encoding}</strong>.{" "}
          {count.encoding === "UCS-2"
            ? "A non-GSM character (often a curly quote, an emoji or a dash pasted from a word processor) dropped this message into UCS-2, where one segment holds 70 characters instead of 160. Retype the punctuation to get back to 160."
            : "This counts the text exactly as written. Merge fields change length when you send: a name is usually shorter than {{first_name}}, a link is often longer. Treat the number as an estimate and leave a little room."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{ background: INK, color: "#F6F2EA", border: "none", padding: "11px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            {copied ? "Copied ✓" : "Copy message"}
          </button>
          {edited !== null && (
            <button
              type="button"
              onClick={() => setEdited(null)}
              style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 21px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
            >
              Reset to generated
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, borderTop: `1px solid ${INK10}`, paddingTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)", marginBottom: 10 }}>
          Merge fields
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {MERGE_FIELDS.map((f) => (
            <li key={f.token} style={{ fontSize: 13.5, color: "rgba(34,29,23,0.72)" }}>
              <code style={{ fontWeight: 700, color: INK }}>{f.token}</code>: {f.fills}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
        <a href="/signup" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
          Send these automatically. Start free.
        </a>
      </div>
    </div>
  );
}

function PillGroup<T extends string>({
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
