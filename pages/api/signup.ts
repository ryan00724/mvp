import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body;

  try {
    // ✅ Require email confirmation
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ 
      message: "Check your email to confirm your account", 
      user: data.user
    });
  } catch (error) {
    return res.status(500).json({ error: "Signup failed", details: error });
  }
}
