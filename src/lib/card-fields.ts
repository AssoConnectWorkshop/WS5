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
