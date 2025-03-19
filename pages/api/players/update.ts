import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  const { playerId, name, email, rating } = req.body;

  try {
    const { data, error } = await supabase
      .from("players")
      .update({ name, email, rating })
      .eq("id", playerId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Player updated successfully", player: data });
  } catch (error) {
    return res.status(500).json({ error: "Player update failed", details: error });
  }
}
