import { useState } from "react";
import "./App.css";
import HomePage   from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";

export default function App() {
  const [session, setSession] = useState(() => {
    const params   = new URLSearchParams(window.location.search);
    const username = params.get("username") || "";
    const match    = window.location.pathname.match(/\/room\/([^/]+)/);
    const roomId   = match ? match[1] : "";
    return username && roomId ? { username, roomId } : null;
  });

  const handleEnter = ({ username, roomId }) => {
    window.history.pushState({}, "", `/room/${roomId}?username=${encodeURIComponent(username)}`);
    setSession({ username, roomId });
  };

  const handleLeave = () => {
    window.history.pushState({}, "", "/");
    setSession(null);
  };

  return session
    ? <EditorPage username={session.username} roomId={session.roomId} onLeave={handleLeave} />
    : <HomePage onEnter={handleEnter} />;
}
