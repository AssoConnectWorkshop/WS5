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

export type PrintContact = {
  id: string;
  firstname: string;
  lastname: string;
  email: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  profilPictureUrl: string;
  city: string | null;
  postal: string | null;
  street1: string | null;
  membershipEndsAt: string | null;
  membershipTransactionId: number | null;
};

export async function fetchAllContactsAction(): Promise<PrintContact[]> {
  const orgId = process.env.ASSOCONNECT_ORGANIZATION_ULID;
  if (!orgId) return [];

  const all: PrintContact[] = [];
  let page = 1;

  while (true) {
    const result = await listContacts(orgId, page);
    const members = result["hydra:member"];

    for (const c of members) {
      const membership = c.relations.find((r) => r.type === "MEMBERSHIP");
      all.push({
        id: c["@id"].split("/").pop() ?? String(page),
        firstname: c.firstname,
        lastname: c.lastname,
        email: c.email,
        mobilePhone: c.mobilePhone,
        landlinePhone: c.landlinePhone,
        profilPictureUrl: c.profilPictureUrl,
        city: c.postalAddress?.city ?? null,
        postal: c.postalAddress?.postal ?? null,
        street1: c.postalAddress?.street1 ?? null,
        membershipEndsAt: membership?.endsAt ?? null,
        membershipTransactionId: membership?.transactionId ?? null,
      });
    }

    if (all.length >= result["hydra:totalItems"] || members.length === 0) break;
    page++;
  }

  return all;
}
