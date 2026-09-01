"use client";
/* eslint-disable react-hooks/set-state-in-effect */

// 2026-08-24 — The customer lifetime value calculator: the interactive island
// of /tools/customer-lifetime-value-calculator.
//
// Built for LOCAL SERVICE businesses, not SaaS. Every LTV calculator on the
// first page of Google assumes a flat monthly subscription and a churn rate,
// which badly understates a salon whose client comes in eight times a year for
// a decade and brings her sister. So the inputs here are the ones a service
// owner actually knows: average ticket, visits a year, years retained, and
// referrals.
//
// This is also the internal-linking hub for the other money calculators: the
// missed-call, no-show and speed-to-lead pages all quantify losing ONE ticket,
// and this page is what converts that into what the lost CUSTOMER was worth.
//
// Same house idiom as no-show-cost-calculator.tsx: sliders, URL permalink state,
// shared result card. Pure client math, no network calls.

import { useState, useEffect, useRef, type ReactElement, type CSSProperties } from "react";

import { renderResultCard, buildShareUrl, copyToClipboard, downloadCanvasAsImage, shareResultCard } from "./result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";
const AMBER = "#B8860B";

// ─── URL state ────────────────────────────────────────────────────────────
//
// Short, stable query keys so shared links stay compact:
//   lt = avg ticket, lv = visits/yr, ly = years retained, lr = referrals,
//   lm = gross margin %

export interface ClvState {
  avgTicket: number;
  visitsPerYear: number;
  yearsRetained: number;
  referrals: number;
  marginPct: number;
}

export const CLV_BOUNDS = {
  avgTicket: { min: 25, max: 5000 },
  visitsPerYear: { min: 0.5, max: 24 },
  yearsRetained: { min: 1, max: 20 },
  referrals: { min: 0, max: 5 },
  marginPct: { min: 10, max: 90 },
} as const;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function parseNum(params: URLSearchParams, key: string): number | undefined {
  const raw = params.get(key);
  if (raw === null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function encodeClvState(state: ClvState): string {
  const params = new URLSearchParams();
  params.set("lt", String(Math.round(state.avgTicket)));
  params.set("lv", String(state.visitsPerYear));
  params.set("ly", String(Math.round(state.yearsRetained)));
  params.set("lr", String(state.referrals));
  params.set("lm", String(Math.round(state.marginPct)));
  return params.toString();
}

/** Decode + clamp a query string. Out-of-range input is clamped to the slider
 *  bounds rather than rejected, so a hand-edited URL never crashes the page. */
export function decodeClvState(search: string): Partial<ClvState> {
  const params = new URLSearchParams(search);
  const out: Partial<ClvState> = {};

  const lt = parseNum(params, "lt");
  if (lt !== undefined) out.avgTicket = clamp(lt, CLV_BOUNDS.avgTicket.min, CLV_BOUNDS.avgTicket.max);

  const lv = parseNum(params, "lv");
  if (lv !== undefined) out.visitsPerYear = clamp(lv, CLV_BOUNDS.visitsPerYear.min, CLV_BOUNDS.visitsPerYear.max);

  const ly = parseNum(params, "ly");
  if (ly !== undefined) out.yearsRetained = clamp(ly, CLV_BOUNDS.yearsRetained.min, CLV_BOUNDS.yearsRetained.max);

  const lr = parseNum(params, "lr");
  if (lr !== undefined) out.referrals = clamp(lr, CLV_BOUNDS.referrals.min, CLV_BOUNDS.referrals.max);

  const lm = parseNum(params, "lm");
  if (lm !== undefined) out.marginPct = clamp(lm, CLV_BOUNDS.marginPct.min, CLV_BOUNDS.marginPct.max);

  return out;
}

export interface ClvResult {
  /** What the customer spends with you directly, over their whole lifetime. */
  directRevenue: number;
  /** What the customers they refer spend, at the same lifetime value. */
  referralRevenue: number;
  /** directRevenue + referralRevenue. Exact, by construction. */
  totalRevenue: number;
  /** 1 + referrals: how many customer-lifetimes one new customer is worth. */
  referralMultiplier: number;
  /** Total lifetime revenue at your gross margin. */
  grossProfitLtv: number;
  /** Visits the direct customer makes over their lifetime. */
  visitsOverLifetime: number;
  /** How many average tickets one lifetime is worth. */
  ticketMultiple: number;
}

/**
 * Lifetime value for a repeat-visit local service business.
 *
 * Referrals are counted at ONE generation only: a referred customer is worth
 * one more direct lifetime, and we do not compound their referrals on top.
 * Compounding would produce a much bigger and much less defensible number, and
 * the page says so out loud.
 *
 * Inputs are clamped to the slider bounds before any arithmetic, so a
 * hand-edited permalink can't produce a fantasy number.
 */
export function computeCustomerLtv(input: ClvState): ClvResult {
  const ticket = clamp(input.avgTicket, CLV_BOUNDS.avgTicket.min, CLV_BOUNDS.avgTicket.max);
  const visits = clamp(input.visitsPerYear, CLV_BOUNDS.visitsPerYear.min, CLV_BOUNDS.visitsPerYear.max);
  const years = clamp(input.yearsRetained, CLV_BOUNDS.yearsRetained.min, CLV_BOUNDS.yearsRetained.max);
  const referrals = clamp(input.referrals, CLV_BOUNDS.referrals.min, CLV_BOUNDS.referrals.max);
  const margin = clamp(input.marginPct, CLV_BOUNDS.marginPct.min, CLV_BOUNDS.marginPct.max);

  const rawDirect = ticket * visits * years;
  const directRevenue = Math.round(rawDirect);
  const referralRevenue = Math.round(rawDirect * referrals);
  // Sum the rounded parts so the three numbers on screen always reconcile.
  const totalRevenue = directRevenue + referralRevenue;

  return {
    directRevenue,
    referralRevenue,
    totalRevenue,
    referralMultiplier: 1 + referrals,
    grossProfitLtv: Math.round(totalRevenue * (margin / 100)),
    visitsOverLifetime: Math.round(visits * years * 10) / 10,
    ticketMultiple: Math.round((totalRevenue / ticket) * 10) / 10,
  };
}

function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function CustomerLifetimeValueCalculator(): ReactElement {
  const [avgTicket, setAvgTicket] = useState(150);
  const [visitsPerYear, setVisitsPerYear] = useState(4);
  const [yearsRetained, setYearsRetained] = useState(5);
  const [referrals, setReferrals] = useState(1);
  const [marginPct, setMarginPct] = useState(55);
  const replaceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from the URL on mount only — never during SSR (no `window`).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const decoded = decodeClvState(window.location.search);
    if (decoded.avgTicket !== undefined) setAvgTicket(decoded.avgTicket);
    if (decoded.visitsPerYear !== undefined) setVisitsPerYear(decoded.visitsPerYear);
    if (decoded.yearsRetained !== undefined) setYearsRetained(decoded.yearsRetained);
    if (decoded.referrals !== undefined) setReferrals(decoded.referrals);
    if (decoded.marginPct !== undefined) setMarginPct(decoded.marginPct);
  }, []);

  // Keep the address bar in sync (throttled) so the URL is always a shareable
  // permalink of whatever's on screen.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (replaceTimer.current) clearTimeout(replaceTimer.current);
    replaceTimer.current = setTimeout(() => {
      const qs = encodeClvState({ avgTicket, visitsPerYear, yearsRetained, referrals, marginPct });
      window.history.replaceState(null, "", `${window.location.pathname}?${qs}`);
    }, 150);
    return () => {
      if (replaceTimer.current) clearTimeout(replaceTimer.current);
    };
  }, [avgTicket, visitsPerYear, yearsRetained, referrals, marginPct]);

  const result = computeCustomerLtv({ avgTicket, visitsPerYear, yearsRetained, referrals, marginPct });

  // ─── Shareable result card ───
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const renderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canShare = typeof window !== "undefined" && typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (renderTimer.current) clearTimeout(renderTimer.current);
    renderTimer.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      renderResultCard(canvas, {
        headline: "One customer is worth",
        bigNumber: money(result.totalRevenue),
        subline: `${money(avgTicket)} × ${visitsPerYear} visits/yr × ${yearsRetained} yrs, plus ${referrals} referral${referrals === 1 ? "" : "s"}`,
        footer: "built free at seldonframe.com/tools",
      });
    }, 150);
    return () => {
      if (renderTimer.current) clearTimeout(renderTimer.current);
    };
  }, [result.totalRevenue, avgTicket, visitsPerYear, yearsRetained, referrals]);

  const handleCopyLink = async () => {
    const url = buildShareUrl(window.location.search);
    const ok = await copyToClipboard(url);
    setCopyFeedback(ok ? "Copied ✓" : "Copy failed");
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleDownload = () => {
    if (canvasRef.current) downloadCanvasAsImage(canvasRef.current, "customer-lifetime-value.png");
  };

  const handleNativeShare = async () => {
    const url = buildShareUrl(window.location.search);
    await shareResultCard(canvasRef.current, {
      title: "One customer is worth this much",
      text: `One of our customers is worth about ${money(result.totalRevenue)} over their lifetime.`,
      url,
      filename: "customer-lifetime-value.png",
    });
  };

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <div style={{ display: "grid", gap: 22 }}>
        <Slider
          label="Average ticket"
          hint="What one visit or job is worth, before you take costs off it"
          value={avgTicket}
          min={CLV_BOUNDS.avgTicket.min}
          max={CLV_BOUNDS.avgTicket.max}
          step={25}
          format={(v) => money(v)}
          onChange={setAvgTicket}
        />
        <Slider
          label="Visits per year"
          hint="A salon client might be 8, an HVAC customer 2, a roofer closer to 0.5"
          value={visitsPerYear}
          min={CLV_BOUNDS.visitsPerYear.min}
          max={CLV_BOUNDS.visitsPerYear.max}
          step={0.5}
          format={(v) => `${v} / yr`}
          onChange={setVisitsPerYear}
        />
        <Slider
          label="Years they stay with you"
          hint="How long an average customer keeps coming back before they move, switch, or stop needing you"
          value={yearsRetained}
          min={CLV_BOUNDS.yearsRetained.min}
          max={CLV_BOUNDS.yearsRetained.max}
          step={1}
          format={(v) => `${v} yr${v === 1 ? "" : "s"}`}
          onChange={setYearsRetained}
        />
        <Slider
          label="Referrals per customer"
          hint="New customers this one sends you over their whole lifetime. Counted once, never compounded."
          value={referrals}
          min={CLV_BOUNDS.referrals.min}
          max={CLV_BOUNDS.referrals.max}
          step={0.5}
          format={(v) => `${v} referral${v === 1 ? "" : "s"}`}
          onChange={setReferrals}
        />
        <Slider
          label="Gross margin"
          hint="What you keep after labor and materials. Turns lifetime revenue into lifetime profit."
          value={marginPct}
          min={CLV_BOUNDS.marginPct.min}
          max={CLV_BOUNDS.marginPct.max}
          step={5}
          format={(v) => `${v}%`}
          onChange={setMarginPct}
        />
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${INK10}`, paddingTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <Stat label="Direct lifetime revenue" value={money(result.directRevenue)} tone="green" />
        <Stat label="Plus referrals" value={money(result.referralRevenue)} tone="green" />
        <Stat label="Total lifetime value" value={money(result.totalRevenue)} tone="hero" />
        <Stat label={`Lifetime profit at ${marginPct}%`} value={money(result.grossProfitLtv)} tone="green" />
      </div>

      <p style={{ margin: "18px 0 0", fontSize: 15, lineHeight: 1.6, color: INK }}>
        One customer is worth <strong>{result.ticketMultiple} average tickets</strong>, across{" "}
        <strong>{result.visitsOverLifetime} visits</strong> and a{" "}
        <strong>{result.referralMultiplier}x</strong> referral multiplier. Which means the real cost of losing one is{" "}
        <strong style={{ color: AMBER }}>{money(result.totalRevenue)}</strong>, not {money(avgTicket)}.
      </p>

      <p style={{ margin: "14px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.55)", lineHeight: 1.55 }}>
        Referrals are counted at one generation only. A referred customer is worth one more lifetime, and we do not
        compound the referrals they bring on top of that. Compounding produces a far bigger number and a far weaker
        argument, so this stays deliberately conservative.
      </p>

      <div style={{ marginTop: 24, borderTop: `1px solid ${INK10}`, paddingTop: 22 }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: INK }}>Now price the leaks</div>
        <p style={{ margin: "8px 0 14px", fontSize: 14.5, lineHeight: 1.6, color: "rgba(34,29,23,0.72)" }}>
          Every missed call, no-show and slow reply is a shot at a customer worth {money(result.totalRevenue)}, not at a{" "}
          {money(avgTicket)} ticket. Run the same numbers through the other three calculators:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { href: "/tools/missed-call-calculator", label: "Missed-call cost" },
            { href: "/tools/no-show-cost-calculator", label: "No-show cost" },
            { href: "/tools/speed-to-lead-calculator", label: "Speed-to-lead cost" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
        <a href="/signup" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
          Stop losing customers worth {money(result.totalRevenue)}. Start free.
        </a>
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${INK10}`, paddingTop: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)", marginBottom: 12 }}>
          Share your result
        </div>
        <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${INK10}`, background: "#1F2B24", maxWidth: 640 }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "auto" }} aria-label="Downloadable result card showing the lifetime value of one customer" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, alignItems: "center" }}>
          <button
            type="button"
            onClick={handleDownload}
            style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
          >
            ⬇ Download image
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
          >
            🔗 {copyFeedback ?? "Copy link"}
          </button>
          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
            >
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}): ReactElement {
  return (
    <label style={{ display: "block" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{label}</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: GREEN, whiteSpace: "nowrap" }}>{format(value)}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>{hint}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: GREEN }}
        aria-label={label}
      />
    </label>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "green" | "hero" }): ReactElement {
  const hero = tone === "hero";
  const box: CSSProperties = {
    border: hero ? `1.5px solid ${GREEN}` : `1px solid ${INK10}`,
    borderRadius: 14,
    padding: "16px 18px",
    background: hero ? "rgba(31, 43, 36,0.06)" : "rgba(255,255,255,0.6)",
  };
  return (
    <div style={box}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)" }}>{label}</div>
      <div style={{ fontSize: hero ? 28 : 24, fontWeight: 800, marginTop: 6, color: GREEN }}>{value}</div>
    </div>
  );
}
