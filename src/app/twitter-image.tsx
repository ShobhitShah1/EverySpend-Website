import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fafaf9",
          color: "#1c1c1c",
          padding: "56px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 24, color: "#1c1c1c" }}>EverySpend</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 400,
              lineHeight: 1.08,
              fontFamily: "Arial, sans-serif",
            }}
          >
            A clearer view
            <br />
            of your money.
          </div>
          <div style={{ fontSize: 28, color: "#62625f" }}>
            Manual expense entry. Optional on-device SMS import.
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#62625f" }}>
          An Android expense tracker.
        </div>
      </div>
    ),
    size,
  );
}
