import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body;

  try {
    // ✅ Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ 
      message: "Login successful", 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed", details: error });
  }
}
