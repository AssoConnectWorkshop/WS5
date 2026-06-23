"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateTemplateAction, deleteTemplateAction } from "../actions";
import { ASSOCONNECT_FIELDS, type CardField } from "@/lib/card-analysis";

type Template = {
  id: number;
  name: string;
  status: string;
  image_data: string | null;
  fields: CardField[];
  organization_name: string | null;
  card_year: string | null;
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

export default function TemplateDetail({ template }: { template: Template }) {
  const [name, setName] = useState(template.name);
  const [fields, setFields] = useState<CardField[]>(template.fields ?? []);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function updateField(index: number, key: keyof CardField, value: string) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
  }

  function addField() {
    setFields((prev) => [
      ...prev,
      { id: `champ-${Date.now()}`, label: "Nouveau champ", assoconnect_field: "custom" },
    ]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    startTransition(async () => {
      await updateTemplateAction(template.id, name, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Supprimer ce template définitivement ?")) return;
    startTransition(async () => {
      await deleteTemplateAction(template.id);
      router.push("/cartes-adherents");
    });
  }

  const fieldLabel = (assoconnect_field: string) =>
    ASSOCONNECT_FIELDS.find((f) => f.value === assoconnect_field)?.label ?? assoconnect_field;

  return (
    <div style={{ padding: 28, fontFamily: "Inter, -apple-system, sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <Link
            href="/cartes-adherents"
            style={{ fontSize: "0.88rem", color: "#667085", textDecoration: "none", display: "block", marginBottom: 6 }}
          >
            {"← Carte d'adhérents"}
          </Link>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#1f2937" }}>
            {name}
          </h1>
          {template.organization_name && (
            <p style={{ margin: "4px 0 0", color: "#667085" }}>
              {template.organization_name}{template.card_year ? ` · ${template.card_year}` : ""}
            </p>
          )}
        </div>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: "0.82rem",
            fontWeight: 600,
            background: template.status === "ready" ? "#e8f8ee" : "#fff7e6",
            color: template.status === "ready" ? "#166534" : "#92400e",
            marginTop: 4,
          }}
        >
          {template.status === "ready" ? "Prêt" : "Brouillon"}
        </span>
      </div>

      {saved && (
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
          ✓ Template enregistré avec succès.
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, alignItems: "start" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Card preview */}
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid rgba(15,23,42,0.06)",
              boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
            }}
          >
            <div style={{ padding: "20px 24px 0" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1f2937" }}>
                Aperçu de la carte
              </h2>
              <p style={{ margin: "4px 0 0", color: "#667085", fontSize: "0.92rem" }}>
                Version vierge · {fields.length} champ{fields.length !== 1 ? "s" : ""} identifié{fields.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div style={{ padding: "18px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Stylised card mockup */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1.586",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #c7d2fe 100%)",
                  padding: 20,
                  color: "#fff",
                  position: "relative",
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                  gap: 10,
                  overflow: "hidden",
                  boxShadow: "0 18px 30px rgba(79,70,229,0.18)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: -60,
                    right: -40,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: "1.05rem" }}>
                      {template.organization_name || "Association"}
                    </p>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: "0.88rem" }}>
                      {"Carte d'adhérent"} {template.card_year ?? ""}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.15)",
                      fontSize: "0.8rem",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    Template vierge
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", position: "relative", zIndex: 1 }}>
                  {fields.slice(0, 4).map((field) => (
                    <div
                      key={field.id}
                      style={{
                        height: 32,
                        border: "1.5px dashed rgba(255,255,255,0.5)",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.09)",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 12px",
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {field.label}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", opacity: 0.8, position: "relative", zIndex: 1 }}>
                  <span>{"Valable jusqu'au : ____"}</span>
                  <span>www.asso.fr</span>
                </div>
              </div>

              {/* Original image */}
              {template.image_data && (
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: "0.82rem", color: "#9ca3af" }}>Image originale importée</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={template.image_data}
                    alt="Carte originale"
                    style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 12, border: "1px solid #e5e7eb" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name + actions */}
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid rgba(15,23,42,0.06)",
              boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
              padding: "20px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "#667085" }}>
                Nom du template
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  border: "1px solid #dbe2f0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                  color: "#1f2937",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={isPending}
                style={{
                  ...btnBase,
                  background: isPending ? "#a5b4fc" : "#4f46e5",
                  color: "#fff",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                {isPending ? "Enregistrement…" : "Enregistrer le template"}
              </button>
              <button
                onClick={() => setEditMode((v) => !v)}
                style={{ ...btnBase, background: editMode ? "#eef2ff" : "#fff", color: editMode ? "#4f46e5" : "#1f2937", boxShadow: "inset 0 0 0 1px #dbe2f0" }}
              >
                {editMode ? "Fermer l'éditeur" : "Modifier le mapping"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                style={{ ...btnBase, background: "#fff", color: "#dc2626", boxShadow: "inset 0 0 0 1px #fecaca" }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Right column: field list / editor */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f1f4fb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, color: "#1f2937" }}>
                {editMode ? "Éditer le mapping" : "Champs identifiés"}
              </h3>
              <p style={{ margin: "3px 0 0", fontSize: "0.88rem", color: "#667085" }}>
                {fields.length} champ{fields.length !== 1 ? "s" : ""} détecté{fields.length !== 1 ? "s" : ""}
              </p>
            </div>
            {editMode && (
              <button
                onClick={addField}
                style={{
                  ...btnBase,
                  padding: "8px 14px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  boxShadow: "none",
                }}
              >
                + Ajouter
              </button>
            )}
          </div>

          <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {fields.length === 0 && (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.9rem", padding: "16px 0" }}>
                {"Aucun champ. Utilisez l'éditeur pour en ajouter."}
              </p>
            )}
            {fields.map((field, index) => (
              <div
                key={field.id}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  border: "1px solid #dbe2f0",
                  background: "linear-gradient(180deg, #fff, #fbfcff)",
                  display: "flex",
                  flexDirection: "column",
                  gap: editMode ? 10 : 0,
                }}
              >
                {editMode ? (
                  <>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Libellé
                        </label>
                        <input
                          value={field.label}
                          onChange={(e) => updateField(index, "label", e.target.value)}
                          style={{
                            border: "1px solid #dbe2f0",
                            borderRadius: 10,
                            padding: "9px 12px",
                            fontFamily: "inherit",
                            fontSize: "0.9rem",
                            color: "#1f2937",
                            outline: "none",
                          }}
                        />
                      </div>
                      <button
                        onClick={() => removeField(index)}
                        style={{
                          marginTop: 22,
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "#f3f4f6",
                          border: 0,
                          cursor: "pointer",
                          color: "#6b7280",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          fontFamily: "inherit",
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Champ AssoConnect
                      </label>
                      <select
                        value={field.assoconnect_field}
                        onChange={(e) => updateField(index, "assoconnect_field", e.target.value)}
                        style={{
                          border: "1px solid #dbe2f0",
                          borderRadius: 10,
                          padding: "9px 12px",
                          fontFamily: "inherit",
                          fontSize: "0.9rem",
                          color: "#1f2937",
                          background: "#fff",
                          outline: "none",
                        }}
                      >
                        {ASSOCONNECT_FIELDS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#1f2937" }}>
                        {field.label}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#667085" }}>
                        → {fieldLabel(field.assoconnect_field)}
                      </p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#818cf8" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
