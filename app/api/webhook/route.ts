import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyITN, parseMPaymentId } from "@/lib/payfast";

/**
 * PayFast ITN (Instant Transaction Notification) handler.
 * PayFast POSTs form-encoded data to this endpoint after every payment event.
 */
export async function POST(req: NextRequest) {
  const body = new URLSearchParams(await req.text());

  const valid = await verifyITN(body);
  if (!valid) {
    return NextResponse.json({ error: "ITN verification failed" }, { status: 400 });
  }

  const paymentStatus = body.get("payment_status");
  const mPaymentId    = body.get("m_payment_id") ?? "";

  if (paymentStatus !== "COMPLETE") {
    // PayFast also sends FAILED / CANCELLED — we just acknowledge and ignore
    return NextResponse.json({ received: true });
  }

  const parsed = parseMPaymentId(mPaymentId);
  if (!parsed) return NextResponse.json({ error: "Invalid m_payment_id" }, { status: 400 });

  const { userId, plan } = parsed;
  const pfToken = body.get("token") ?? undefined;  // PayFast recurring token for future billing

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      plan,
      payfastToken:  pfToken,
      subscribedAt:  new Date().toISOString(),
    },
  });

  // PayFast requires a 200 response with empty body to acknowledge receipt
  return new NextResponse(null, { status: 200 });
}
