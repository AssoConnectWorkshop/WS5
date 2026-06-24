import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TemplateDetail from "./TemplateDetail";
import type { CardField, CardPalette } from "@/lib/card-analysis";

export const dynamic = "force-dynamic";

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

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_templates")
    .select("id, name, status, image_data, fields, organization_name, card_year, palette")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <TemplateDetail template={data as Template} />;
}
