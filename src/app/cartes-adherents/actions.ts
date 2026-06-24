"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { analyzeCard, type CardField, type CardAnalysisResult } from "@/lib/card-analysis";
import { listContacts, type ContactsPage } from "@/lib/assoconnect";

export async function analyzeCardAction(formData: FormData): Promise<CardAnalysisResult> {
  const imageDataUrl = formData.get("image_base64") as string;
  const mimeType = formData.get("mime_type") as string;

  if (!imageDataUrl || !mimeType) {
    throw new Error("Image requise");
  }

  const base64Data = imageDataUrl.includes(",") ? imageDataUrl.split(",")[1] : imageDataUrl;
  return analyzeCard(base64Data, mimeType);
}

export async function createTemplateAction(
  imageDataUrl: string,
  analysis: CardAnalysisResult
): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("card_templates")
    .insert({
      name: analysis.template_name,
      status: "draft",
      image_data: imageDataUrl,
      fields: analysis.fields,
      organization_name: analysis.organization_name,
      card_year: analysis.card_year,
      palette: analysis.palette,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  redirect(`/cartes-adherents/${data.id}`);
}

export async function updateTemplateAction(
  id: number,
  name: string,
  fields: CardField[]
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("card_templates")
    .update({ name, fields, status: "ready" })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteTemplateAction(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("card_templates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listContactsAction(
  organizationId: string,
  page: number
): Promise<ContactsPage> {
  return listContacts(organizationId, page);
}
