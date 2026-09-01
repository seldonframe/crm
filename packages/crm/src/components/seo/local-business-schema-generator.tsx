"use client";

// 2026-08-24 — The LocalBusiness schema generator: the interactive island of
// /tools/local-business-schema-generator.
//
// Builds a schema.org LocalBusiness JSON-LD block from a plain form. The whole
// point is that the output is VALID: an empty field is omitted from the object
// entirely rather than emitted as `""`, so what you copy never contains a hole
// for a crawler to trip on. Pure client-side, no network calls.
//
// Structured data is also the machine-readable version of the answers an AI
// assistant needs to recommend a business, which is why this sits next to
// /tools/ai-visibility-checker.

import { useMemo, useState, type ReactElement } from "react";
import { copyToClipboard } from "@/components/seo/result-card";

const INK = "#221D17";
const GREEN = "#1F2B24";
const INK10 = "rgba(34,29,23,0.10)";

/** The schema.org LocalBusiness subtypes worth offering. Anything not listed
 *  here can still use the plain "LocalBusiness" type without penalty. */
export const SCHEMA_TYPES: readonly { id: string; label: string }[] = [
  { id: "LocalBusiness", label: "Local business (generic)" },
  { id: "Plumber", label: "Plumber" },
  { id: "HVACBusiness", label: "HVAC" },
  { id: "Electrician", label: "Electrician" },
  { id: "RoofingContractor", label: "Roofing" },
  { id: "HairSalon", label: "Hair salon" },
  { id: "BeautySalon", label: "Beauty salon / med spa" },
  { id: "Dentist", label: "Dentist" },
  { id: "HousePainter", label: "Painter" },
  { id: "MovingCompany", label: "Movers" },
  { id: "AutoRepair", label: "Auto repair" },
  { id: "Attorney", label: "Attorney" },
  { id: "AccountingService", label: "Accounting" },
  { id: "ProfessionalService", label: "Professional service" },
] as const;

/** schema.org day names, in the order the form shows them. */
export const SCHEMA_DAYS: readonly { id: string; label: string }[] = [
  { id: "Monday", label: "Mon" },
  { id: "Tuesday", label: "Tue" },
  { id: "Wednesday", label: "Wed" },
  { id: "Thursday", label: "Thu" },
  { id: "Friday", label: "Fri" },
  { id: "Saturday", label: "Sat" },
  { id: "Sunday", label: "Sun" },
] as const;

export interface DayHours {
  day: string;
  closed: boolean;
  opens: string;
  closes: string;
}

export interface SchemaInput {
  name: string;
  type: string;
  url: string;
  telephone: string;
  priceRange: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude: string;
  longitude: string;
  /** Comma-separated cities or areas served. */
  areaServed: string;
  hours: DayHours[];
}

/** A JSON-LD value can be a string, a number, a nested object or a list. */
type JsonLdValue = string | number | JsonLdValue[] | { [key: string]: JsonLdValue };

function trimmed(v: string): string {
  return v.trim();
}

/**
 * Build the JSON-LD object. Omits every empty field, every closed day, and
 * every sub-object that ended up with nothing in it, so the result is always
 * valid structured data rather than a template with blanks.
 */
export function buildLocalBusinessJsonLd(input: SchemaInput): Record<string, JsonLdValue> {
  const ld: Record<string, JsonLdValue> = {
    "@context": "https://schema.org",
    "@type": trimmed(input.type) || "LocalBusiness",
  };

  if (trimmed(input.name)) ld.name = trimmed(input.name);
  if (trimmed(input.url)) ld.url = trimmed(input.url);
  if (trimmed(input.telephone)) ld.telephone = trimmed(input.telephone);
  if (trimmed(input.priceRange)) ld.priceRange = trimmed(input.priceRange);

  const address: Record<string, JsonLdValue> = { "@type": "PostalAddress" };
  if (trimmed(input.streetAddress)) address.streetAddress = trimmed(input.streetAddress);
  if (trimmed(input.addressLocality)) address.addressLocality = trimmed(input.addressLocality);
  if (trimmed(input.addressRegion)) address.addressRegion = trimmed(input.addressRegion);
  if (trimmed(input.postalCode)) address.postalCode = trimmed(input.postalCode);
  if (trimmed(input.addressCountry)) address.addressCountry = trimmed(input.addressCountry);
  // "@type" alone means nothing was filled in: drop the whole address.
  if (Object.keys(address).length > 1) ld.address = address;

  const lat = Number(trimmed(input.latitude));
  const lon = Number(trimmed(input.longitude));
  if (trimmed(input.latitude) && trimmed(input.longitude) && Number.isFinite(lat) && Number.isFinite(lon)) {
    ld.geo = { "@type": "GeoCoordinates", latitude: lat, longitude: lon };
  }

  const areas = input.areaServed
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  if (areas.length === 1) ld.areaServed = areas[0];
  else if (areas.length > 1) ld.areaServed = areas;

  const openingHours = input.hours
    .filter((h) => !h.closed && trimmed(h.opens) && trimmed(h.closes))
    .map((h) => ({
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: trimmed(h.opens),
      closes: trimmed(h.closes),
    }));
  if (openingHours.length > 0) ld.openingHoursSpecification = openingHours;

  return ld;
}

/** The full <script> block, ready to paste into the page head. */
export function renderSchemaScript(ld: Record<string, JsonLdValue>): string {
  return `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`;
}

function defaultHours(): DayHours[] {
  return SCHEMA_DAYS.map((d) => ({
    day: d.id,
    closed: d.id === "Sunday",
    opens: d.id === "Saturday" ? "09:00" : "08:00",
    closes: d.id === "Saturday" ? "13:00" : "17:00",
  }));
}

export function LocalBusinessSchemaGenerator(): ReactElement {
  const [name, setName] = useState("");
  const [type, setType] = useState("LocalBusiness");
  const [url, setUrl] = useState("");
  const [telephone, setTelephone] = useState("");
  const [priceRange, setPriceRange] = useState("$$");
  const [streetAddress, setStreetAddress] = useState("");
  const [addressLocality, setAddressLocality] = useState("");
  const [addressRegion, setAddressRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressCountry, setAddressCountry] = useState("US");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areaServed, setAreaServed] = useState("");
  const [hours, setHours] = useState<DayHours[]>(defaultHours);
  const [copied, setCopied] = useState(false);

  const ld = useMemo(
    () =>
      buildLocalBusinessJsonLd({
        name,
        type,
        url,
        telephone,
        priceRange,
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry,
        latitude,
        longitude,
        areaServed,
        hours,
      }),
    [name, type, url, telephone, priceRange, streetAddress, addressLocality, addressRegion, postalCode, addressCountry, latitude, longitude, areaServed, hours],
  );
  const script = renderSchemaScript(ld);

  function setDay(day: string, patch: Partial<DayHours>): void {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)));
  }

  async function handleCopy(): Promise<void> {
    const ok = await copyToClipboard(script);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ border: `1px solid ${INK10}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: "28px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        <Field label="Business name" value={name} onChange={setName} placeholder="Northside Plumbing" />
        <label style={{ display: "block" }}>
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>Business type</span>
          <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 8px", lineHeight: 1.45 }}>
            The schema.org subtype. Generic is always safe.
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Business type"
            style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 14.5, fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
          >
            {SCHEMA_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Website URL" value={url} onChange={setUrl} placeholder="https://northsideplumbing.com" />
        <Field label="Phone" value={telephone} onChange={setTelephone} placeholder="+1-555-0142" />
        <Field label="Price range" hint="Google shows this as $ to $$$$." value={priceRange} onChange={setPriceRange} placeholder="$$" />
        <Field label="Street address" value={streetAddress} onChange={setStreetAddress} placeholder="120 Mill Street" />
        <Field label="City" value={addressLocality} onChange={setAddressLocality} placeholder="Portland" />
        <Field label="State / region" value={addressRegion} onChange={setAddressRegion} placeholder="OR" />
        <Field label="Postal code" value={postalCode} onChange={setPostalCode} placeholder="97205" />
        <Field label="Country code" value={addressCountry} onChange={setAddressCountry} placeholder="US" />
        <Field label="Latitude (optional)" value={latitude} onChange={setLatitude} placeholder="45.5231" />
        <Field label="Longitude (optional)" value={longitude} onChange={setLongitude} placeholder="-122.6765" />
      </div>

      <label style={{ display: "block", marginTop: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 14.5 }}>Service area (optional)</span>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 8px", lineHeight: 1.45 }}>
          Comma-separated cities or areas. Matters most for businesses that travel to the customer.
        </div>
        <input
          type="text"
          value={areaServed}
          onChange={(e) => setAreaServed(e.target.value)}
          placeholder="Portland, Beaverton, Lake Oswego"
          aria-label="Service area"
          style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${INK10}`, fontSize: 14.5, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      </label>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Opening hours</div>
        <div style={{ fontSize: 12.5, color: "rgba(34,29,23,0.55)", margin: "2px 0 12px" }}>
          24-hour times. Closed days are left out of the schema entirely.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {hours.map((h) => {
            const label = SCHEMA_DAYS.find((d) => d.id === h.day)?.label ?? h.day;
            return (
              <div key={h.day} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ width: 46, fontWeight: 700, fontSize: 14 }}>{label}</span>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => setDay(h.day, { closed: e.target.checked })}
                    style={{ accentColor: GREEN, width: 15, height: 15 }}
                  />
                  Closed
                </label>
                {!h.closed && (
                  <>
                    <input
                      type="time"
                      value={h.opens}
                      onChange={(e) => setDay(h.day, { opens: e.target.value })}
                      aria-label={`${label} opening time`}
                      style={{ padding: "7px 10px", borderRadius: 9, border: `1.5px solid ${INK10}`, fontSize: 14, fontFamily: "inherit" }}
                    />
                    <span style={{ fontSize: 13, color: "rgba(34,29,23,0.5)" }}>to</span>
                    <input
                      type="time"
                      value={h.closes}
                      onChange={(e) => setDay(h.day, { closes: e.target.value })}
                      aria-label={`${label} closing time`}
                      style={{ padding: "7px 10px", borderRadius: 9, border: `1.5px solid ${INK10}`, fontSize: 14, fontFamily: "inherit" }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${INK10}`, paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(34,29,23,0.55)" }}>
            Your JSON-LD
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{ background: INK, color: "#F6F2EA", border: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
          >
            {copied ? "Copied ✓" : "Copy script"}
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontFamily: "'DM Mono',monospace",
            fontSize: 12.5,
            lineHeight: 1.6,
            color: INK,
            background: "#fff",
            border: `1px solid ${INK10}`,
            borderRadius: 12,
            padding: "16px 18px",
            overflowX: "auto",
          }}
        >
          {script}
        </pre>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "rgba(34,29,23,0.55)", lineHeight: 1.55 }}>
          Paste it into the <code>&lt;head&gt;</code> of your homepage, then run the page through Google&apos;s Rich
          Results Test to confirm it parses. Structured data helps search engines and AI assistants state your hours,
          location and phone number correctly, and it never hurts to be unambiguous.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
        <a href="/signup" style={{ background: INK, color: "#F6F2EA", padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
          Get a site that ships this automatically. Start free.
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
