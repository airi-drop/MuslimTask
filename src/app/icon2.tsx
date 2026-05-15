import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
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
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 60,
            width: 160,
            height: 160,
            background: "#46F2C0",
            borderRadius: 999,
            opacity: 0.3,
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 80,
            display: "flex",
          }}
        >
          <svg width="160" height="160" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="22" fill="#F5BE3D" />
            <circle cx="38" cy="26" r="20" fill="#04261A" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 300,
            fontWeight: 800,
            color: "#46F2C0",
            letterSpacing: -10,
            lineHeight: 1,
            display: "flex",
            textShadow: "0 0 60px rgba(70, 242, 192, 0.6)",
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}
