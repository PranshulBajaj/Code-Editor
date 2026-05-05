import { useState } from "react";
import { generateRoomId } from "../utils/helpers";

export default function HomePage({ onEnter }) {
  const [username, setUsername] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [tab, setTab] = useState("create");

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

  const canSubmit =
    tab === "create"
      ? username.trim().length > 0
      : username.trim().length > 0 && roomInput.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (tab === "create") {
      const roomId = generateRoomId();
      // Register room on server
      await fetch(`${SOCKET_URL}/create-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      onEnter({ username: username.trim(), roomId });
    } else {
      // Check if room exists
      const res = await fetch(`${SOCKET_URL}/room-exists/${roomInput.trim()}`);
      const data = await res.json();
      if (!data.exists) {
        alert("Room not found. Check the room ID and try again.");
        return;
      }
      onEnter({ username: username.trim(), roomId: roomInput.trim() });
    }
  };

  return (
    <div className="home-screen">
      <div className="home-card">
        <div className="home-brand">
          <span className="home-logo">⌨</span>
          <h1 className="home-title">CodeSync</h1>
        </div>
        <p className="home-subtitle">Real-time collaborative code editor</p>

        <div className="tab-row">
          <button
            className={`tab-btn ${tab === "create" ? "active" : ""}`}
            onClick={() => setTab("create")}
          >
            Create Room
          </button>
          <button
            className={`tab-btn ${tab === "join" ? "active" : ""}`}
            onClick={() => setTab("join")}
          >
            Join Room
          </button>
        </div>

        <div className="home-fields">
          <label className="field-label">Username</label>
          <input
            autoFocus
            className="home-input"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          {tab === "join" && (
            <>
              <label className="field-label">Room ID</label>
              <input
                className="home-input"
                placeholder="e.g. red-wolf-4821"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </>
          )}

          <button
            className="home-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {tab === "create" ? "Create & Enter →" : "Join Room →"}
          </button>
        </div>
      </div>
    </div>
  );
}
