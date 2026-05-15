import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 30% 30%, #0F8A57 0%, #04261A 60%, #021810 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 60,
            height: 60,
            background: "#46F2C0",
            borderRadius: 999,
            opacity: 0.3,
            filter: "blur(20px)",
          }}
        />
        {/* Crescent */}
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 30,
            display: "flex",
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="22" fill="#F5BE3D" />
            <circle cx="38" cy="26" r="20" fill="#04261A" />
          </svg>
        </div>
        {/* Letter M */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            color: "#46F2C0",
            letterSpacing: -4,
            lineHeight: 1,
            display: "flex",
            textShadow: "0 0 24px rgba(70, 242, 192, 0.6)",
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}
