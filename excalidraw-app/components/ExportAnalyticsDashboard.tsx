import React, { useEffect, useState } from "react";

export const ExportAnalyticsDashboard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [dashboardHtml, setDashboardHtml] = useState("");

  useEffect(() => {
    fetch("/analytics.html")
      .then((response) => response.text())
      .then(setDashboardHtml)
      .catch((error) => {
        console.error("Failed to load dashboard:", error);
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
      <iframe
        srcDoc={dashboardHtml}
        title="Export Analytics Dashboard"
        style={{
          flex: 1,
          width: "100%",
          border: "none",
        }}
      />
    </div>
  );
};
