import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { handleStripeCheckoutCompleted } from "@/lib/payments/actions";

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const elements = signatureHeader.split(",");
  const timestamp = elements.find((part) => part.startsWith("t="))?.replace("t=", "");
  const v1 = elements.find((part) => part.startsWith("v1="))?.replace("v1=", "");

  if (!timestamp || !v1) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(v1, "hex");

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const payload = await request.text();

  if (!verifyStripeSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload) as {
    type?: string;
    data?: {
      object?: {
        id?: string;
        metadata?: Record<string, string>;
        amount_total?: number;
        currency?: string;
        payment_intent?: string | null;
      };
    };
  };

  if (event.type === "checkout.session.completed" && event.data?.object?.id) {
    await handleStripeCheckoutCompleted({
      id: event.data.object.id,
      metadata: event.data.object.metadata,
      amount_total: event.data.object.amount_total,
      currency: event.data.object.currency,
      payment_intent: event.data.object.payment_intent ?? null,
    });
  }

  return NextResponse.json({ ok: true });
}
