import { AVATAR_COLORS } from "../constants";

export function getAvatarColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++)
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(username) {
  return username.slice(0, 2).toUpperCase();
}

export function generateRoomId() {
  const adj  = ["red","blue","cold","fast","calm","dark","bold","soft","wild","keen"];
  const noun = ["fox","moon","lake","pine","wave","bird","star","rock","mist","wolf"];
  const a = adj[Math.floor(Math.random() * adj.length)];
  const n = noun[Math.floor(Math.random() * noun.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${a}-${n}-${num}`;
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
