// Reusable pieces of the look: section gradients, pop-in springs, cards,
// mono tags, number tiles, counters, checklists and the diagonal wipe.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const C = {
  ink: "#16131f",
  paper: "#fffaf2",
  yellow: "#ffc93c",
  green: "#22c55e",
  red: "#ef4444",
  white: "#ffffff",
};

// One saturated gradient per section, so viewers know where they are.
export const BG = {
  coral: ["#ff7a59", "#e8453c"],
  blue: ["#4f6bff", "#2b3fd6"],
  purple: ["#8b5cf6", "#c026d3"],
  amber: ["#ffb648", "#ff8a3d"],
  green: ["#1fae6b", "#0f7a63"],
  teal: ["#3a6df0", "#1fa5a0"],
} as const;
export type BgName = keyof typeof BG;

export const SANS = "Geist";
export const MONO = "GeistMono";

export const Fonts: React.FC = () => (
  <style>{`
    @font-face { font-family: Geist; src: url(${staticFile("Geist-Variable.woff2")}) format("woff2"); font-weight: 100 900; }
    @font-face { font-family: GeistMono; src: url(${staticFile("GeistMono-Medium.woff2")}) format("woff2"); font-weight: 500; }
  `}</style>
);

export const Background: React.FC<{ name: BgName }> = ({ name }) => {
  const frame = useCurrentFrame();
  const [a, b] = BG[name];
  // Slow drift of the light spot keeps a static frame from feeling dead.
  const x = 30 + Math.sin(frame / 50) * 10;
  const y = 25 + Math.cos(frame / 60) * 8;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(160deg, ${a}, ${b})`,
      }}
    />
  );
};

// 0 → 1 spring that starts at `delay` frames. Slight overshoot = the bouncy pop.
export const usePop = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 160, mass: 0.8 } });
};

export const Pop: React.FC<{
  delay?: number;
  from?: "up" | "down" | "scale";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, from = "up", style, children }) => {
  const p = usePop(delay);
  const t =
    from === "scale"
      ? `scale(${interpolate(p, [0, 1], [0.6, 1])})`
      : `translateY(${interpolate(p, [0, 1], [from === "up" ? 80 : -80, 0])}px)`;
  return (
    <div style={{ opacity: Math.min(1, p * 1.5), transform: t, ...style }}>{children}</div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; bg?: string; color?: string }> = ({
  children,
  bg = C.ink,
  color = C.white,
}) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color,
      fontFamily: MONO,
      fontSize: 30,
      letterSpacing: 4,
      padding: "12px 24px",
      borderRadius: 999,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

export const Headline: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 110,
  color = C.white,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 850,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -size * 0.045,
      color,
      textShadow: "0 6px 30px rgba(0,0,0,0.18)",
    }}
  >
    {children}
  </div>
);

export const Hi: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.yellow,
}) => <span style={{ color }}>{children}</span>;

export const Card: React.FC<{
  children: React.ReactNode;
  strip?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ children, strip, dark, style }) => (
  <div
    style={{
      background: dark ? C.ink : C.paper,
      color: dark ? C.white : C.ink,
      borderRadius: 40,
      boxShadow: "0 30px 60px rgba(0,0,0,0.28), 0 6px 14px rgba(0,0,0,0.15)",
      overflow: "hidden",
      ...style,
    }}
  >
    {strip ? <div style={{ height: 18, background: strip }} /> : null}
    <div style={{ padding: "36px 44px" }}>{children}</div>
  </div>
);

// Counts from `from` to `to` over `dur` frames with an ease-out.
export const Counter: React.FC<{
  from: number;
  to: number;
  delay?: number;
  dur?: number;
  decimals?: number;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({ from, to, delay = 0, dur = 30, decimals = 0, prefix = "", style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - t, 3);
  const v = from + (to - from) * eased;
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {v.toFixed(decimals)}
    </span>
  );
};

export const Check: React.FC<{ on: number; label: string; delay: number }> = ({
  on,
  label,
  delay,
}) => {
  const p = usePop(delay);
  const tick = usePop(on, 10);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: C.paper,
        borderRadius: 28,
        padding: "26px 34px",
        opacity: Math.min(1, p * 1.5),
        transform: `translateX(${interpolate(p, [0, 1], [-120, 0])}px)`,
        boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          border: `5px solid ${tick > 0.05 ? C.green : "#d4d0c8"}`,
          background: tick > 0.05 ? C.green : "transparent",
          display: "grid",
          placeItems: "center",
          color: C.white,
          fontSize: 40,
          fontWeight: 900,
          fontFamily: SANS,
          transform: `scale(${interpolate(tick, [0, 1], [0.7, 1])})`,
        }}
      >
        {tick > 0.05 ? "✓" : ""}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 750, fontSize: 56, color: C.ink, letterSpacing: -2 }}>
        {label}
      </div>
    </div>
  );
};

// Text that types itself in, with a blinking caret.
export const Typed: React.FC<{ text: string; delay?: number; cps?: number }> = ({
  text,
  delay = 0,
  cps = 22,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - delay) / fps) * cps));
  const done = n >= text.length;
  const caretOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      <span style={{ opacity: !done || caretOn ? 1 : 0, color: C.yellow }}>|</span>
    </span>
  );
};

// Angled panel that sweeps across to hide a cut between sections.
export const DiagonalWipe: React.FC<{ color: string; dur: number }> = ({ color, dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const x = interpolate(ease, [0, 1], [-160, 160]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: `${x}%`,
          width: "130%",
          height: "140%",
          background: color,
          transform: "skewX(-14deg)",
          boxShadow: "0 0 80px rgba(0,0,0,0.25)",
        }}
      />
    </AbsoluteFill>
  );
};
