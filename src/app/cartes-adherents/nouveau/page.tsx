"use client";

import { useState, useRef } from "react";
import { analyzeCardAction, createTemplateAction } from "../actions";
import type { CardAnalysisResult, CardPalette, CardField } from "@/lib/card-analysis";

type UploadMode = "source" | "recto" | "verso";
type Step = "idle" | "analyzing" | "redacting" | "saving";

const MODES: { key: UploadMode; label: string }[] = [
  { key: "source", label: "Fichier source" },
  { key: "recto", label: "Photo recto" },
  { key: "verso", label: "Photo verso" },
];

const STEP_LABELS: Record<Step, { title: string; subtitle: string; progress: number; badge: string }> = {
  idle: { title: "", subtitle: "", progress: 0, badge: "" },
  analyzing: {
    title: "Analyse IA en cours",
    subtitle: "Détection des champs, palette et disposition de la carte.",
    progress: 33,
    badge: "Étape 1/3",
  },
  redacting: {
    title: "Suppression des données personnelles",
    subtitle: "Les valeurs existantes sont effacées de l'image pour créer un template vierge.",
    progress: 66,
    badge: "Étape 2/3",
  },
  saving: {
    title: "Enregistrement du template",
    subtitle: "Sauvegarde en base de données et génération de l'aperçu.",
    progress: 90,
    badge: "Étape 3/3",
  },
};

async function redactPersonalData(
  imageDataUrl: string,
  fields: CardField[],
  palette: CardPalette
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      for (const field of fields) {
        if (field.x_pct == null || field.y_pct == null) continue;
        const x = (field.x_pct / 100) * canvas.width;
        const y = (field.y_pct / 100) * canvas.height;
        const w = ((field.w_pct ?? 38) / 100) * canvas.width;
        const h = ((field.h_pct ?? 11) / 100) * canvas.height;

        ctx.fillStyle = palette.bg;
        ctx.fillRect(x, y, w, h);

        // Slight blur blend: paint bg2 semi-transparent if available
        if (palette.bg2) {
          ctx.fillStyle = palette.bg2 + "66";
          ctx.fillRect(x, y, w, h);
        }
      }

      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imageDataUrl;
  });
}

export default function NouveauTemplatePage() {
  const [mode, setMode] = useState<UploadMode>("source");
  const [previews, setPreviews] = useState<Partial<Record<UploadMode, string>>>({});
  const [mimeTypes, setMimeTypes] = useState<Partial<Record<UploadMode, string>>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Format non supporté. Utilisez PNG, JPG ou WEBP.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviews((prev) => ({ ...prev, [mode]: dataUrl }));
      setMimeTypes((prev) => ({ ...prev, [mode]: file.type }));
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function canAnalyze() {
    if (mode === "source") return !!previews.source;
    return !!previews.recto && !!previews.verso;
  }

  async function handleAnalyze() {
    const imageDataUrl = previews.source ?? previews.recto;
    const mime = mimeTypes.source ?? mimeTypes.recto ?? "image/jpeg";
    if (!imageDataUrl) return;

    setError("");

    try {
      setStep("analyzing");
      const formData = new FormData();
      formData.append("image_base64", imageDataUrl);
      formData.append("mime_type", mime);
      const analysis: CardAnalysisResult = await analyzeCardAction(formData);

      setStep("redacting");
      const cleanedImage = await redactPersonalData(imageDataUrl, analysis.fields, analysis.palette);

      setStep("saving");
      await createTemplateAction(cleanedImage, analysis);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'analyse";
      if (!msg.includes("NEXT_REDIRECT")) {
        setError(msg);
        setStep("idle");
      }
    }
  }

  const isPending = step !== "idle";

  const btnBase: React.CSSProperties = {
    border: 0,
    borderRadius: 12,
    padding: "12px 18px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.92rem",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  };

  return (
    <div style={{ padding: 28, maxWidth: 640, fontFamily: "Inter, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.05em", color: "#1f2937" }}>
          {"Importer une carte d'adhérent"}
        </h1>
        <p style={{ margin: "6px 0 0", color: "#667085" }}>
          {"Chargez le fichier source ou des photos recto / verso pour lancer l'analyse automatique."}
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Segmented mode selector */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "inline-flex",
              background: "#fff",
              border: "1px solid #dbe2f0",
              borderRadius: 999,
              padding: 4,
              gap: 4,
            }}
          >
            {MODES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={{
                  ...btnBase,
                  padding: "10px 14px",
                  borderRadius: 999,
                  fontSize: "0.92rem",
                  background: mode === key ? "#4f46e5" : "transparent",
                  color: mode === key ? "#fff" : "#667085",
                  boxShadow: "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? "#4f46e5" : "#bcc7e6"}`,
            borderRadius: 18,
            background: isDragging
              ? "#eef2ff"
              : "linear-gradient(180deg, #fafbff, #f4f7ff)",
            padding: 28,
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {previews[mode] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previews[mode]}
              alt="Aperçu"
              style={{ maxHeight: 200, margin: "0 auto", display: "block", borderRadius: 12, objectFit: "contain" }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "#eef2ff",
                  color: "#4f46e5",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                }}
              >
                ↑
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#1f2937" }}>
                  Glissez votre fichier ici
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#667085" }}>
                  ou cliquez pour sélectionner
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Hints */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Formats acceptés : PNG, JPG, WEBP.",
            mode !== "source"
              ? "Import photo : recto + verso obligatoires avant de lancer l'analyse."
              : "Pour un fichier source, un seul fichier suffit.",
            "Les données personnelles visibles sur la carte seront automatiquement effacées.",
          ].map((hint, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#fff",
                border: "1px solid #dbe2f0",
                fontSize: "0.92rem",
                color: "#667085",
              }}
            >
              {hint}
            </div>
          ))}
        </div>

        {/* Recto / verso status chips */}
        {mode !== "source" && (
          <div style={{ display: "flex", gap: 10 }}>
            {(["recto", "verso"] as const).map((side) => (
              <button
                key={side}
                onClick={() => { setMode(side); setTimeout(() => fileInputRef.current?.click(), 50); }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid ${previews[side] ? "#86efac" : "#dbe2f0"}`,
                  background: previews[side] ? "#f0fdf4" : "#f9fafb",
                  color: previews[side] ? "#166534" : "#9ca3af",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  textAlign: "center",
                  fontFamily: "inherit",
                }}
              >
                {previews[side] ? `✓ Photo ${side}` : `+ Photo ${side}`}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "0.92rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ ...btnBase, background: "#fff", color: "#1f2937", boxShadow: "inset 0 0 0 1px #dbe2f0" }}
          >
            Choisir un fichier
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze() || isPending}
            style={{
              ...btnBase,
              background: !canAnalyze() || isPending ? "#a5b4fc" : "#4f46e5",
              color: "#fff",
              cursor: !canAnalyze() || isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                En cours…
              </span>
            ) : (
              "Lancer l'analyse"
            )}
          </button>
        </div>
      </div>

      {/* Analysis modal */}
      {isPending && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17,24,39,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 22,
              boxShadow: "0 20px 50px rgba(15,23,42,0.2)",
              padding: 24,
              width: "100%",
              maxWidth: 380,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#1f2937" }}>{STEP_LABELS[step].title}</strong>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  color: "#475467",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {STEP_LABELS[step].badge}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "12px 0 4px", textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "6px solid #e5e7eb",
                  borderTopColor: step === "redacting" ? "#10b981" : "#4f46e5",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#667085" }}>
                {STEP_LABELS[step].subtitle}
              </p>
            </div>
            <div style={{ height: 10, background: "#eef2ff", borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${STEP_LABELS[step].progress}%`,
                  height: "100%",
                  background: step === "redacting"
                    ? "linear-gradient(90deg, #10b981, #059669)"
                    : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  borderRadius: 999,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
