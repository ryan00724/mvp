import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function JoinSession() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [session, setSession] = useState<any>(null);
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    
    const fetchSession = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("session_name, location, session_time, max_players")
        .eq("id", sessionId)
        .single();

      if (error) {
        setError("Session not found");
      } else {
        setSession(data);
      }
      setLoading(false);
    };

    fetchSession();
  }, [sessionId]);

  const handleJoinSession = async () => {
    if (!playerName) {
      alert("Please enter your name");
      return;
    }

    const response = await fetch("/api/sessions/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, playerName }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to join session");
    } else {
      alert("You have successfully joined the session!");
      router.push("/dashboard");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading session...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">{session?.session_name}</h1>
      <p className="text-gray-600 mt-2">📍 {session?.location}</p>
      <p className="text-gray-600 mt-2">📅 {new Date(session?.session_time).toLocaleString()}</p>

      <div className="mt-6 w-full max-w-lg bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Join This Session</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full p-2 border rounded"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          onClick={handleJoinSession}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}
