import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { sessionId, playerName } = req.body;

  if (!sessionId || !playerName) {
    return res.status(400).json({ error: "Session ID and player name are required" });
  }

  try {
    // Fetch session details
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, max_players, current_players")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) return res.status(404).json({ error: "Session not found" });

    // Check if session is full
    if (session.current_players >= session.max_players) {
      return res.status(400).json({ error: "Session is full. No more players can join." });
    }

    // Add player to session
    const { data, error } = await supabase
      .from("session_players")
      .insert([{ session_id: sessionId, player_name: playerName }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Update current players count
    await supabase
      .from("sessions")
      .update({ current_players: session.current_players + 1 })
      .eq("id", sessionId);

    return res.status(200).json({ message: "Joined session successfully", player: data });
  } catch (error) {
    console.error("Failed to join session:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
