import Anthropic from "@anthropic-ai/sdk";

export interface CardField {
  id: string;
  label: string;
  assoconnect_field: string;
}

export interface CardAnalysisResult {
  template_name: string;
  organization_name: string;
  card_year: string;
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
      max_tokens: 1024,
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
              text: `Analyse cette carte d'adhérent et retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) avec ces champs :
{
  "template_name": "nom-kebab-case-suggere",
  "organization_name": "nom de l'association ou chaine vide",
  "card_year": "annee ou chaine vide",
  "fields": [
    {
      "id": "identifiant-kebab-unique",
      "label": "libelle exact visible sur la carte",
      "assoconnect_field": "champ correspondant"
    }
  ]
}

Pour assoconnect_field, utilise uniquement : last_name, first_name, member_number, membership_end_date, email, phone, city, organization_name, photo, address, zip_code, custom.`,
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
    fields: [
      { id: "nom", label: "Nom", assoconnect_field: "last_name" },
      { id: "prenom", label: "Prénom", assoconnect_field: "first_name" },
      { id: "numero-adherent", label: "N° adhérent", assoconnect_field: "member_number" },
      { id: "date-fin", label: "Valable jusqu'au", assoconnect_field: "membership_end_date" },
    ],
  };
}
