import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = { width: 512, height: 512 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#04261A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Maskable: keep content within safe zone (~80% center) */}
        <div
          style={{
            width: 408,
            height: 408,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 30% 30%, #0F8A57 0%, #04261A 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 240,
            fontWeight: 800,
            color: "#46F2C0",
            letterSpacing: -8,
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}
