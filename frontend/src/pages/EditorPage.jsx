import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useCollaboration } from "../hooks/useCollaboration";
import Toolbar from "../components/Toolbar";
import UserSidebar from "../components/UserSidebar";
import Notifications from "../components/Notifications";
import { SOCKET_URL } from "../constants";

export default function EditorPage({ username, roomId, onLeave }) {
  const [language, setLanguage] = useState("javascript");
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
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="app-body">
        <UserSidebar users={users} currentUser={username} />


          <div className="editor-wrapper">
            <Editor
              height="100%"
              language={language}
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
