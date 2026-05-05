import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useCollaboration } from "../hooks/useCollaboration";
import Toolbar from "../components/Toolbar";
import UserSidebar from "../components/UserSidebar";
import Notifications from "../components/Notifications";

const [language, setLanguage] = useState("javascript");

export default function EditorPage({ username, roomId, onLeave }) {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const { users, connectionStatus, notifications } = useCollaboration({
    roomId,
    username,
    editorRef,
    isEditorReady,
  });

  return (
    <div className="app-layout">
      <Toolbar
        roomId={roomId}
        connectionStatus={connectionStatus}
        onLeave={onLeave}
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="lang-select"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <div className="app-body">
        <UserSidebar users={users} currentUser={username} />

        <div className="editor-wrapper">
          <Editor
            height="100%"
            defaultLanguage={language}
            theme="vs-dark"
            onMount={(editor) => {
              editorRef.current = editor;
              setIsEditorReady(true);
            }}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "phase",
              cursorSmoothCaretAnimation: "on",
              padding: { top: 16 },
            }}
          />
        </div>
      </div>

      <Notifications notifications={notifications} />
    </div>
  );
}
