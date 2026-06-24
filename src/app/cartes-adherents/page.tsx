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

const AC_BLUE   = "#1756D6";
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

export default async function CartesAdherentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_templates")
    .select("id, name, status, fields, organization_name, card_year, created_at")
    .order("created_at", { ascending: false });

  const templates: Template[] = data ?? [];

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, fontFamily: AC_FONT, background: "#F4F6F9", minHeight: "100vh" }}>
      {/* Topbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.375rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
            {"Cartes d'adhérents"}
          </h1>
          <p style={{ margin: "4px 0 0", color: GRAY_SUB, fontSize: "0.8rem" }}>
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
  );
}
