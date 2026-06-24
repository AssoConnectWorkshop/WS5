"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateTemplateAction, deleteTemplateAction } from "../actions";
import { ASSOCONNECT_FIELDS, type CardField, type CardPalette } from "@/lib/card-analysis";

type Template = {
  id: number;
  name: string;
  status: string;
  image_data: string | null;
  fields: CardField[];
  organization_name: string | null;
  card_year: string | null;
  palette: CardPalette | null;
};

const DEFAULT_W = 38;
const DEFAULT_H = 11;

function ensurePositions(fields: CardField[]): CardField[] {
  return fields.map((f, i) => ({
    ...f,
    x_pct: f.x_pct ?? 5,
    y_pct: f.y_pct ?? 30 + i * 14,
    w_pct: f.w_pct ?? DEFAULT_W,
    h_pct: f.h_pct ?? DEFAULT_H,
  }));
}

type DragState = {
  fieldId: string;
  startMouseX: number;
  startMouseY: number;
  startFieldX: number;
  startFieldY: number;
};

function InteractiveCardPreview({
  imageData,
  palette,
  fields,
  onFieldsChange,
  dragEnabled,
  activeFieldId,
  onFieldFocus,
}: {
  imageData: string | null;
  palette: CardPalette | null;
  fields: CardField[];
  onFieldsChange: (fields: CardField[]) => void;
  dragEnabled: boolean;
  activeFieldId?: string | null;
  onFieldFocus?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  const p = palette ?? { bg: "#312e81", bg2: "#4f46e5", text: "#ffffff", accent: "#c7d2fe" };
  const gradientBg = p.bg2
    ? `linear-gradient(135deg, ${p.bg} 0%, ${p.bg2} 60%)`
    : p.bg;
  const hasImage = !!imageData;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const drag = dragRef.current;
    if (!drag || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPct = ((e.clientX - drag.startMouseX) / rect.width) * 100;
    const deltaYPct = ((e.clientY - drag.startMouseY) / rect.height) * 100;

    onFieldsChange(
      fieldsRef.current.map((f) => {
        if (f.id !== drag.fieldId) return f;
        const w = f.w_pct ?? DEFAULT_W;
        const h = f.h_pct ?? DEFAULT_H;
        return {
          ...f,
          x_pct: Math.max(0, Math.min(100 - w, drag.startFieldX + deltaXPct)),
          y_pct: Math.max(0, Math.min(100 - h, drag.startFieldY + deltaYPct)),
        };
      })
    );
  }, [onFieldsChange]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  function startDrag(e: React.MouseEvent, field: CardField) {
    if (!dragEnabled) return;
    e.preventDefault();
    onFieldFocus?.(field.id);
    dragRef.current = {
      fieldId: field.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startFieldX: field.x_pct ?? 5,
      startFieldY: field.y_pct ?? 30,
    };
  }

  const hasPositions = fields.some((f) => f.x_pct !== undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          aspectRatio: "1.586",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          background: hasImage ? "#000" : gradientBg,
          cursor: dragEnabled ? "default" : "default",
          userSelect: "none",
        }}
      >
        {/* Real card image */}
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageData!}
            alt="Carte"
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
          />
        )}

        {/* Fallback décor */}
        {!hasImage && (
          <div style={{ position: "absolute", bottom: -60, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        )}

        {/* Drag-mode tint overlay */}
        {dragEnabled && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(79,70,229,0.08)", pointerEvents: "none", borderRadius: 18 }} />
        )}

        {/* Field overlays */}
        {hasPositions
          ? fields.map((field) =>
              field.x_pct !== undefined ? (
                <div
                  key={field.id}
                  onMouseDown={(e) => startDrag(e, field)}
                  style={{
                    position: "absolute",
                    left: `${field.x_pct}%`,
                    top: `${field.y_pct}%`,
                    width: `${field.w_pct ?? DEFAULT_W}%`,
                    height: `${field.h_pct ?? DEFAULT_H}%`,
                    border: `2px ${dragEnabled ? "solid" : "dashed"} ${
                      activeFieldId === field.id
                        ? "rgba(129,140,248,1)"
                        : dragEnabled
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.85)"
                    }`,
                    borderRadius: 6,
                    background:
                      activeFieldId === field.id
                        ? "rgba(79,70,229,0.45)"
                        : dragEnabled
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(3px)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 8px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#fff",
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    letterSpacing: "0.02em",
                    boxSizing: "border-box",
                    cursor: dragEnabled ? "grab" : "default",
                    transition: dragEnabled ? "none" : "border-color 0.15s, background 0.15s",
                    boxShadow:
                      activeFieldId === field.id
                        ? "0 0 0 3px rgba(129,140,248,0.4)"
                        : dragEnabled
                        ? "0 2px 8px rgba(0,0,0,0.3)"
                        : "none",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {field.label}
                  </span>
                  {dragEnabled && (
                    <span style={{ marginLeft: "auto", opacity: 0.7, flexShrink: 0, fontSize: "0.65rem" }}>⠿</span>
                  )}
                </div>
              ) : null
            )
          : !hasImage && (
              <div style={{ position: "absolute", inset: 0, padding: 20, display: "grid", gridTemplateRows: "auto 1fr", gap: 10, color: p.text }}>
                <p style={{ margin: 0, fontWeight: 800 }}>{fields[0]?.label ?? "Template vierge"}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, justifyContent: "center" }}>
                  {fields.slice(0, 4).map((f) => (
                    <div key={f.id} style={{ height: 30, border: `1.5px dashed ${p.accent ?? "rgba(255,255,255,0.5)"}`, borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", padding: "0 10px", fontSize: "0.82rem", color: p.text }}>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

        {/* Drag mode hint */}
        {dragEnabled && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(79,70,229,0.9)",
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 999,
              backdropFilter: "blur(4px)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Glissez les champs pour les repositionner
          </div>
        )}
      </div>

      {/* Palette chips */}
      {palette && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginRight: 2 }}>Charte :</span>
          {[palette.bg, palette.bg2, palette.text, palette.accent, palette.border]
            .filter(Boolean)
            .filter((c, i, a) => a.indexOf(c) === i)
            .map((color) => (
              <div key={color} title={color!} style={{ width: 20, height: 20, borderRadius: 6, background: color!, border: "1.5px solid rgba(0,0,0,0.08)" }} />
            ))}
        </div>
      )}
    </div>
  );
}

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
  const [mappingEditMode, setMappingEditMode] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleDragMode() {
    if (!dragMode) {
      // Ensure all fields have positions before enabling drag
      setFields((prev) => ensurePositions(prev));
    }
    setDragMode((v) => !v);
    setActiveFieldId(null);
  }

  function updateField(index: number, key: keyof CardField, value: string) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
  }

  function addField() {
    const newField: CardField = {
      id: `champ-${Date.now()}`,
      label: "Nouveau champ",
      assoconnect_field: "custom",
      x_pct: 5,
      y_pct: Math.min(85, 10 + fields.length * 14),
      w_pct: DEFAULT_W,
      h_pct: DEFAULT_H,
    };
    setFields((prev) => [...prev, newField]);
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
          <Link href="/cartes-adherents" style={{ fontSize: "0.88rem", color: "#667085", textDecoration: "none", display: "block", marginBottom: 6 }}>
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
        <span style={{ padding: "6px 12px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, background: template.status === "ready" ? "#e8f8ee" : "#fff7e6", color: template.status === "ready" ? "#166534" : "#92400e", marginTop: 4 }}>
          {template.status === "ready" ? "Prêt" : "Brouillon"}
        </span>
      </div>

      {saved && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", background: "#ecfdf3", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 16, fontWeight: 600 }}>
          ✓ Template enregistré avec succès.
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, alignItems: "start" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Card preview */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 20px 50px rgba(15,23,42,0.08)" }}>
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1f2937" }}>
                  Aperçu de la carte
                </h2>
                <p style={{ margin: "4px 0 0", color: "#667085", fontSize: "0.92rem" }}>
                  {fields.length} champ{fields.length !== 1 ? "s" : ""} · {dragMode ? "mode positionnement actif" : "vue template vierge"}
                </p>
              </div>
              <button
                onClick={toggleDragMode}
                style={{
                  ...btnBase,
                  padding: "8px 14px",
                  fontSize: "0.85rem",
                  background: dragMode ? "#4f46e5" : "#eef2ff",
                  color: dragMode ? "#fff" : "#4f46e5",
                  boxShadow: "none",
                  marginTop: 2,
                }}
              >
                {dragMode ? "✓ Terminer" : "⠿ Ajuster les positions"}
              </button>
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <InteractiveCardPreview
                imageData={template.image_data}
                palette={template.palette}
                fields={fields}
                onFieldsChange={setFields}
                dragEnabled={dragMode}
                activeFieldId={activeFieldId}
                onFieldFocus={setActiveFieldId}
              />
            </div>
          </div>

          {/* Name + actions */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 20px 50px rgba(15,23,42,0.08)", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "#667085" }}>Nom du template</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ border: "1px solid #dbe2f0", borderRadius: 12, padding: "12px 14px", fontFamily: "inherit", fontSize: "0.95rem", color: "#1f2937", outline: "none", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button onClick={handleSave} disabled={isPending} style={{ ...btnBase, background: isPending ? "#a5b4fc" : "#4f46e5", color: "#fff", cursor: isPending ? "not-allowed" : "pointer" }}>
                {isPending ? "Enregistrement…" : "Enregistrer le template"}
              </button>
              <button
                onClick={() => { setMappingEditMode((v) => !v); setDragMode(false); }}
                style={{ ...btnBase, background: mappingEditMode ? "#eef2ff" : "#fff", color: mappingEditMode ? "#4f46e5" : "#1f2937", boxShadow: "inset 0 0 0 1px #dbe2f0" }}
              >
                {mappingEditMode ? "Fermer l'éditeur" : "Modifier le mapping"}
              </button>
              <button onClick={handleDelete} disabled={isPending} style={{ ...btnBase, background: "#fff", color: "#dc2626", boxShadow: "inset 0 0 0 1px #fecaca" }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Right column: field list */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 20px 50px rgba(15,23,42,0.08)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f4fb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, color: "#1f2937" }}>
                {mappingEditMode ? "Éditer le mapping" : "Champs identifiés"}
              </h3>
              <p style={{ margin: "3px 0 0", fontSize: "0.88rem", color: "#667085" }}>
                {fields.length} champ{fields.length !== 1 ? "s" : ""} détecté{fields.length !== 1 ? "s" : ""}
              </p>
            </div>
            {mappingEditMode && (
              <button onClick={addField} style={{ ...btnBase, padding: "8px 14px", background: "#eef2ff", color: "#4f46e5", boxShadow: "none" }}>
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
                onClick={() => dragMode && setActiveFieldId(field.id)}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  border: `1px solid ${activeFieldId === field.id && dragMode ? "#818cf8" : "#dbe2f0"}`,
                  background: activeFieldId === field.id && dragMode ? "#eef2ff" : "linear-gradient(180deg, #fff, #fbfcff)",
                  display: "flex",
                  flexDirection: "column",
                  gap: mappingEditMode ? 10 : 0,
                  cursor: dragMode ? "pointer" : "default",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                {mappingEditMode ? (
                  <>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Libellé</label>
                        <input
                          value={field.label}
                          onChange={(e) => updateField(index, "label", e.target.value)}
                          style={{ border: "1px solid #dbe2f0", borderRadius: 10, padding: "9px 12px", fontFamily: "inherit", fontSize: "0.9rem", color: "#1f2937", outline: "none" }}
                        />
                      </div>
                      <button onClick={() => removeField(index)} style={{ marginTop: 22, width: 30, height: 30, borderRadius: "50%", background: "#f3f4f6", border: 0, cursor: "pointer", color: "#6b7280", display: "grid", placeItems: "center", fontWeight: 700, fontFamily: "inherit" }}>
                        ×
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Champ AssoConnect</label>
                      <select
                        value={field.assoconnect_field}
                        onChange={(e) => updateField(index, "assoconnect_field", e.target.value)}
                        style={{ border: "1px solid #dbe2f0", borderRadius: 10, padding: "9px 12px", fontFamily: "inherit", fontSize: "0.9rem", color: "#1f2937", background: "#fff", outline: "none" }}
                      >
                        {ASSOCONNECT_FIELDS.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#1f2937" }}>{field.label}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#667085" }}>
                        → {fieldLabel(field.assoconnect_field)}
                        {field.x_pct !== undefined && (
                          <span style={{ marginLeft: 6, color: "#a5b4fc", fontSize: "0.75rem" }}>
                            ({Math.round(field.x_pct)}%, {Math.round(field.y_pct ?? 0)}%)
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: field.x_pct !== undefined ? "#818cf8" : "#d1d5db" }} />
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
