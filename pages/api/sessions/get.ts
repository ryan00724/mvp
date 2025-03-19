import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const { clubId } = req.query;
  if (!clubId) return res.status(400).json({ error: "Club ID is required" });

  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("id, session_name, location, session_time, max_players")
      .eq("club_id", clubId)
      .order("session_time", { ascending: true });

    if (error) {
      console.error("Error fetching sessions:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ sessions: data });
  } catch (error) {
    console.error("Failed to get sessions:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
