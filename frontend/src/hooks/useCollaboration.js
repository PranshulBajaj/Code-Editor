import { useEffect, useRef, useMemo, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";
import { getAvatarColor } from "../utils/helpers";
import { SOCKET_URL } from "../constants";

export function useCollaboration({
  roomId,
  username,
  editorRef,
  isEditorReady,
}) {
  const ydoc = useMemo(() => new Y.Doc(), [roomId]);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const [users, setUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [notifications, setNotifications] = useState([]);

  // Snapshot of previous awareness states keyed by clientId
  const prevStatesRef = useRef(new Map());

  const pushNotif = (message, type = "join") => {
    const id = Date.now() + Math.random();
    setNotifications((n) => [...n, { id, message, type }]);
    setTimeout(() => {
      setNotifications((n) => n.filter((x) => x.id !== id));
    }, 3500);
  };

  useEffect(() => {
    if (!isEditorReady || !username || !roomId) return;

    const provider = new SocketIOProvider(SOCKET_URL, roomId, ydoc, {
      autoConnect: true,
    });

    provider.awareness.setLocalStateField("user", {
      username,
      color: getAvatarColor(username),
    });
    const initial = Array.from(provider.awareness.getStates().values())
      .map((s) => s.user)
      .filter((u) => u?.username);
    setUsers(initial);

    provider.awareness.on("change", ({ added, removed }) => {
      const states = provider.awareness.getStates();

      const current = Array.from(states.values())
        .map((s) => s.user)
        .filter((u) => u?.username);

      // Joined — use live states for added client IDs
      added.forEach((clientId) => {
        const user = states.get(clientId)?.user;
        if (user?.username && user.username !== username) {
          pushNotif(`${user.username} joined the room`, "join");
        }
      });

      // Left — use previous snapshot because removed clients are already gone
      removed.forEach((clientId) => {
        const user = prevStatesRef.current.get(clientId)?.user;
        if (user?.username && user.username !== username) {
          pushNotif(`${user.username} left the room`, "leave");
        }
      });

      // Save snapshot for next event
      prevStatesRef.current = new Map(
        Array.from(states.entries()).map(([id, state]) => [id, { ...state }]),
      );

      setUsers(current);
    });

    provider.on("status", ({ status }) => {
      setConnectionStatus(
        status === "connected" ? "connected" : "disconnected",
      );
    });

    const binding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness,
    );

    const onUnload = () => provider.awareness.setLocalStateField("user", null);
    window.addEventListener("beforeunload", onUnload);

    return () => {
      binding.destroy();
      provider.disconnect();
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [isEditorReady, username, roomId]);

  return { users, connectionStatus, notifications };
}
