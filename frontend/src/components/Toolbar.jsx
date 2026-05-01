import { useState } from "react";
import { copyToClipboard } from "../utils/helpers";

export default function Toolbar({ roomId, connectionStatus, onLeave }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <span>⌨</span>
        <span>CodeSync</span>
      </div>

      <button className="room-chip" onClick={handleCopy} title="Click to copy Room ID">
        <span>#{roomId}</span>
        <span className="room-copy-icon">{copied ? "✓" : "⎘"}</span>
      </button>

      <div className="toolbar-right">
        <div className={`connection-dot ${connectionStatus}`} title={connectionStatus} />
        <button className="leave-btn" onClick={onLeave}>⎋ Leave</button>
      </div>
    </div>
  );
}
