import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MarketingStructuredData } from "../../../src/components/analytics/structured-data";
import {
  AGENCY_PLAN_FACTS,
  AGENCY_POSITIONING,
} from "../../../src/lib/marketing/public-claims";

type JsonLd = Record<string, unknown>;

function renderSchemas(): JsonLd[] {
  const html = renderToStaticMarkup(createElement(MarketingStructuredData));
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(
    (match) => JSON.parse(match[1] ?? "{}") as JsonLd,
  );
}

test("marketing JSON-LD derives every sellable offer from the public plan facts", () => {
  const software = renderSchemas().find((schema) => schema["@type"] === "SoftwareApplication");
  assert.ok(software, "SoftwareApplication schema must render");

  const offers = software.offers as Array<Record<string, unknown>>;
  assert.deepEqual(
    offers.map((offer) => ({
      name: offer.name,
      priceMonthly: Number(offer.price),
      audience: offer.description,
    })),
    AGENCY_PLAN_FACTS.map((plan) => ({
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      audience: plan.audience,
    })),
  );
});

test("marketing JSON-LD uses one canonical agency entity on the www host", () => {
  const schemas = renderSchemas();
  const organization = schemas.find((schema) => schema["@type"] === "Organization");
  const website = schemas.find((schema) => schema["@type"] === "WebSite");
  const software = schemas.find((schema) => schema["@type"] === "SoftwareApplication");

  assert.equal(organization?.["@id"], "https://www.seldonframe.com/#org");
  assert.equal(organization?.url, "https://www.seldonframe.com");
  assert.equal(organization?.description, AGENCY_POSITIONING);
  assert.deepEqual(website?.publisher, { "@id": "https://www.seldonframe.com/#org" });
  assert.deepEqual(software?.provider, { "@id": "https://www.seldonframe.com/#org" });
});
