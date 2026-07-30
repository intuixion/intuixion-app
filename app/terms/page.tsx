export default function TermsPage() {
  const C = { bg: "#07070f", surface: "#0d0d1a", border: "#1e1e30", text: "#eeeef8", muted: "#9090b8", primary: "#6d5fff", accent: "#00d4a8" };

  const sections = [
    {
      title: "Service Description",
      content: `intuixion.ai provides an AI-powered document intelligence service that searches and summarises South African regulatory documents. The service is intended as a research and productivity tool for legal, compliance, and HR professionals.`,
    },
    {
      title: "Not Legal Advice",
      content: `The information provided by intuixion.ai is for general informational and research purposes only. It does not constitute legal, compliance, financial, or professional advice. You should always verify information independently and consult a qualified professional before relying on any output for decisions with material consequences. intuixion.ai accepts no liability for actions taken or not taken based on information provided by the service.`,
    },
    {
      title: "Acceptable Use",
      content: `You may use intuixion.ai for lawful professional research and productivity purposes. You may not: use the service to produce outputs intended to mislead others; reverse-engineer or attempt to extract the underlying model or corpus; share access credentials; or use the service in a manner that violates any applicable South African law.`,
    },
    {
      title: "Accuracy & Currency of Information",
      content: `While we take reasonable steps to maintain an accurate and current regulatory corpus, we do not guarantee that information is complete, up-to-date, or free from error. Regulations change. Always verify critical information against the official Gazette or authoritative source.`,
    },
    {
      title: "Subscription & Cancellation",
      content: `Subscriptions are billed monthly in advance. A 14-day free trial is available on Starter and Pro plans — no credit card required during the trial. You may cancel at any time; access continues until the end of the current billing period. No refunds are provided for partial months.`,
    },
    {
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by South African law, intuixion.ai's liability for any claim arising from use of the service is limited to the fees paid in the three months preceding the claim. We are not liable for indirect, consequential, or special damages.`,
    },
    {
      title: "Governing Law",
      content: `These terms are governed by the laws of the Republic of South Africa. Disputes will be subject to the jurisdiction of the Western Cape High Court, Cape Town.`,
    },
    {
      title: "Contact",
      content: `For terms-related enquiries: contact@intuixion.ai\nintuixion.ai, Cape Town, South Africa`,
    },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      <nav style={{ borderBottom: `1px solid ${C.border}`, background: C.surface, padding: "0 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "white", fontSize: 12 }}>i</div>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
          </a>
          <a href="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>← Back to home</a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Legal</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: C.text, margin: "0 0 8px" }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 48px" }}>Last updated: May 2026 · Governing law: Republic of South Africa</p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: "32px 0", borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.7 }}>
            By using intuixion.ai you agree to these terms. For questions, email{" "}
            <a href="mailto:contact@intuixion.ai" style={{ color: C.primary }}>contact@intuixion.ai</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
