import {
  EXCALIDRAW_LOGO_PATH_D,
  EXCALIDRAW_LOGO_VIEWBOX,
  EXCALIDRAW_BRAND_COLOR,
} from "@excalidraw/common/brand";

// Shared attribution style, confirmed with the team: the Excalidraw icon
// plus "Made with Excalidraw" text in a light purple/gray tone, sitting
// directly on the canvas with no background box.
//
// The icon itself comes from packages/common/src/brand.ts — the single
// source of truth Bo's PR (#12158) set up, also used by the collaboration
// QR code overlay. Using it here (instead of a separate copy of the logo)
// means this credit line and the watermark/QR branding stay in sync
// automatically if the logo is ever updated, rather than three different
// hand-copied versions drifting apart over time.
export const CreditLine = () => {
  return (
    <a
      href="https://excalidraw.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "absolute",
        bottom: 12,
        right: 16,
        display: "flex",
        alignItems: "center",
        gap: 6,
        textDecoration: "none",
        zIndex: 10,
        fontFamily: "system-ui, sans-serif",
        fontStyle: "italic",
        fontSize: 13,
        color: "#a8a5e6",
        pointerEvents: "auto",
      }}
    >
      <svg
        viewBox={EXCALIDRAW_LOGO_VIEWBOX}
        width={16}
        height={16}
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      >
        <path d={EXCALIDRAW_LOGO_PATH_D} fill={EXCALIDRAW_BRAND_COLOR} />
      </svg>
      Made with Excalidraw
    </a>
  );
};
