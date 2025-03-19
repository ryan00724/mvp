import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { clubId, name, email, rating } = req.body;

  if (!clubId || !name || !email) {
    console.error("Missing data:", { clubId, name, email });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Adding player to Supabase:", { clubId, name, email, rating });

    const { data, error } = await supabase
      .from("players")
      .insert([{ club_id: clubId, name, email, rating }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Player added:", data);
    return res.status(201).json({ message: "Player added successfully", player: data });
  } catch (error) {
    console.error("Player creation failed:", error);
    return res.status(500).json({ error: "Player creation failed", details: error });
  }
}
