import { SignIn } from "@clerk/nextjs";

const C = { bg: "#f9f8f5", primary: "#0c2340", accent: "#0d9488", text: "#0d0d0d", muted: "#5f6368", dim: "#9aa0a6", border: "#e3e0da", surface: "#ffffff", surface2: "#f1f0ed" };

const clerkAppearance = {
  variables: {
    colorBackground:              C.surface,
    colorInputBackground:         C.surface2,
    colorInputText:               C.text,
    colorText:                    C.text,
    colorTextSecondary:           C.muted,
    colorPrimary:                 C.primary,
    colorTextOnPrimaryBackground: "#ffffff",
    borderRadius:                 "10px",
  },
  elements: {
    card:       { boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: `1px solid ${C.border}` },
    dividerLine: { background: C.border },
  },
};

export default function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 36 }}>
        <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="11" r="8" fill="#0c2340"/>
          <rect x="22" y="22" width="12" height="28" rx="6" fill="#0c2340"/>
          <line x1="33" y1="24" x2="50" y2="11" stroke="#0d9488" strokeWidth="5.5" strokeLinecap="round"/>
          <line x1="23" y1="28" x2="7" y2="44" stroke="#0d9488" strokeWidth="5.5" strokeLinecap="round"/>
        </svg>
        <span style={{ color: C.text, fontWeight: 700, fontSize: 17 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
      </a>
      <SignIn forceRedirectUrl="/demo" signUpUrl="/sign-up" appearance={clerkAppearance} />
    </div>
  );
}
