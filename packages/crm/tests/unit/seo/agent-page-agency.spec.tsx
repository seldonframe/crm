import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AgentPage } from "../../../src/components/seo/agent-page";
import { getJob, getVertical } from "../../../src/lib/seo/agent-pages";

test("a vertical agent page sells an agency-delivered client outcome", () => {
  const html = renderToStaticMarkup(
    createElement(AgentPage, {
      job: getJob("missed-call-text-back"),
      vertical: getVertical("barbers"),
    }),
  );

  assert.match(html, /agency/i);
  assert.match(html, /Build this for a barbershop client/);
  assert.doesNotMatch(html, /Deploy it for my barbershop/);
  assert.match(html, /Agency Starter/);
  assert.match(html, /\$99/);
});
