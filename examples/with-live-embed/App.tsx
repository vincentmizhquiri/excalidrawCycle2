import { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import { useCollab } from "./useCollab";
import { CreditLine } from "./CreditLine";

import "@excalidraw/excalidraw/index.css";

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const { status, collaboratorCount, roomId, broadcastChange } =
    useCollab(excalidrawAPI);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Excalidraw
        onExcalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={(elements) => broadcastChange(elements)}
      />

      {/* Live-sync status pill, top-left, out of the way of the toolbar */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#fff",
          border: "1px solid #e0e0e6",
          borderRadius: 999,
          padding: "4px 10px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          color: status === "connected" ? "#1a7f4e" : "#8a8a93",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <span>●</span>
        {status === "connected"
          ? `Live — ${collaboratorCount} ${
              collaboratorCount === 1 ? "person" : "people"
            } viewing`
          : status === "connecting"
          ? "Connecting..."
          : "Disconnected"}
      </div>

      {/* Shareable room link hint, useful when testing with a second tab */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 16,
          zIndex: 10,
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
          color: "#8a8a93",
          background: "#fff",
          border: "1px solid #e0e0e6",
          borderRadius: 8,
          padding: "4px 8px",
        }}
      >
        Room: {roomId.slice(0, 8)}
      </div>

      <CreditLine />
    </div>
  );
}
