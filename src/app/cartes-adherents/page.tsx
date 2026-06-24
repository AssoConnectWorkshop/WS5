import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { CardField } from "@/lib/card-analysis";

export const dynamic = "force-dynamic";

type Template = {
  id: number;
  name: string;
  status: string;
  fields: CardField[];
  organization_name: string | null;
  card_year: string | null;
  created_at: string;
};

const AC_BLUE = "#1756D6";

const navItems = [
  { label: "Accueil", href: "/", icon: "grid", hasChildren: false },
  { label: "Communauté", href: "#", icon: "users", hasChildren: true, active: true },
  { label: "Comptabilité", href: "#", icon: "table", hasChildren: true },
  { label: "Compte Pro", href: "#", icon: "building", hasChildren: false },
  { label: "Paiements", href: "#", icon: "card", hasChildren: true },
  { label: "Formulaires", href: "#", icon: "doc", hasChildren: true },
  { label: "Site internet", href: "#", icon: "monitor", hasChildren: true },
  { label: "Emailing", href: "#", icon: "mail", hasChildren: true },
  { label: "Exports & Stats", href: "#", icon: "chart", hasChildren: true },
  { label: "Admin master", href: "#", icon: "shield", hasChildren: true },
];

function NavIcon({ icon }: { icon: string }) {
  const s = { width: 18, height: 18, flexShrink: 0 as const };
  if (icon === "grid") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
  if (icon === "users") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  if (icon === "table") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  );
  if (icon === "building") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
    </svg>
  );
  if (icon === "card") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  );
  if (icon === "doc") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
  if (icon === "monitor") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
  );
  if (icon === "mail") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  if (icon === "chart") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
  if (icon === "shield") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
  if (icon === "gear") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
  return null;
}

export default async function CartesAdherentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_templates")
    .select("id, name, status, fields, organization_name, card_year, created_at")
    .order("created_at", { ascending: false });

  const templates: Template[] = data ?? [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: "#f5f7fa" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: AC_BLUE,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: "auto",
      }}>
        {/* Org header */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.85rem", color: AC_BLUE, flexShrink: 0,
            }}>AC</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                AssoConnect WS5
              </div>
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F59E0B", borderRadius: 20, padding: "4px 10px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
            <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>Association</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", marginTop: 8, fontWeight: 500 }}>
            Lucas MARCHIONNE
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                marginBottom: 2,
                color: item.active ? "#fff" : "rgba(255,255,255,0.72)",
                background: item.active ? "rgba(255,255,255,0.15)" : "transparent",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: item.active ? 600 : 500,
                transition: "background 0.15s",
              }}
            >
              <NavIcon icon={item.icon} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.hasChildren && (
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom: Paramètres */}
        <div style={{ padding: "10px 8px 16px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <Link
            href="#"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 8,
              color: "rgba(255,255,255,0.72)", textDecoration: "none",
              fontSize: "0.88rem", fontWeight: 500,
            }}
          >
            <NavIcon icon="gear" />
            <span>Paramètres</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Topbar */}
        <header style={{
          background: "#fff",
          borderBottom: "1px solid #e8ecf0",
          padding: "0 28px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>
              {"Cartes d'adhérents"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{
              border: "1px solid #dce1e9", borderRadius: 8, padding: "7px 14px",
              background: "#fff", color: "#374151", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
            }}>
              Aide
            </button>
            <button style={{
              border: "none", borderRadius: 8, padding: "7px 14px",
              background: "#EEF3FF", color: AC_BLUE, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
            }}>
              {"Voir l'historique"}
            </button>
            <Link
              href="/cartes-adherents/nouveau"
              style={{
                border: "none", borderRadius: 8, padding: "8px 16px",
                background: AC_BLUE, color: "#fff",
                fontSize: "0.85rem", fontWeight: 600,
                textDecoration: "none", display: "inline-block",
                boxShadow: "0 1px 3px rgba(23,86,214,0.3)",
              }}
            >
              {"+ Ajouter une carte d'adhérent"}
            </Link>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "28px 32px", flex: 1 }}>
          {/* Sub-nav breadcrumb */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 22, fontSize: "0.82rem", color: "#6B7280" }}>
            <span>Communauté</span>
            <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ color: AC_BLUE, fontWeight: 600 }}>{"Cartes d'adhérents"}</span>
          </div>

          {templates.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0",
              boxShadow: "0 1px 4px rgba(15,23,42,0.06)", padding: "64px 40px", textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🪪</div>
              <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", color: "#111827", fontWeight: 700 }}>
                Aucun template
              </h2>
              <p style={{ color: "#6B7280", marginBottom: 24, fontSize: "0.9rem" }}>
                {"Importez votre première carte d'adhérent pour commencer."}
              </p>
              <Link
                href="/cartes-adherents/nouveau"
                style={{
                  display: "inline-block", padding: "9px 18px", borderRadius: 8,
                  background: AC_BLUE, color: "#fff", textDecoration: "none",
                  fontSize: "0.88rem", fontWeight: 600,
                }}
              >
                Importer une carte
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {templates.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#fff", borderRadius: 10,
                    border: "1px solid #e8ecf0",
                    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
                    padding: "14px 18px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{t.name}</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.82rem", color: "#6B7280" }}>
                      {t.organization_name ? `${t.organization_name} · ` : ""}
                      {Array.isArray(t.fields) ? t.fields.length : 0} champ
                      {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""} identifié
                      {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""}
                      {t.card_year ? ` · ${t.card_year}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600,
                      background: t.status === "ready" ? "#ECFDF5" : "#FFF7ED",
                      color: t.status === "ready" ? "#065F46" : "#92400E",
                    }}>
                      {t.status === "ready" ? "Prêt" : "Brouillon"}
                    </span>
                    <Link
                      href={`/cartes-adherents/${t.id}`}
                      style={{
                        display: "inline-block", padding: "7px 14px", borderRadius: 8,
                        border: "1px solid #dce1e9", background: "#fff", color: "#374151",
                        textDecoration: "none", fontSize: "0.85rem", fontWeight: 500,
                      }}
                    >
                      Visualiser
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
