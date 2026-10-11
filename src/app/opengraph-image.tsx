import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
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
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: 20,
            color: "#1c1c1c",
            alignSelf: "flex-start",
          }}
        >
          EverySpend
          <span
            style={{
              width: 7,
              height: 7,
              marginTop: -14,
              borderRadius: "50%",
              backgroundColor: "#8c9c90",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 400,
              lineHeight: 1.05,
              fontFamily: "Arial, sans-serif",
            }}
          >
            A clearer view
            <br />
            of your money.
          </div>
          <div style={{ fontSize: 26, color: "#62625f", lineHeight: 1.35 }}>
            An Android expense tracker with manual entry and optional on-device SMS import.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d7d5cc",
            paddingTop: 18,
            fontSize: 18,
            color: "#687766",
          }}
        >
          <span>ANDROID APP</span>
          <span>MANUAL ENTRY</span>
          <span>OPTIONAL SMS IMPORT</span>
        </div>
      </div>
    ),
    size,
  );
}
