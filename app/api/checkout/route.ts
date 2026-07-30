import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionParams, PAYFAST_URL } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return NextResponse.json({ error: "No email on account" }, { status: 400 });

  const { plan } = await req.json();
  if (!["starter", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://intuixion.ai";
  const params = buildSubscriptionParams({ userId, email, plan, origin });

  // Return the signed params + PayFast URL so the browser can POST the form
  return NextResponse.json({ url: PAYFAST_URL, params });
}
