import test from "node:test";
import assert from "node:assert/strict";

import { generateMetadata as generateJobMetadata } from "../../../src/app/(public)/ai-agents/[job]/page";
import { generateMetadata as generateVerticalMetadata } from "../../../src/app/(public)/ai-agents/[job]/for/[vertical]/page";

test("agent metadata does not advertise a missing Markdown alternate", async () => {
  const jobMetadata = await generateJobMetadata({
    params: Promise.resolve({ job: "missed-call-text-back" }),
  });
  const verticalMetadata = await generateVerticalMetadata({
    params: Promise.resolve({ job: "missed-call-text-back", vertical: "barbers" }),
  });

  assert.equal(jobMetadata.alternates?.canonical, "/ai-agents/missed-call-text-back");
  assert.equal(jobMetadata.alternates?.types, undefined);
  assert.equal(
    verticalMetadata.alternates?.canonical,
    "/ai-agents/missed-call-text-back/for/barbers",
  );
  assert.equal(verticalMetadata.alternates?.types, undefined);
});
