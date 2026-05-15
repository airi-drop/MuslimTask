import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            top: 22,
            right: 22,
            display: "flex",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="22" fill="#F5BE3D" />
            <circle cx="38" cy="26" r="20" fill="#04261A" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 105,
            fontWeight: 800,
            color: "#46F2C0",
            letterSpacing: -4,
            lineHeight: 1,
            display: "flex",
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}
