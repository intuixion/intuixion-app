/**
 * PayFast integration utilities.
 * Docs: https://developers.payfast.co.za/docs
 *
 * PayFast does not use a REST checkout session like Stripe.
 * Instead: generate signed form parameters, return them to the browser,
 * then the browser submits a hidden POST form to PayFast's payment URL.
 */

import crypto from "crypto";

export const PAYFAST_URL = process.env.NODE_ENV === "production"
  ? "https://www.payfast.co.za/eng/process"
  : "https://sandbox.payfast.co.za/eng/process";

// Frequency codes: 1=daily 2=weekly 3=monthly 4=quarterly 5=biannual 6=annual
export const FREQUENCY_MONTHLY = 3;

export interface PayFastParams {
  merchant_id:      string;
  merchant_key:     string;
  return_url:       string;
  cancel_url:       string;
  notify_url:       string;
  email_address:    string;
  m_payment_id:     string;  // your internal reference (userId_plan)
  amount:           string;  // e.g. "750.00"
  item_name:        string;
  item_description?: string;
  // Subscription fields
  subscription_type?: string;  // "1" for subscription
  billing_date?:      string;  // YYYY-MM-DD
  recurring_amount?:  string;
  frequency?:         string;
  cycles?:            string;  // "0" = indefinite
  // Signature (added last)
  signature?:         string;
}

/**
 * Generate an MD5 signature for a PayFast parameter set.
 * All params must be sorted, URL-encoded, joined as key=val&...,
 * then optionally appended with the passphrase before hashing.
 */
export function generateSignature(params: Record<string, string>, passphrase?: string): string {
  const sorted = Object.keys(params)
    .filter((k) => k !== "signature" && params[k] !== "")
    .sort()
    .map((k) => `${k}=${encodeURIComponent(params[k].trim()).replace(/%20/g, "+")}`)
    .join("&");

  const toHash = passphrase ? `${sorted}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}` : sorted;
  return crypto.createHash("md5").update(toHash).digest("hex");
}

/**
 * Build signed PayFast parameters for a subscription plan.
 * Returns the params object (without `signature` added separately by caller).
 */
export function buildSubscriptionParams(opts: {
  userId:       string;
  email:        string;
  plan:         "starter" | "pro";
  origin:       string;
}): PayFastParams & { signature: string } {
  const amounts: Record<string, string> = {
    starter: "750.00",
    pro:     "2500.00",
  };
  const labels: Record<string, string> = {
    starter: "intuixion.ai Starter",
    pro:     "intuixion.ai Pro",
  };

  const today = new Date().toISOString().split("T")[0];

  const params: Record<string, string> = {
    merchant_id:       process.env.PAYFAST_MERCHANT_ID!,
    merchant_key:      process.env.PAYFAST_MERCHANT_KEY!,
    return_url:        `${opts.origin}/success`,
    cancel_url:        `${opts.origin}/upgrade`,
    notify_url:        `${opts.origin}/api/webhook`,
    email_address:     opts.email,
    m_payment_id:      `${opts.userId}_${opts.plan}_${Date.now()}`,
    amount:            amounts[opts.plan],
    item_name:         labels[opts.plan],
    item_description:  "Monthly subscription to intuixion.ai",
    subscription_type: "1",
    billing_date:      today,
    recurring_amount:  amounts[opts.plan],
    frequency:         String(FREQUENCY_MONTHLY),
    cycles:            "0",
  };

  const signature = generateSignature(params, process.env.PAYFAST_PASSPHRASE);
  return { ...params, signature } as PayFastParams & { signature: string };
}

/**
 * Verify a PayFast ITN (Instant Transaction Notification) webhook.
 * Steps: validate signature, then confirm with PayFast's validation endpoint.
 */
export async function verifyITN(body: URLSearchParams): Promise<boolean> {
  const params: Record<string, string> = {};
  body.forEach((value, key) => { params[key] = value; });

  const receivedSignature = params["signature"];
  if (!receivedSignature) return false;

  const { signature: _, ...withoutSig } = params;
  const expectedSignature = generateSignature(withoutSig, process.env.PAYFAST_PASSPHRASE);

  if (expectedSignature !== receivedSignature) return false;

  // Server-to-server confirmation with PayFast
  const validateUrl = process.env.NODE_ENV === "production"
    ? "https://www.payfast.co.za/eng/query/validate"
    : "https://sandbox.payfast.co.za/eng/query/validate";

  try {
    const res = await fetch(validateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const text = await res.text();
    return text.trim() === "VALID";
  } catch {
    return false;
  }
}

/** Parse the plan from a PayFast m_payment_id (format: userId_plan_timestamp) */
export function parseMPaymentId(mPaymentId: string): { userId: string; plan: string } | null {
  const parts = mPaymentId.split("_");
  if (parts.length < 2) return null;
  return { userId: parts[0], plan: parts[1] };
}
