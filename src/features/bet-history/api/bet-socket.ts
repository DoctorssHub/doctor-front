import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// Live bets are broadcast on the `/events` namespace as `NewLiveBet`.
export const NEW_LIVE_BET_EVENT = "NewLiveBet";

let socket: Socket | null = null;

export function getBetSocket(): Socket {
  if (!SOCKET_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not configured.");
  }

  if (!socket) {
    socket = io(`${SOCKET_URL}/events`, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  return socket;
}
