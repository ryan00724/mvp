import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { adminId, clubName } = req.body;

  try {
    // ✅ Check if admin already has a club
    const { data: existingClub } = await supabase
      .from("clubs")
      .select("id")
      .eq("admin_id", adminId)
      .single();

    if (existingClub) {
      return res.status(400).json({ error: "Admin already has a club" });
    }

    // ✅ Create a new club
    const { data, error } = await supabase
      .from("clubs")
      .insert([{ admin_id: adminId, club_name: clubName }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({ message: "Club created successfully", club: data });
  } catch (error) {
    return res.status(500).json({ error: "Club creation failed", details: error });
  }
}
