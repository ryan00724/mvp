import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { clubId, sessionName, location, maxPlayers, sessionTime } = req.body;

  if (!clubId || !sessionName || !location || !maxPlayers || !sessionTime) {
    console.error("Missing session data:", { clubId, sessionName, location, maxPlayers, sessionTime });
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sessionId = uuidv4();

    const { data, error } = await supabase
      .from("sessions")
      .insert([
        {
          id: sessionId,
          club_id: clubId,
          session_name: sessionName,
          location: location,
          max_players: maxPlayers,
          session_time: sessionTime,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return res.status(400).json({ error: error.message });
    }

    const sessionLink = `${process.env.NEXT_PUBLIC_SITE_URL}/join/${sessionId}`;

    return res.status(201).json({ message: "Session created", session: data, link: sessionLink });
  } catch (error) {
    console.error("Session creation failed:", error);
    return res.status(500).json({ error: "Failed to create session", details: error });
  }
}
