import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const { clubId } = req.query;
  if (!clubId) return res.status(400).json({ error: "Club ID is required" });

  try {
    console.log("Fetching matches for club:", clubId);

    const { data, error } = await supabase
      .from("matches")
      .select("id, scheduled_at, result, player1_id, player2_id")
      .eq("club_id", clubId)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Matches retrieved:", data);
    return res.status(200).json({ matches: data });
  } catch (error) {
    console.error("Failed to get matches:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
