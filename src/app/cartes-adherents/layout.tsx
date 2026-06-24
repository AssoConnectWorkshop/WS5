import Link from "next/link";

export default function CartesAdherentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <aside
        style={{
          width: 260,
          background: "#111827",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "28px 20px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 800, letterSpacing: "-0.03em" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #818cf8, #4f46e5)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "0.9rem",
            }}
          >
            A
          </div>
          <span>AssoConnect</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px", marginBottom: 4 }}>
            Menu
          </p>
          {[
            { label: "Dashboard", href: "/" },
            { label: "Contacts", href: "#" },
            { label: "CRM", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                color: "#dbe4ff",
                textDecoration: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.95rem",
              }}
            >
              <span>{label}</span>
              <span>›</span>
            </Link>
          ))}
          <Link
            href="/cartes-adherents"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <span>{"Carte d'adhérents"}</span>
            <span>●</span>
          </Link>
          <Link
            href="#"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              color: "#dbe4ff",
              textDecoration: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <span>Emailing</span>
            <span>›</span>
          </Link>
        </nav>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px", marginBottom: 4 }}>
            Raccourcis
          </p>
          <Link
            href="/cartes-adherents/nouveau"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              color: "#dbe4ff",
              textDecoration: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <span>Nouveau template</span>
            <span>+</span>
          </Link>
          <Link
            href="/cartes-adherents/impression-en-lot"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              color: "#dbe4ff",
              textDecoration: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <span>Impression en lot</span>
            <span>↗</span>
          </Link>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 22%, #f6f7fb 100%)",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
