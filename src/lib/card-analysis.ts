import Anthropic from "@anthropic-ai/sdk";

export interface CardField {
  id: string;
  label: string;
  assoconnect_field: string;
  x_pct?: number;
  y_pct?: number;
  w_pct?: number;
  h_pct?: number;
}

export interface CardPalette {
  bg: string;
  bg2?: string;
  text: string;
  accent?: string;
  border?: string;
}

export interface CardAnalysisResult {
  template_name: string;
  organization_name: string;
  card_year: string;
  palette: CardPalette;
  fields: CardField[];
}

export const ASSOCONNECT_FIELDS = [
  { value: "last_name", label: "Nom" },
  { value: "first_name", label: "Prénom" },
  { value: "member_number", label: "N° adhérent" },
  { value: "membership_end_date", label: "Date de fin d'adhésion" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Téléphone" },
  { value: "city", label: "Ville" },
  { value: "organization_name", label: "Nom de l'association" },
  { value: "photo", label: "Photo" },
  { value: "address", label: "Adresse" },
  { value: "zip_code", label: "Code postal" },
  { value: "custom", label: "Champ libre" },
];

export async function analyzeCard(
  imageBase64: string,
  mimeType: string
): Promise<CardAnalysisResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return getMockResult();
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Analyse cette carte d'adhérent avec précision et retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) :

{
  "template_name": "nom-kebab-case-suggere",
  "organization_name": "nom de l'association ou chaine vide",
  "card_year": "annee ou chaine vide",
  "palette": {
    "bg": "#hexcode couleur principale du fond",
    "bg2": "#hexcode couleur secondaire si gradient (ou null)",
    "text": "#hexcode couleur principale du texte",
    "accent": "#hexcode couleur d'accentuation ou null",
    "border": "#hexcode couleur de bordure ou null"
  },
  "fields": [
    {
      "id": "identifiant-kebab-unique",
      "label": "libelle exact visible sur la carte",
      "assoconnect_field": "champ correspondant",
      "x_pct": 5,
      "y_pct": 40,
      "w_pct": 45,
      "h_pct": 10
    }
  ]
}

Pour x_pct, y_pct, w_pct, h_pct : exprime la position et taille de chaque champ en pourcentage de la largeur/hauteur totale de la carte (0-100). Sois précis sur les positions réelles des champs sur la carte.

Pour assoconnect_field : last_name, first_name, member_number, membership_end_date, email, phone, city, organization_name, photo, address, zip_code, custom.

Pour palette : extrait les vraies couleurs hex dominantes de la carte (fond, texte, accents).`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as CardAnalysisResult;
    }
  } catch (err) {
    console.error("Card analysis failed:", err);
  }

  return getMockResult();
}

function getMockResult(): CardAnalysisResult {
  return {
    template_name: "nouveau-template",
    organization_name: "",
    card_year: new Date().getFullYear().toString(),
    palette: { bg: "#312e81", bg2: "#4f46e5", text: "#ffffff", accent: "#c7d2fe" },
    fields: [
      { id: "nom", label: "Nom", assoconnect_field: "last_name", x_pct: 5, y_pct: 38, w_pct: 45, h_pct: 12 },
      { id: "prenom", label: "Prénom", assoconnect_field: "first_name", x_pct: 5, y_pct: 53, w_pct: 45, h_pct: 12 },
      { id: "numero-adherent", label: "N° adhérent", assoconnect_field: "member_number", x_pct: 5, y_pct: 68, w_pct: 55, h_pct: 12 },
      { id: "date-fin", label: "Valable jusqu'au", assoconnect_field: "membership_end_date", x_pct: 5, y_pct: 82, w_pct: 50, h_pct: 10 },
    ],
  };
}
