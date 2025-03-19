import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

  const { playerId } = req.body;

  try {
    const { error } = await supabase.from("players").delete().eq("id", playerId);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Player removed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Player removal failed", details: error });
  }
}
