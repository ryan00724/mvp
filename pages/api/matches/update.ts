import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  const { matchId, result } = req.body;

  if (!matchId || !result) return res.status(400).json({ error: "Missing required fields" });

  try {
    const { data, error } = await supabase
      .from("matches")
      .update({ result })
      .eq("id", matchId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Match updated successfully", match: data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update match", details: error });
  }
}
