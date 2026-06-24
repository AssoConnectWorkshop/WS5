"use client";

import { useState } from "react";
import Link from "next/link";

const btn: React.CSSProperties = {
  border: 0,
  borderRadius: 12,
  padding: "11px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.92rem",
  fontFamily: "inherit",
};

type Selection = "crm" | "groupes" | "variables";

export default function ImpressionEnLotPage() {
  const [selection, setSelection] = useState<Selection>("crm");
  const [sendEmail, setSendEmail] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      if (sendEmail) setShowSuccess(true);
    }, 1800);
  }

  const selectionBoxBase: React.CSSProperties = {
    border: "1px solid #dbe2f0",
    borderRadius: 14,
    background: "#fff",
    padding: 14,
    minHeight: 118,
    display: "grid",
    alignContent: "start",
    gap: 8,
    cursor: "pointer",
    transition: "box-shadow 0.15s",
  };

  const selectionBoxActive: React.CSSProperties = {
    ...selectionBoxBase,
    border: "2px solid #4f46e5",
    boxShadow: "0 0 0 4px #eef2ff",
  };

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

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
      {/* Topbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Link
              href="/cartes-adherents"
              style={{ color: "#667085", textDecoration: "none", fontSize: "0.9rem" }}
            >
              {"Carte d'adhérents"}
            </Link>
            <span style={{ color: "#667085" }}>›</span>
            <span style={{ color: "#1f2937", fontSize: "0.9rem", fontWeight: 600 }}>Impression en lot</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.05em", color: "#1f2937" }}>
            Impression en lot
          </h1>
          <p style={{ margin: "6px 0 0", color: "#667085" }}>
            Générez et imprimez les cartes d'adhérents pour un groupe de contacts.
          </p>
        </div>
      </div>

      {/* Main card */}
      <article
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
        }}
      >
        <div style={{ padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h2 style={{ margin: 0, letterSpacing: "-0.03em", fontSize: "1.15rem" }}>Imprimer plusieurs cartes</h2>
            <p style={{ margin: "6px 0 0", color: "#667085", fontSize: "0.95rem" }}>
              Sélectionnez les contacts à inclure, puis générez la planche A4.
            </p>
          </div>
          <button
            style={{ ...btn, background: "#4f46e5", color: "#fff" }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "Génération…" : "Générer la planche A4"}
          </button>
        </div>

        <div style={{ padding: "22px 24px 24px", display: "grid", gap: 18 }}>
          {/* Selection criteria */}
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
                  style={selection === s.key ? selectionBoxActive : selectionBoxBase}
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

            {/* Contextual filter UI */}
            {selection === "crm" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["Antenne", "Statut", "Campagne", "Événement"].map((f) => (
                  <div key={f} style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: "0.88rem", color: "#667085", fontWeight: 600 }}>{f}</label>
                    <select
                      style={{
                        width: "100%",
                        border: "1px solid #dbe2f0",
                        background: "#fff",
                        borderRadius: 12,
                        padding: "11px 14px",
                        fontFamily: "inherit",
                        fontSize: "0.92rem",
                        color: "#1f2937",
                      }}
                    >
                      <option value="">Tous</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {selection === "groupes" && (
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.88rem", color: "#667085", fontWeight: 600 }}>Groupe</label>
                <select
                  style={{
                    width: "100%",
                    border: "1px solid #dbe2f0",
                    background: "#fff",
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontFamily: "inherit",
                    fontSize: "0.92rem",
                    color: "#1f2937",
                  }}
                >
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
                    <input
                      placeholder={`Filtrer par ${f.toLowerCase()}…`}
                      style={{
                        width: "100%",
                        border: "1px solid #dbe2f0",
                        background: "#fff",
                        borderRadius: 12,
                        padding: "11px 14px",
                        fontFamily: "inherit",
                        fontSize: "0.92rem",
                        color: "#1f2937",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.92rem", color: "#1f2937", cursor: "pointer" }}>
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
              <span>Succès — les cartes ont bien été envoyées par email.</span>
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
                padding: "6px 10px",
                borderRadius: 999,
                background: "#f3f4f6",
                color: "#475467",
                fontSize: "0.82rem",
                fontWeight: 600,
                width: "fit-content",
                marginBottom: 12,
              }}
            >
              Aperçu impression A4 — planche multi-cartes avec pointillés et marges
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
                    minHeight: 148,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 420,
                      aspectRatio: "1.586",
                      background: "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #c7d2fe 100%)",
                      borderRadius: 10,
                      transform: "scale(0.62)",
                      transformOrigin: "center",
                      opacity: generating ? 0.5 : 1,
                      transition: "opacity 0.3s",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{ ...btn, background: "#4f46e5", color: "#fff" }}
              onClick={handleGenerate}
              disabled={generating}
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
