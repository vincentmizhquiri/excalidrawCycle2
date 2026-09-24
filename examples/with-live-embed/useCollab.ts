/// <reference types="vite/client" />
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { OrderedExcalidrawElement } from "@excalidraw/element/types";

// -----------------------------------------------------------------------------
// This hook talks to Excalidraw's own open-source relay server
// (https://github.com/excalidraw/excalidraw-room), unmodified. That server
// never reads or decrypts what passes through it — it just relays whatever
// bytes it's given to everyone else in the room. That's what lets us skip
// real end-to-end encryption for this deadline: the production Excalidraw
// app encrypts every payload client-side before sending, and that's the
// right way to do it long-term. This is a deliberate, called-out shortcut
// to ship a working live-sync demo on a tight timeline, not something to
// carry forward silently into a real launch.
// -----------------------------------------------------------------------------

const getRoomId = () => {
  const hash = window.location.hash;
  const match = hash.match(/room=([a-zA-Z0-9-]+)/);
  if (match) {
    return match[1];
  }
  const newRoomId = crypto.randomUUID();
  window.location.hash = `room=${newRoomId}`;
  return newRoomId;
};

export const useCollab = (excalidrawAPI: ExcalidrawImperativeAPI | null) => {
  const socketRef = useRef<Socket | null>(null);
  const roomIdRef = useRef<string>(getRoomId());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting",
  );
  const [collaboratorCount, setCollaboratorCount] = useState(1);

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }

    const serverUrl = import.meta.env.VITE_APP_WS_SERVER_URL;
    if (!serverUrl) {
      console.error(
        "VITE_APP_WS_SERVER_URL is not set — live sync will not connect. See .env.example.",
      );
      setStatus("disconnected");
      return;
    }

    const socket = io(serverUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    const roomId = roomIdRef.current;

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join-room", roomId);
    });

    socket.on("disconnect", () => setStatus("disconnected"));

    // A new person joined — if we already have a drawing, send them the
    // current scene so their canvas isn't empty.
    socket.on("new-user", () => {
      const elements = excalidrawAPI.getSceneElements();
      socket.emit("server-broadcast", roomId, JSON.stringify(elements), "");
    });

    socket.on("room-user-change", (userIds: string[]) => {
      setCollaboratorCount(Math.max(userIds.length, 1));
    });

    // Someone else's change arrived — apply it to our canvas.
    socket.on("client-broadcast", (data: string) => {
      try {
        const elements = JSON.parse(data) as OrderedExcalidrawElement[];
        excalidrawAPI.updateScene({ elements });
      } catch (error) {
        console.error("Failed to apply incoming scene update", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [excalidrawAPI]);

  // Called from the Excalidraw onChange handler. Debounced so we're not
  // flooding the server on every single pixel of a stroke.
  const broadcastChange = (elements: readonly OrderedExcalidrawElement[]) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const socket = socketRef.current;
      if (socket?.connected) {
        socket.emit(
          "server-broadcast",
          roomIdRef.current,
          JSON.stringify(elements),
          "",
        );
      }
    }, 300);
  };

  return {
    status,
    collaboratorCount,
    roomId: roomIdRef.current,
    broadcastChange,
  };
};
