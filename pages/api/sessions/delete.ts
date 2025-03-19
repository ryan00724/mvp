import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

  try {
    // Check if the session exists before deleting
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) return res.status(404).json({ error: "Session not found" });

    // Delete session
    const { error } = await supabase.from("sessions").delete().eq("id", sessionId);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Failed to delete session:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
