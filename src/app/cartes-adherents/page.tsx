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

const btnBase: React.CSSProperties = {
  border: 0,
  borderRadius: 12,
  padding: "11px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.92rem",
  fontFamily: "inherit",
};

export default async function CartesAdherentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_templates")
    .select("id, name, status, fields, organization_name, card_year, created_at")
    .order("created_at", { ascending: false });

  const templates: Template[] = data ?? [];

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Topbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.05em", color: "#1f2937" }}>
            {"Carte d'adhérents"}
          </h1>
          <p style={{ margin: "6px 0 0", color: "#667085" }}>
            Gestion des templates, aperçu des cartes, impression individuelle ou en lot.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{ ...btnBase, background: "#fff", color: "#1f2937", boxShadow: "inset 0 0 0 1px #dbe2f0" }}>
            Aide
          </button>
          <button style={{ ...btnBase, background: "#eef2ff", color: "#4f46e5", boxShadow: "none" }}>
            {"Voir l'historique"}
          </button>
          <Link
            href="/cartes-adherents/nouveau"
            style={{
              ...btnBase,
              background: "#4f46e5",
              color: "#fff",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {"Ajouter une carte d'adhérent"}
          </Link>
        </div>
      </div>

      {/* Template list */}
      {templates.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🪪</div>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", color: "#1f2937", fontWeight: 700 }}>
            Aucun template
          </h2>
          <p style={{ color: "#667085", marginBottom: 24 }}>
            {"Importez votre première carte d'adhérent pour commencer."}
          </p>
          <Link
            href="/cartes-adherents/nouveau"
            style={{
              ...btnBase,
              background: "#4f46e5",
              color: "#fff",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Importer une carte
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {templates.map((t) => (
            <div
              key={t.id}
              style={{
                background: "linear-gradient(180deg, #fff, #fbfcff)",
                borderRadius: 16,
                border: "1px solid #dbe2f0",
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#1f2937" }}>{t.name}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#667085" }}>
                  {t.organization_name ? `${t.organization_name} · ` : ""}
                  {Array.isArray(t.fields) ? t.fields.length : 0} champ
                  {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""} identifié
                  {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""}
                  {t.card_year ? ` · ${t.card_year}` : ""}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    background: t.status === "ready" ? "#e8f8ee" : "#fff7e6",
                    color: t.status === "ready" ? "#166534" : "#92400e",
                  }}
                >
                  {t.status === "ready" ? "Prêt" : "Brouillon"}
                </span>
                <Link
                  href={`/cartes-adherents/${t.id}`}
                  style={{
                    ...btnBase,
                    background: "#fff",
                    color: "#1f2937",
                    boxShadow: "inset 0 0 0 1px #dbe2f0",
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "8px 14px",
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
