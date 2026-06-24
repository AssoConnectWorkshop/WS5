import { createClient } from "@/lib/supabase/server";
import ImpressionEnLotClient from "./ImpressionEnLotClient";
import type { CardField, CardPalette } from "@/lib/card-analysis";

export const dynamic = "force-dynamic";

export type Template = {
  id: number;
  name: string;
  status: string;
  fields: CardField[];
  organization_name: string | null;
  card_year: string | null;
  image_data: string | null;
  palette: CardPalette | null;
};

export default async function ImpressionEnLotPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_templates")
    .select("id, name, status, fields, organization_name, card_year, image_data, palette")
    .order("created_at", { ascending: false });

  return <ImpressionEnLotClient templates={data ?? []} />;
}
