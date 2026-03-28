import { NextResponse } from "next/server";
import { markEmailOpenedByPixelAction } from "@/lib/emails/actions";

const PIXEL_BYTES = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 255, 255, 255,
  0, 0, 0, 33, 249, 4, 1, 10, 0, 1, 0, 44, 0, 0, 0, 0,
  1, 0, 1, 0, 0, 2, 2, 76, 1, 0, 59,
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ emailId: string }> }
) {
  const { emailId } = await params;

  if (emailId) {
    await markEmailOpenedByPixelAction(emailId);
  }

  return new NextResponse(PIXEL_BYTES, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
