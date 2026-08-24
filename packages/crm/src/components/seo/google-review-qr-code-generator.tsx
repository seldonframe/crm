"use client";

// 2026-08-24 — The Google review QR code generator: the interactive island of
// /tools/google-review-qr-code-generator.
//
// Sibling of google-review-link-generator.tsx, NOT a duplicate of it. That tool
// answers "what's my review link" and shows a QR preview from a third-party
// image service. This one answers "give me print-ready QR artwork": the code is
// encoded in the browser with the `qrcode` package already in this app's
// dependencies (no third-party image call, so the artwork works offline and the
// Place ID never leaves the page), sized to a real physical width at 300 DPI,
// and downloadable as PNG or vector SVG.
//
// The Place ID parsing is deliberately copy-pasted from the sibling rather than
// extracted (CLAUDE.md: Wrong Abstraction — copy twice before extracting; this
// is copy #2, and the two tools may diverge on what input they accept).

import { useEffect, useMemo, useState, type ReactElement } from "react";
import QRCode from "qrcode";
import { copyToClipboard } from "@/components/seo/result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";
const RED = "#C0392B";

/** Print resolution every commercial printer asks for. */
export const PRINT_DPI = 300;

export interface PrintSize {
  id: string;
  label: string;
  /** Finished artwork width in inches. */
  inches: number;
  /** Where this size actually gets used. */
  useCase: string;
}

export const PRINT_SIZES: readonly PrintSize[] = [
  { id: "table-tent", label: "Table tent", inches: 2, useCase: "A folded card on a table or a reception desk, scanned from about a foot away." },
  { id: "counter-card", label: "Counter card", inches: 3, useCase: "A standing card at the register or checkout, scanned from arm's length." },
  { id: "poster", label: "Poster / A-frame", inches: 4, useCase: "A wall poster or waiting-room sign, scanned from a few feet away." },
  { id: "window-decal", label: "Window decal", inches: 6, useCase: "A door or window sticker, scanned from the sidewalk." },
] as const;

export type ErrorCorrection = "M" | "Q" | "H";

export const ERROR_CORRECTION_LEVELS: readonly { id: ErrorCorrection; label: string; hint: string }[] = [
  { id: "M", label: "Medium", hint: "Smallest, densest code. Fine for clean digital use." },
  { id: "Q", label: "Quartile", hint: "Recommended for print. Survives scuffs and ink bleed." },
  { id: "H", label: "High", hint: "Most robust. Use if you're placing a logo over the centre." },
] as const;

/** Pixel width for a given physical width at print resolution. */
export function printPixels(inches: number, dpi: number = PRINT_DPI): number {
  return Math.round(inches * dpi);
}

/** The direct "write a review" URL Google exposes for a Place ID. */
export function buildReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

/** Best-effort extraction of a `place_id` query param from a pasted Google
 *  Maps URL. Returns null if the input isn't a URL or has no place_id. */
function extractPlaceIdFromUrl(input: string): string | null {
  try {
    const url = new URL(input);
    return url.searchParams.get("place_id") || url.searchParams.get("placeid");
  } catch {
    return null;
  }
}

function looksLikeUrl(input: string): boolean {
  return /^https?:\/\//i.test(input.trim());
}

/** Trigger a browser download for an already-built object/data URL. */
function downloadUrl(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function GoogleReviewQrCodeGenerator(): ReactElement {
  const [input, setInput] = useState("");
  const [sizeId, setSizeId] = useState<string>("counter-card");
  const [ecLevel, setEcLevel] = useState<ErrorCorrection>("Q");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [encodeError, setEncodeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const size = PRINT_SIZES.find((s) => s.id === sizeId) ?? PRINT_SIZES[1];
  const pixels = printPixels(size.inches);

  const { placeId, error } = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { placeId: null as string | null, error: null as string | null };

    if (looksLikeUrl(trimmed)) {
      const extracted = extractPlaceIdFromUrl(trimmed);
      if (extracted) return { placeId: extracted, error: null };
      return {
        placeId: null,
        error: "That URL doesn't include a place_id query param. Paste your Place ID directly instead.",
      };
    }

    if (/\s/.test(trimmed)) {
      return { placeId: null, error: "A Place ID shouldn't contain spaces. Double-check what you pasted." };
    }

    return { placeId: trimmed, error: null };
  }, [input]);

  const reviewUrl = placeId ? buildReviewUrl(placeId) : null;

  // Encode the preview in the browser. Screen preview is a fixed 480px render
  // of the same data the print file uses — the print file is re-encoded at
  // download time so a big decal doesn't sit in memory while you're browsing.
  useEffect(() => {
    let cancelled = false;
    if (!reviewUrl) {
      setPreviewSrc(null);
      setEncodeError(null);
      return;
    }
    QRCode.toDataURL(reviewUrl, { width: 480, margin: 2, errorCorrectionLevel: ecLevel })
      .then((url) => {
        if (!cancelled) {
          setPreviewSrc(url);
          setEncodeError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewSrc(null);
          setEncodeError("Couldn't encode that Place ID as a QR code. Check the value and try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [reviewUrl, ecLevel]);

  async function handleCopy(): Promise<void> {
    if (!reviewUrl) return;
    const ok = await copyToClipboard(reviewUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleDownloadPng(): Promise<void> {
    if (!reviewUrl) return;
    try {
      const dataUrl = await QRCode.toDataURL(reviewUrl, { width: pixels, margin: 2, errorCorrectionLevel: ecLevel });
      downloadUrl(dataUrl, `google-review-qr-${size.id}-${size.inches}in-300dpi.png`);
    } catch {
      setEncodeError("Couldn't build the PNG. Try a different error-correction level.");
    }
  }

  async function handleDownloadSvg(): Promise<void> {
    if (!reviewUrl) return;
    try {
      const svg = await QRCode.toString(reviewUrl, { margin: 2, errorCorrectionLevel: ecLevel });
      const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      downloadUrl(blobUrl, "google-review-qr.svg");
      URL.revokeObjectURL(blobUrl);
    } catch {
      setEncodeError("Couldn't build the SVG. Try a different error-correction level.");
    }
  }

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <label style={{ display: "block" }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Google Place ID or Maps URL</span>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          Paste your business&apos;s Place ID, or a Google Maps URL that contains a <code>place_id</code> parameter.
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
          aria-label="Google Place ID or Maps URL"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      </label>

      <fieldset style={{ border: "none", padding: 0, margin: "22px 0 0" }}>
        <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>Print size</legend>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          The finished width of the printed code. The PNG is exported at {PRINT_DPI} DPI so it stays sharp on paper.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRINT_SIZES.map((s) => {
            const active = s.id === sizeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSizeId(s.id)}
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
                {s.label} · {s.inches}″
              </button>
            );
          })}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.6)", lineHeight: 1.55 }}>
          {size.useCase} Exports at {pixels} × {pixels} px.
        </p>
      </fieldset>

      <fieldset style={{ border: "none", padding: 0, margin: "22px 0 0" }}>
        <legend style={{ fontWeight: 700, fontSize: 15, padding: 0 }}>Error correction</legend>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 10px" }}>
          How much of the code can be damaged and still scan.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ERROR_CORRECTION_LEVELS.map((lvl) => {
            const active = lvl.id === ecLevel;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setEcLevel(lvl.id)}
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
                {lvl.label}
              </button>
            );
          })}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.6)", lineHeight: 1.55 }}>
          {ERROR_CORRECTION_LEVELS.find((l) => l.id === ecLevel)?.hint}
        </p>
      </fieldset>

      {(error || encodeError) && (
        <p role="alert" style={{ marginTop: 18, color: RED, fontWeight: 600, fontSize: 14 }}>
          {error ?? encodeError}
        </p>
      )}

      {reviewUrl && previewSrc && (
        <div style={{ marginTop: 26, borderTop: `1px solid ${INK10}`, paddingTop: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)", marginBottom: 10 }}>
            Your print-ready code
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="QR code that opens the Google review box for your business"
              width={200}
              height={200}
              style={{ borderRadius: 12, border: `1px solid ${INK10}`, background: "#fff", padding: 8 }}
            />
            <div style={{ flex: "1 1 280px", minWidth: 260 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(34,29,23,0.55)", marginBottom: 6 }}>Encodes this URL</div>
              <code style={{ display: "block", fontSize: 13, wordBreak: "break-all", color: INK, border: `1px solid ${INK10}`, borderRadius: 10, padding: "10px 12px", background: "#fff" }}>
                {reviewUrl}
              </code>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  style={{ background: INK, color: "#F6F2EA", border: "none", padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  ⬇ PNG · {size.inches}″ at {PRINT_DPI} DPI
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 19px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
                >
                  ⬇ SVG (vector)
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{ border: `1.5px solid ${INK10}`, color: INK, padding: "10px 19px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.6)", cursor: "pointer" }}
                >
                  {copied ? "Copied ✓" : "Copy URL"}
                </button>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.55)", lineHeight: 1.55 }}>
                Encoded in your browser. Nothing you type is sent to SeldonFrame, and no third-party image service is
                involved. Send the SVG to a printer if you want it larger than a decal.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
        <a href="/signup" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
          Ask for the review automatically. Start free.
        </a>
      </div>
    </div>
  );
}
