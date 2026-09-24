import React, { useEffect, useRef, useState } from "react";

export const ExportAnalyticsDashboard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load the dashboard content via fetch
    fetch("/analytics.html")
      .then((response) => response.text())
      .then((html) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = html;
          setLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load dashboard:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 20px; text-align: center;">
              <h2>Failed to load Export Analytics Dashboard</h2>
              <p>Please try accessing the dashboard directly at:</p>
              <a href="/analytics.html" target="_blank" style="color: #4f46e5;">/analytics.html</a>
            </div>
          `;
        }
      });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "white",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          Export Analytics Dashboard
        </h2>
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "auto",
          background: loaded ? "transparent" : "#f8fafc",
        }}
      >
        {!loaded && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#64748b",
            }}
          >
            Loading dashboard...
          </div>
        )}
      </div>
    </div>
  );
};
