# CodeSync — Real-Time Collaborative Code Editor

A browser-based collaborative code editor where multiple users can write and edit code together in real time — think Google Docs, but for code. Built with React, Node.js, Socket.IO, and Yjs.

## Features

- **Room-based sessions** — create a room instantly or join one with a room ID (e.g. `red-wolf-4821`)
- **Real-time sync** — all users in a room see edits as they happen, with zero conflicts
- **Concurrent edit handling** — uses Yjs (CRDT) to automatically resolve edits made at the same time by different users
- **Live presence** — see who's in the room, with colored avatars and join/leave notifications
- **Monaco Editor** — the same editor engine that powers VS Code, with syntax highlighting, smooth scrolling, and monospace font support
- **Connection status** — live indicator showing whether you're connected or reconnecting

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Real-time sync | Yjs, y-socket.io, y-monaco (MonacoBinding) |
| Presence | Yjs Awareness protocol |
| Backend | Node.js, Express, Socket.IO |
| Transport | WebSockets via Socket.IO |

## How it works

### Why Yjs instead of just Socket.IO?

Naive collaborative editors broadcast every keystroke and apply them in order. This breaks the moment two users edit the same line simultaneously — one user's change overwrites the other's.

Yjs uses a **CRDT (Conflict-free Replicated Data Type)** called Y.Text. Every edit is tracked as an operation with a unique ID. When two conflicting edits arrive, Yjs merges them deterministically — no data is lost, and both users end up with the same document state automatically.

### Architecture

```
Browser (User A)                     Browser (User B)
    │                                     │
    ├─ Monaco Editor                      ├─ Monaco Editor
    ├─ MonacoBinding (y-monaco)           ├─ MonacoBinding (y-monaco)
    ├─ Y.Doc + Y.Text                     ├─ Y.Doc + Y.Text
    └─ SocketIOProvider ──────────────────┘
                │
         Node.js Server
         Socket.IO + YSocketIO
         (syncs Yjs updates between all clients in a room)
```

### Room flow

1. User enters a username and clicks **Create Room** → a human-readable room ID is generated (e.g. `calm-wolf-3821`)
2. URL updates to `/room/calm-wolf-3821?username=alice` — shareable directly
3. Other users paste the room ID and click **Join Room**
4. YSocketIO on the server handles Yjs document sync across all clients in the room
5. Awareness events fire when users join/leave — notifications appear and the sidebar updates

### `useCollaboration` hook

All Socket.IO, Yjs, and awareness logic lives in a single custom hook `useCollaboration`. It:
- Creates a `Y.Doc` and `Y.Text` shared type
- Initialises `SocketIOProvider` and connects to the room
- Sets local awareness state (username + avatar color)
- Listens for `added`/`removed` awareness events to show join/leave toasts
- Binds the Yjs text to the Monaco editor model via `MonacoBinding`
- Cleans up: destroys binding, disconnects provider, and removes the `beforeunload` listener on unmount

## Project structure

```
Code-Editor/
├── backend/
│   ├── server.js          # Express + Socket.IO + YSocketIO setup
│   └── package.json
└── frontend/
    └── src/
        ├── pages/
        │   ├── HomePage.jsx       # Create / join room UI
        │   └── EditorPage.jsx     # Editor layout
        ├── hooks/
        │   └── useCollaboration.js  # All Yjs + Socket.IO logic
        ├── components/
        │   ├── Toolbar.jsx
        │   ├── UserSidebar.jsx
        │   └── Notifications.jsx
        └── utils/
            └── helpers.js         # generateRoomId, getAvatarColor, getInitials
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

> Make sure `SOCKET_URL` in `frontend/src/constants.js` points to your backend URL.

## Usage

1. Open the app in your browser
2. Enter a username and click **Create Room**
3. Share the room ID (shown in the toolbar) with a friend
4. They open the app, enter a username, paste the room ID, and click **Join Room**
5. Both users are now editing the same document in real time

## Key implementation details

- **Avatar colors** are deterministic — the same username always gets the same color, computed via a hash of the username string
- **Leave notifications** use a snapshot of previous awareness states (`prevStatesRef`) because removed clients are already gone from the live states map by the time the event fires
- **Room IDs** are generated as `adjective-noun-number` (e.g. `bold-star-4291`) for readability and easy sharing
- **URL-based session** — the room ID and username are stored in the URL, so refreshing the page re-joins the same room automatically