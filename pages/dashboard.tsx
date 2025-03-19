import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [club, setClub] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSession, setNewSession] = useState({ sessionName: "", location: "", maxPlayers: 4, sessionTime: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        fetchClub(data.user.id);
      }
    };

    const fetchClub = async (adminId: string) => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, club_name")
        .eq("admin_id", adminId)
        .single();

      if (error) console.error("Error fetching club:", error);
      else {
        setClub(data);
        fetchSessions(data.id);
      }
      setLoading(false);
    };

    const fetchSessions = async (clubId: string) => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("id, session_name, location, session_time, max_players, current_players, session_players (player_name)")
          .eq("club_id", clubId)
          .order("session_time", { ascending: true });

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchUser();
  }, [router]);

  const handleCreateSession = async () => {
    if (!newSession.sessionName || !newSession.location || !newSession.sessionTime) {
      alert("Please enter all session details.");
      return;
    }

    const response = await fetch("/api/sessions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId: club.id, ...newSession }),
    });

    const data = await response.json();
    if (!response.ok) return alert(data.error || "Failed to create session");

    setSessions([...sessions, data.session]); // Update UI
    alert(`Session created! Share this link: ${data.link}`);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    const response = await fetch("/api/sessions/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();
    if (!response.ok) return alert(data.error || "Failed to delete session");

    setSessions(sessions.filter((s) => s.id !== sessionId)); // Remove from UI
  };

  const handleMatchmaking = (players: any[], sessionName: string) => {
    if (players.length < 2) {
      alert("Not enough players to create matches.");
      return;
    }

    // Shuffle players randomly
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const matches = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        matches.push(`${shuffledPlayers[i].player_name} vs ${shuffledPlayers[i + 1].player_name}`);
      }
    }

    alert(`Matchmaking for ${sessionName}:\n\n${matches.join("\n")}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>

      {club ? (
        <>
          <p className="text-gray-600 mt-2">Managing: {club.club_name}</p>

          {/* Create Session */}
          <div className="mt-6 w-full max-w-lg bg-white p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Create Session</h2>
            <input 
              type="text" 
              placeholder="Session Name" 
              className="w-full p-2 border rounded"
              value={newSession.sessionName}
              onChange={(e) => setNewSession({ ...newSession, sessionName: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Location" 
              className="w-full p-2 border rounded mt-2"
              value={newSession.location}
              onChange={(e) => setNewSession({ ...newSession, location: e.target.value })} 
            />
            <input 
              type="datetime-local" 
              className="w-full p-2 border rounded mt-2"
              value={newSession.sessionTime}
              onChange={(e) => setNewSession({ ...newSession, sessionTime: e.target.value })} 
            />
            <select 
              className="w-full p-2 border rounded mt-2"
              value={newSession.maxPlayers}
              onChange={(e) => setNewSession({ ...newSession, maxPlayers: parseInt(e.target.value) })}
            >
              <option value="2">2 Players</option>
              <option value="4">4 Players</option>
              <option value="6">6 Players</option>
              <option value="8">8 Players</option>
              <option value="10">10 Players</option>
            </select>
            <button 
              onClick={handleCreateSession} 
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
            >
              Create Session
            </button>
          </div>

          {/* Active Sessions */}
          <div className="mt-6 w-full max-w-lg bg-white p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
            {sessions.length > 0 ? (
              <ul>
                {sessions.map((session) => {
                  const currentPlayers = session.current_players || 0;
                  const availableSpots = session.max_players - currentPlayers;
                  const players = session.session_players || [];

                  return (
                    <li key={session.id} className="border-b py-2 flex flex-col justify-between">
                      <div>
                        <span className="font-semibold">{session.session_name}</span> <br />
                        <span>📍 {session.location}</span> <br />
                        <span>📅 {new Date(session.session_time).toLocaleString()}</span> <br />
                        <span>👥 {currentPlayers}/{session.max_players} Players</span>

                        {players.length > 0 && (
                          <ul className="text-gray-700 text-sm mt-2">
                            {players.map((player: { player_name: string }) => (
                              <li key={player.player_name}>🔹 {player.player_name}</li>
                            ))}
                          </ul>
                        )}

                        <button onClick={() => handleDeleteSession(session.id)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">
                          Delete
                        </button>

                        {players.length >= 2 && (
                          <button onClick={() => handleMatchmaking(players, session.session_name)} className="bg-green-500 text-white px-3 py-1 rounded mt-2">
                            Generate Matches
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : <p>No sessions created yet.</p>}
          </div>
        </>
      ) : <p>No club linked yet.</p>}
    </div>
  );
}
