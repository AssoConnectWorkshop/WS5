"use client";

import { useState } from "react";
import Link from "next/link";
import type { Template } from "./page";

const btn: React.CSSProperties = {
  border: 0,
  borderRadius: 12,
  padding: "11px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.92rem",
  fontFamily: "inherit",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #dbe2f0",
  background: "#fff",
  borderRadius: 12,
  padding: "11px 14px",
  fontFamily: "inherit",
  fontSize: "0.92rem",
  color: "#1f2937",
};

type Selection = "crm" | "groupes" | "variables";

const SELECTIONS: { key: Selection; label: string; title: string; desc: string }[] = [
  {
    key: "crm",
    label: "Sélection CRM",
    title: "Selon la structure CRM",
    desc: "Filtrer par antenne, statut, campagne, événement, cotisation.",
  },
  {
    key: "groupes",
    label: "Groupes",
    title: "Groupe fixe ou dynamique",
    desc: "Ex. bénévoles 2026, adhérents premium, anciens membres.",
  },
  {
    key: "variables",
    label: "Filtre libre",
    title: "Variables personnalisées",
    desc: "Ex. ville, date d'adhésion, type de cotisation, tag CRM.",
  },
];

export default function ImpressionEnLotClient({ templates }: { templates: Template[] }) {
  const [templateId, setTemplateId] = useState<number | null>(templates[0]?.id ?? null);
  const [selection, setSelection] = useState<Selection>("crm");
  const [sendEmail, setSendEmail] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === templateId) ?? null;

  function handleGenerate() {
    if (!selectedTemplate) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      if (sendEmail) setShowSuccess(true);
    }, 1800);
  }

  const boxBase: React.CSSProperties = {
    border: "1px solid #dbe2f0",
    borderRadius: 14,
    background: "#fff",
    padding: 14,
    minHeight: 118,
    display: "grid",
    alignContent: "start",
    gap: 8,
    cursor: "pointer",
  };

  const boxActive: React.CSSProperties = {
    ...boxBase,
    border: "2px solid #4f46e5",
    boxShadow: "0 0 0 4px #eef2ff",
  };

  const cardPreview = selectedTemplate?.image_data ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={selectedTemplate.image_data}
      alt={selectedTemplate.name}
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #c7d2fe 100%)",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.6)",
        fontSize: "0.8rem",
        padding: 8,
        textAlign: "center",
      }}
    >
      {selectedTemplate?.organization_name ?? "Aperçu"}
    </div>
  );

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 920 }}>
      {/* Breadcrumb + title */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Link href="/cartes-adherents" style={{ color: "#667085", textDecoration: "none", fontSize: "0.9rem" }}>
            {"Carte d'adhérents"}
          </Link>
          <span style={{ color: "#667085" }}>›</span>
          <span style={{ color: "#1f2937", fontSize: "0.9rem", fontWeight: 600 }}>Impression en lot</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.05em", color: "#1f2937" }}>
          Impression en lot
        </h1>
        <p style={{ margin: "6px 0 0", color: "#667085" }}>
          {"Générez et imprimez les cartes d'adhérents pour un groupe de contacts."}
        </p>
      </div>

      {/* Template selection */}
      <article
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
        }}
      >
        <div style={{ padding: "22px 24px 0" }}>
          <h2 style={{ margin: 0, letterSpacing: "-0.03em", fontSize: "1.1rem" }}>1. Choisir un template</h2>
          <p style={{ margin: "6px 0 0", color: "#667085", fontSize: "0.95rem" }}>
            Sélectionnez le modèle de carte à utiliser pour cette impression.
          </p>
        </div>

        <div style={{ padding: "18px 24px 24px" }}>
          {templates.length === 0 ? (
            <div
              style={{
                padding: "24px",
                borderRadius: 14,
                background: "#f1f4fb",
                border: "1px solid #dbe2f0",
                textAlign: "center",
                color: "#667085",
              }}
            >
              <p style={{ margin: "0 0 12px" }}>Aucun template disponible.</p>
              <Link
                href="/cartes-adherents/nouveau"
                style={{
                  ...btn,
                  background: "#4f46e5",
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Créer un template
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {templates.map((t) => {
                const active = t.id === templateId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: active ? "2px solid #4f46e5" : "1px solid #dbe2f0",
                      boxShadow: active ? "0 0 0 4px #eef2ff" : "none",
                      background: active ? "#fafbff" : "#fff",
                      cursor: "pointer",
                      transition: "box-shadow 0.15s",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 72,
                        height: 46,
                        borderRadius: 8,
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #c7d2fe 100%)",
                      }}
                    >
                      {t.image_data && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.image_data}
                          alt={t.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, color: "#1f2937", fontSize: "0.95rem" }}>{t.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.83rem", color: "#667085" }}>
                        {t.organization_name ? `${t.organization_name} · ` : ""}
                        {Array.isArray(t.fields) ? t.fields.length : 0} champ
                        {Array.isArray(t.fields) && t.fields.length !== 1 ? "s" : ""}
                        {t.card_year ? ` · ${t.card_year}` : ""}
                      </p>
                    </div>

                    {/* Status + radio */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: 999,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          background: t.status === "ready" ? "#e8f8ee" : "#fff7e6",
                          color: t.status === "ready" ? "#166534" : "#92400e",
                        }}
                      >
                        {t.status === "ready" ? "Prêt" : "Brouillon"}
                      </span>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          border: active ? "6px solid #4f46e5" : "2px solid #dbe2f0",
                          background: "#fff",
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </article>

      {/* Contact selection + preview */}
      <article
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
          opacity: selectedTemplate ? 1 : 0.5,
          pointerEvents: selectedTemplate ? "auto" : "none",
        }}
      >
        <div
          style={{
            padding: "22px 24px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, letterSpacing: "-0.03em", fontSize: "1.1rem" }}>2. Sélectionner les contacts</h2>
            <p style={{ margin: "6px 0 0", color: "#667085", fontSize: "0.95rem" }}>
              Définissez les contacts dont les cartes seront imprimées.
            </p>
          </div>
          <button
            style={{ ...btn, background: "#4f46e5", color: "#fff" }}
            onClick={handleGenerate}
            disabled={generating || !selectedTemplate}
          >
            {generating ? "Génération…" : "Générer la planche A4"}
          </button>
        </div>

        <div style={{ padding: "22px 24px 24px", display: "grid", gap: 18 }}>
          {/* Selection mode */}
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "#f1f4fb",
              display: "grid",
              gap: 14,
              border: "1px solid #dbe2f0",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {SELECTIONS.map((s) => (
                <div
                  key={s.key}
                  style={selection === s.key ? boxActive : boxBase}
                  onClick={() => setSelection(s.key)}
                >
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: selection === s.key ? "#eef2ff" : "#f3f4f6",
                      color: selection === s.key ? "#4f46e5" : "#475467",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      width: "fit-content",
                    }}
                  >
                    {s.label}
                  </div>
                  <strong style={{ color: "#1f2937", fontSize: "0.95rem" }}>{s.title}</strong>
                  <span style={{ color: "#667085", fontSize: "0.88rem" }}>{s.desc}</span>
                </div>
              ))}
            </div>

            {selection === "crm" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["Antenne", "Statut", "Campagne", "Événement"].map((f) => (
                  <div key={f} style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: "0.88rem", color: "#667085", fontWeight: 600 }}>{f}</label>
                    <select style={inputStyle}>
                      <option value="">Tous</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {selection === "groupes" && (
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.88rem", color: "#667085", fontWeight: 600 }}>Groupe</label>
                <select style={inputStyle}>
                  <option>Bénévoles 2026</option>
                  <option>Adhérents premium</option>
                  <option>Anciens membres</option>
                </select>
              </div>
            )}

            {selection === "variables" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["Ville", "Type de cotisation"].map((f) => (
                  <div key={f} style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: "0.88rem", color: "#667085", fontWeight: 600 }}>{f}</label>
                    <input placeholder={`Filtrer par ${f.toLowerCase()}…`} style={inputStyle} />
                  </div>
                ))}
              </div>
            )}

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "0.92rem",
                color: "#1f2937",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                style={{ width: "auto", accentColor: "#4f46e5" }}
              />
              Envoyer la carte à tout le monde par email
            </label>
          </div>

          {/* Success banner */}
          {showSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 18px",
                background: "#ecfdf3",
                color: "#166534",
                border: "1px solid #bbf7d0",
                borderRadius: 16,
                fontWeight: 600,
              }}
            >
              <span>✓</span>
              <span>{"Succès — les cartes ont bien été envoyées par email."}</span>
              <button
                onClick={() => setShowSuccess(false)}
                style={{
                  marginLeft: "auto",
                  border: 0,
                  background: "transparent",
                  color: "#166534",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* A4 preview */}
          <div style={{ background: "#eef2f7", borderRadius: 18, padding: 20, border: "1px solid #dbe2f0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  color: "#475467",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                Aperçu impression A4 — planche multi-cartes
              </div>
              {selectedTemplate && (
                <span style={{ fontSize: "0.83rem", color: "#667085" }}>
                  Template : <strong style={{ color: "#1f2937" }}>{selectedTemplate.name}</strong>
                </span>
              )}
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                minHeight: 500,
                padding: 24,
                border: "1px solid #cbd5e1",
                position: "relative",
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 18,
                alignContent: "start",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  border: "2px dashed #cbd5e1",
                  pointerEvents: "none",
                  borderRadius: 6,
                }}
              />
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    border: "1.5px dashed #cbd5e1",
                    borderRadius: 14,
                    padding: 10,
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                    opacity: generating ? 0.5 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  <div style={{ width: "100%", aspectRatio: "1.586", borderRadius: 8, overflow: "hidden" }}>
                    {cardPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{ ...btn, background: "#4f46e5", color: "#fff" }}
              onClick={handleGenerate}
              disabled={generating || !selectedTemplate}
            >
              {generating ? "Génération en cours…" : "Générer la planche A4"}
            </button>
            <button style={{ ...btn, background: "#fff", color: "#1f2937", boxShadow: "inset 0 0 0 1px #dbe2f0" }}>
              Exporter en PDF
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
