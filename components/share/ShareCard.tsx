import { ImageResponse } from "next/og";
import { SITE_URL } from "@/data/site";

// Share preview cards (Open Graph / social link previews), 1200 x 630.
export const shareImageSize = { width: 1200, height: 630 };

type ShareCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
};

// Load a Google font as TrueType for the image renderer; fall back to the built-in font if offline.
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; share-card)" },
      })
    ).text();
    const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

// A 4 x 4 feature-map motif with an amber 2 x 2 window, echoing the guided lessons.
const MOTIF = [
  [0.25, 0.55, 0.3, 0.7],
  [0.6, 0.9, 0.45, 0.35],
  [0.3, 0.5, 0.85, 0.6],
  [0.7, 0.35, 0.55, 0.25],
];

export async function renderShareCard({ eyebrow, title, subtitle, badge }: ShareCardProps) {
  const [serif, sans, sansBold] = await Promise.all([
    loadGoogleFont("Instrument Serif", 400),
    loadGoogleFont("Inter", 500),
    loadGoogleFont("Inter", 700),
  ]);
  const fonts = [
    serif && { name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const },
    sans && { name: "Inter", data: sans, weight: 500 as const, style: "normal" as const },
    sansBold && { name: "Inter", data: sansBold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 500 | 700; style: "normal" }[];

  const titleSize = title.length > 34 ? 66 : title.length > 22 ? 78 : 92;
  const cell = 62;
  const gap = 10;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f7f6fc",
          fontFamily: "Inter",
          color: "#1a1630",
        }}
      >
        {/* soft atmosphere */}
        <div style={{ position: "absolute", left: -180, top: -220, width: 720, height: 720, borderRadius: 720, backgroundImage: "radial-gradient(circle, rgba(108,92,231,0.22), rgba(108,92,231,0) 70%)", display: "flex" }} />
        <div style={{ position: "absolute", right: -160, bottom: -260, width: 760, height: 760, borderRadius: 760, backgroundImage: "radial-gradient(circle, rgba(13,148,136,0.16), rgba(13,148,136,0) 70%)", display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 0 64px 80px", width: 760 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 5, color: "#5b4bd6", textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ display: "flex", marginTop: 26, fontFamily: "Instrument Serif", fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 28, lineHeight: 1.45, color: "#585566", maxWidth: 660 }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#6f6888" }}>
            {badge ? (
              <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap", padding: "8px 18px", borderRadius: 999, background: "#5b4bd6", color: "#ffffff", fontWeight: 700, fontSize: 20 }}>{badge}</div>
            ) : null}
            <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap" }}>{SITE_URL.replace("https://", "")}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440 }}>
          <div style={{ display: "flex", position: "relative", flexDirection: "column", gap }}>
            {MOTIF.map((row, r) => (
              <div key={r} style={{ display: "flex", gap }}>
                {row.map((t, c) => (
                  <div
                    key={c}
                    style={{
                      display: "flex",
                      width: cell,
                      height: cell,
                      borderRadius: 14,
                      background: `rgba(13, 148, 136, ${0.12 + t * 0.78})`,
                    }}
                  />
                ))}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: cell + gap - 7,
                top: -7,
                width: cell * 2 + gap + 14,
                height: cell * 2 + gap + 14,
                border: "5px solid #f59e0b",
                borderRadius: 20,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...shareImageSize, fonts: fonts.length ? fonts : undefined },
  );
}
