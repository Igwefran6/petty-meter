import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Petty Meter — How Petty Are You?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF5EB 0%, #FFE4E6 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 190, 11, 0.25)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(255, 0, 110, 0.15)",
          }}
        />

        {/* Icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
          }}
        >
          ⚖️
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: "linear-gradient(90deg, #FF6B35, #FF006E)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          Petty Meter
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 40,
          }}
        >
          How petty are you, really?
        </div>

        {/* Zones row */}
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {[
            { label: "Legitimate", color: "#8AC926" },
            { label: "Annoying", color: "#FFBE0B" },
            { label: "Getting Petty", color: "#FB5607" },
            { label: "Peak Pettiness", color: "#FF006E" },
            { label: "Let It Go", color: "#8338EC" },
          ].map((zone) => (
            <div
              key={zone.label}
              style={{
                background: zone.color,
                color: "white",
                fontSize: 15,
                fontWeight: 800,
                padding: "8px 16px",
                borderRadius: 999,
              }}
            >
              {zone.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            fontWeight: 700,
            color: "#9CA3AF",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          AI-powered • Free • No sign-up
        </div>
      </div>
    ),
    { ...size }
  );
}
