export default function PrivacyPage() {
  const C = { bg: "#07070f", surface: "#0d0d1a", border: "#1e1e30", text: "#eeeef8", muted: "#9090b8", primary: "#6d5fff", accent: "#00d4a8" };

  const sections = [
    {
      id: "popia",
      title: "POPIA Notice",
      content: `intuixion.ai processes personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA). We collect only the information necessary to provide our service, including your name, email address, and usage data. Your information is not sold to third parties. You have the right to access, correct, and request deletion of your personal information at any time by contacting contact@intuixion.ai.`,
    },
    {
      title: "Information We Collect",
      content: `We collect: account information (name, email, organisation) provided at registration; usage data (queries submitted, documents uploaded, session duration); payment information processed securely via our payment provider. We do not store the content of your queries beyond what is necessary to deliver the service.`,
    },
    {
      title: "How We Use Your Information",
      content: `Your information is used to: provide and improve the intuixion.ai service; send service notifications and updates; process payments; comply with legal obligations. We do not use your data for advertising or sell it to third parties.`,
    },
    {
      title: "Data Storage & Security",
      content: `Starter and Pro plan data is processed on EU-based servers. Team plan clients may elect SA data residency (Cape Town). All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Access is restricted by role-based access controls.`,
    },
    {
      title: "Your Rights",
      content: `Under POPIA you have the right to: access personal information we hold about you; request correction of inaccurate information; request deletion of your personal information; object to processing; lodge a complaint with the Information Regulator of South Africa. To exercise any of these rights, email contact@intuixion.ai.`,
    },
    {
      title: "Contact",
      content: `Data Protection Officer: contact@intuixion.ai\nintuixion.ai, Cape Town, South Africa\nInformation Regulator: https://www.justice.gov.za/inforeg/`,
    },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Minimal nav */}
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
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: C.text, margin: "0 0 8px" }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 48px" }}>Last updated: May 2026 · Governing law: Republic of South Africa</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {sections.map((s, i) => (
            <div key={i} id={s.id} style={{ padding: "32px 0", borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.7 }}>
            This privacy policy is a living document and will be updated as the product evolves. Material changes will be communicated by email to registered users.
            For questions, email <a href="mailto:contact@intuixion.ai" style={{ color: C.primary }}>contact@intuixion.ai</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
