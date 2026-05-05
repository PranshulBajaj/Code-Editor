import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import cors from "cors";
import axios from "axios";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cors());

const activeRooms = new Set();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();


app.get("/health", (req, res) => {
  res.status(200).json({
    message: "ok",
    success: true,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
    success: true,
  });
});

app.post("/create-room", (req, res) => {
  const { roomId } = req.body;
  activeRooms.add(roomId);
  res.json({ success: true });
});

app.get("/room-exists/:roomId", (req, res) => {
  res.json({ exists: activeRooms.has(req.params.roomId) });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
