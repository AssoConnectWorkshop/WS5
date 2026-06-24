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

/* ── Design tokens (from AssoConnect screenshot) ── */
const AC_BLUE   = "#1756D6"; // royal blue sidebar
const AC_FONT   = "'Inter', 'Nunito', 'Segoe UI', system-ui, sans-serif";
const GRAY_TEXT = "#374151";
const GRAY_SUB  = "#6B7280";
const BORDER    = "#E5E7EB";

const btnBase: React.CSSProperties = {
  border: "none",
  borderRadius: 6,
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.875rem",
  fontFamily: AC_FONT,
  lineHeight: 1.4,
};

/* ── Sidebar nav items (mirror of AssoConnect) ── */
const NAV = [
  { label: "Accueil",         sub: false },
  { label: "Communauté",      sub: true,  active: true },
  { label: "Comptabilité",    sub: true  },
  { label: "Compte Pro",      sub: false },
  { label: "Paiements",       sub: true  },
  { label: "Formulaires",     sub: true  },
  { label: "Site internet",   sub: true  },
  { label: "Emailing",        sub: true  },
  { label: "Exports & Stats", sub: true  },
  { label: "Admin master",    sub: true  },
];

export default async function CartesAdherentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_templates")
    .select("id, name, status, fields, organization_name, card_year, created_at")
    .order("created_at", { ascending: false });

  const templates: Template[] = data ?? [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: AC_FONT, background: "#F4F6F9" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 232,
        minWidth: 232,
        background: AC_BLUE,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        inset: "0 auto 0 0",
        overflowY: "auto",
      }}>
        {/* Org block */}
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: "#fff", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.8rem", color: AC_BLUE,
            }}>AC</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.3 }}>
              AssoConn… form
            </span>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "#F59E0B", borderRadius: 20, padding: "3px 10px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700 }}>Association</span>
          </span>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", marginTop: 8 }}>
            Lucas MARCHIONNE
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 8px" }}>
          {NAV.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 10px", borderRadius: 6, marginBottom: 1,
                background: item.active ? "rgba(255,255,255,0.18)" : "transparent",
                color: item.active ? "#fff" : "rgba(255,255,255,0.78)",
                fontSize: "0.875rem", fontWeight: item.active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              <span>{item.label}</span>
              {item.sub && (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </div>
          ))}
        </nav>

        {/* Paramètres */}
        <div style={{ padding: "10px 8px 18px", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 10px", borderRadius: 6,
            color: "rgba(255,255,255,0.78)", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Paramètres
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ marginLeft: 232, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Topbar */}
        <div style={{
          background: "#fff",
          borderBottom: `1px solid ${BORDER}`,
          padding: "16px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.375rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              {"Cartes d'adhérents"}
            </h1>
            <p style={{ margin: "3px 0 0", color: GRAY_SUB, fontSize: "0.8rem" }}>
              Gestion des templates, aperçu des cartes, impression individuelle ou en lot.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button style={{ ...btnBase, background: "#fff", color: GRAY_TEXT, border: `1px solid ${BORDER}` }}>
              Aide
            </button>
            <button style={{ ...btnBase, background: "#EEF3FF", color: AC_BLUE }}>
              {"Voir l'historique"}
            </button>
            <Link
              href="/cartes-adherents/nouveau"
              style={{
                ...btnBase,
                background: AC_BLUE,
                color: "#fff",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 1px 4px rgba(23,86,214,0.28)",
              }}
            >
              {"+ Ajouter une carte d'adhérent"}
            </Link>
          </div>
        </div>

        {/* Page body */}
        <div style={{ padding: "24px 28px", flex: 1 }}>

          {/* Template list */}
          {templates.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: 10, border: `1px solid ${BORDER}`,
              boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
              padding: "64px 40px", textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🪪</div>
              <h2 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#111827", fontWeight: 700 }}>
                Aucun template
              </h2>
              <p style={{ color: GRAY_SUB, marginBottom: 24, fontSize: "0.875rem" }}>
                {"Importez votre première carte d'adhérent pour commencer."}
              </p>
              <Link
                href="/cartes-adherents/nouveau"
                style={{ ...btnBase, background: AC_BLUE, color: "#fff", textDecoration: "none", display: "inline-block" }}
              >
                Importer une carte
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {templates.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`,
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                    padding: "14px 18px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{t.name}</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: GRAY_SUB }}>
                      {t.organization_name ? `${t.organization_name} · ` : ""}
                      {Array.isArray(t.fields) ? t.fields.length : 0} champ
                      {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""} identifié
                      {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""}
                      {t.card_year ? ` · ${t.card_year}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 999, fontSize: "0.76rem", fontWeight: 600,
                      background: t.status === "ready" ? "#ECFDF5" : "#FFF7ED",
                      color:      t.status === "ready" ? "#065F46" : "#92400E",
                    }}>
                      {t.status === "ready" ? "Prêt" : "Brouillon"}
                    </span>
                    <Link
                      href={`/cartes-adherents/${t.id}`}
                      style={{
                        ...btnBase, padding: "6px 14px",
                        background: "#fff", color: GRAY_TEXT,
                        border: `1px solid ${BORDER}`,
                        textDecoration: "none", display: "inline-block",
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
