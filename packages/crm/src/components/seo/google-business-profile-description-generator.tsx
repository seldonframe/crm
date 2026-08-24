"use client";

// 2026-08-24 — The Google Business Profile description generator: the
// interactive island of /tools/google-business-profile-description-generator.
//
// Google caps the "from the business" description at 750 characters, and the
// field silently refuses anything longer, so the useful part of a tool like
// this is the budget, not the prose. The composer builds sentences in priority
// order and drops the optional ones from the bottom up when the budget runs
// out, so you always get a complete description rather than one cut mid-word.
//
// Pure client-side composition: no LLM, no network calls, deterministic.

import { useMemo, useState, type ReactElement } from "react";
import { copyToClipboard } from "@/components/seo/result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";
const AMBER = "#B8860B";

/** Google's published cap on the business description field. */
export const GBP_DESCRIPTION_LIMIT = 750;

export type GbpTone = "warm" | "professional" | "direct";

export const GBP_TONES: readonly { id: GbpTone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "professional", label: "Professional" },
  { id: "direct", label: "Direct" },
] as const;

export const GBP_DIFFERENTIATORS: readonly { id: string; label: string; sentence: string }[] = [
  { id: "licensed", label: "Licensed & insured", sentence: "We are fully licensed and insured." },
  { id: "family", label: "Family owned", sentence: "We are a family owned and operated business." },
  { id: "same-day", label: "Same-day service", sentence: "Same-day appointments are available in most cases." },
  { id: "upfront", label: "Upfront pricing", sentence: "You get upfront pricing before any work begins." },
  { id: "emergency", label: "24/7 emergency", sentence: "We answer emergency calls around the clock." },
  { id: "warranty", label: "Warrantied work", sentence: "Our work is backed by a written warranty." },
  { id: "veteran", label: "Veteran owned", sentence: "We are a veteran owned business." },
  { id: "free-estimates", label: "Free estimates", sentence: "Estimates are free and come with no obligation." },
  { id: "bilingual", label: "Bilingual team", sentence: "Our team serves customers in English and Spanish." },
] as const;

/** Cap on how many differentiators the description will carry. */
export const MAX_DIFFERENTIATORS = 3;
/** Cap on how many services the description will list. */
export const MAX_SERVICES = 5;

export interface GbpInput {
  businessName: string;
  businessType: string;
  city: string;
  services: string[];
  yearsInBusiness: number;
  /** Differentiator ids, in the order they should appear. */
  differentiators: string[];
  tone: GbpTone;
}

export interface GbpOutput {
  text: string;
  length: number;
  remaining: number;
  /** True when at least one optional sentence had to be dropped to fit. */
  trimmed: boolean;
}

/** "a, b and c" — the Oxford-free list a description actually reads well with. */
function joinList(items: string[]): string {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} and ${clean[clean.length - 1]}`;
}

/**
 * Compose the description. Sentence order is fixed; the optional sentences
 * (differentiators last, then years in business) are dropped from the bottom up
 * until the whole thing fits inside GBP_DESCRIPTION_LIMIT. Nothing is ever cut
 * mid-sentence.
 */
export function composeGbpDescription(input: GbpInput): GbpOutput {
  const name = input.businessName.trim() || "Our team";
  const type = input.businessType.trim() || "local service business";
  const city = input.city.trim();
  const services = input.services.map((s) => s.trim()).filter(Boolean).slice(0, MAX_SERVICES);
  const where = city ? ` in ${city} and the surrounding area` : "";

  const opening =
    input.tone === "warm"
      ? `${name} is a ${type}${where}.`
      : input.tone === "professional"
        ? `${name} provides ${type} services${where}.`
        : `${name} does ${type} work${where}.`;

  const serviceSentence = services.length > 0 ? `We handle ${joinList(services)}.` : "";

  const yearsSentence =
    input.yearsInBusiness >= 1
      ? city
        ? `We have been serving ${city} for ${Math.round(input.yearsInBusiness)} years.`
        : `We have been in business for ${Math.round(input.yearsInBusiness)} years.`
      : "";

  const diffSentences = input.differentiators
    .slice(0, MAX_DIFFERENTIATORS)
    .map((id) => GBP_DIFFERENTIATORS.find((d) => d.id === id)?.sentence)
    .filter((s): s is string => Boolean(s));

  const closing =
    input.tone === "warm"
      ? "Call us or book online and we will take it from there."
      : input.tone === "professional"
        ? "Contact us to schedule an appointment."
        : "Call or book online.";

  // opening + services + closing always survive. The optional sentences are
  // dropped last-first, so the years line (listed last) is the first to go.
  const assemble = (keptOptional: string[]): string =>
    [opening, serviceSentence, ...keptOptional, closing].filter(Boolean).join(" ");

  let kept = [...diffSentences, yearsSentence].filter(Boolean);
  let text = assemble(kept);
  let trimmedAny = false;
  while (text.length > GBP_DESCRIPTION_LIMIT && kept.length > 0) {
    kept = kept.slice(0, -1);
    trimmedAny = true;
    text = assemble(kept);
  }

  // Still too long with only the required sentences: the service list is the
  // one required part that can shrink without breaking a sentence.
  let shrinkingServices = [...services];
  while (text.length > GBP_DESCRIPTION_LIMIT && shrinkingServices.length > 1) {
    shrinkingServices = shrinkingServices.slice(0, -1);
    trimmedAny = true;
    const shorterServiceSentence = `We handle ${joinList(shrinkingServices)}.`;
    text = [opening, shorterServiceSentence, closing].join(" ");
  }

  // Last resort: a business name and type long enough to blow the budget on
  // their own. Cut on a word boundary rather than emitting an over-limit string.
  if (text.length > GBP_DESCRIPTION_LIMIT) {
    text = text.slice(0, GBP_DESCRIPTION_LIMIT).replace(/\s+\S*$/, "");
    trimmedAny = true;
  }

  return {
    text,
    length: text.length,
    remaining: GBP_DESCRIPTION_LIMIT - text.length,
    trimmed: trimmedAny,
  };
}

export function GoogleBusinessProfileDescriptionGenerator(): ReactElement {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("plumbing company");
  const [city, setCity] = useState("");
  const [serviceText, setServiceText] = useState("drain cleaning, water heater repair, leak detection");
  const [yearsInBusiness, setYearsInBusiness] = useState(10);
  const [differentiators, setDifferentiators] = useState<string[]>(["licensed", "same-day"]);
  const [tone, setTone] = useState<GbpTone>("warm");
  const [copied, setCopied] = useState(false);

  const services = useMemo(
    () => serviceText.split(",").map((s) => s.trim()).filter(Boolean),
    [serviceText],
  );

  const result = useMemo(
    () => composeGbpDescription({ businessName, businessType, city, services, yearsInBusiness, differentiators, tone }),
    [businessName, businessType, city, services, yearsInBusiness, differentiators, tone],
  );

  function toggleDiff(id: string): void {
    setDifferentiators((prev) => {
      if (prev.includes(id)) return prev.filter((d) => d !== id);
      if (prev.length >= MAX_DIFFERENTIATORS) return prev;
      return [...prev, id];
    });
  }

  async function handleCopy(): Promise<void> {
    const ok = await copyToClipboard(result.text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const overBudget = result.remaining < 0;

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        <Field label="Business name" value={businessName} onChange={setBusinessName} placeholder="Northside Plumbing" />
        <Field label="Business type" hint="How you would describe yourself in three words." value={businessType} onChange={setBusinessType} placeholder="plumbing company" />
        <Field label="City or area served" value={city} onChange={setCity} placeholder="Portland" />
      </div>

      <label style={{ display: "block", marginTop: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Services</span>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          Comma-separated, most important first. Up to {MAX_SERVICES} are used ({services.length} entered).
        </div>
        <input
          type="text"
          value={serviceText}
          onChange={(e) => setServiceText(e.target.value)}
          placeholder="drain cleaning, water heater repair, leak detection"
          aria-label="Services"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      </label>

      <label style={{ display: "block", marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Years in business</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: GREEN }}>{yearsInBusiness === 0 ? "not mentioned" : `${yearsInBusiness} years`}</span>
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>Set it to zero to leave the sentence out.</div>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={yearsInBusiness}
          onChange={(e) => setYearsInBusiness(Number(e.target.value))}
          style={{ width: "100%", accentColor: GREEN }}
          aria-label="Years in business"
        />
      </label>

      <fieldset style={{ border: "none", padding: 0, margin: "22px 0 0" }}>
        <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>What sets you apart</legend>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          Pick up to {MAX_DIFFERENTIATORS}. Only choose what is actually true: Google suspends profiles over claims a
          reviewer can disprove.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {GBP_DIFFERENTIATORS.map((d) => {
            const active = differentiators.includes(d.id);
            const full = !active && differentiators.length >= MAX_DIFFERENTIATORS;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleDiff(d.id)}
                aria-pressed={active}
                disabled={full}
                style={{
                  border: active ? `1.5px solid ${GREEN}` : `1.5px solid ${INK10}`,
                  background: active ? GREEN : "rgba(255,255,255,0.6)",
                  color: active ? "#F6F2EA" : INK,
                  opacity: full ? 0.45 : 1,
                  borderRadius: 999,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: full ? "not-allowed" : "pointer",
                }}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div style={{ marginTop: 22 }}>
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>Tone</legend>
          <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>Changes the opening and closing sentence.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GBP_TONES.map((t) => {
              const active = t.id === tone;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
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
                  {t.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${INK10}`, paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)" }}>
            Your description
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: overBudget ? AMBER : GREEN }}>
            {result.length} / {GBP_DESCRIPTION_LIMIT} characters
          </div>
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
          {result.text}
        </pre>
        {result.trimmed && (
          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: AMBER, fontWeight: 600, lineHeight: 1.55 }}>
            The description ran past 750 characters, so the lowest-priority sentences were dropped to fit. Shorten your
            service list if you want a differentiator back.
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{ background: INK, color: "#F6F2EA", border: "none", padding: "11px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            {copied ? "Copied ✓" : "Copy description"}
          </button>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.55)", lineHeight: 1.55 }}>
          Paste it into Google Business Profile under Edit profile, then Business description. Google does not use this
          field for ranking, but a human reading your profile does, and so does an AI assistant summarising you.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
        <a href="/tools/ai-website-generator" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
          Turn that same profile into a real website
        </a>
      </div>
    </div>
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
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}): ReactElement {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{label}</span>
      {hint && <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 8px", lineHeight: 1.45 }}>{hint}</div>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 14.5, fontFamily: "inherit", boxSizing: "border-box", marginTop: hint ? 0 : 8 }}
      />
    </label>
  );
}
