import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { clubId, player1Id, player2Id, scheduledAt } = req.body;

  if (!clubId || !player1Id || !player2Id || !scheduledAt) {
    console.error("Missing match details:", { clubId, player1Id, player2Id, scheduledAt });
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("Creating match:", { clubId, player1Id, player2Id, scheduledAt });

    const { data, error } = await supabase
      .from("matches")
      .insert([
        {
          club_id: clubId,
          player1_id: player1Id,
          player2_id: player2Id,
          scheduled_at: scheduledAt,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating match:", error);
      return res.status(400).json({ error: error.message, details: error });
    }

    console.log("Match created:", data);
    return res.status(201).json({ message: "Match created successfully", match: data });
  } catch (error) {
    console.error("Match creation failed:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
