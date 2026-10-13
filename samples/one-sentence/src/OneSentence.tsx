// "157 dollars to 3.58, from one sentence" — motion-graphic version of the Short.
// Copy is taken word for word from the Short's description.
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  BG,
  Background,
  BgName,
  C,
  Card,
  Check,
  Counter,
  DiagonalWipe,
  Fonts,
  Headline,
  Hi,
  MONO,
  Pop,
  SANS,
  Tag,
  Typed,
  usePop,
} from "./kit";

const WIPE = 14;

// Section lengths in frames (30 fps). Edit these to re-time to the voiceover.
const SCENES: { name: string; bg: BgName; dur: number; C: React.FC }[] = [
  { name: "hook", bg: "coral", dur: 120, C: Hook },
  { name: "fixes", bg: "blue", dur: 225, C: Fixes },
  { name: "question", bg: "purple", dur: 165, C: Question },
  { name: "sentence", bg: "amber", dur: 150, C: OneLine },
  { name: "result", bg: "green", dur: 180, C: Result },
  { name: "cta", bg: "teal", dur: 120, C: Cta },
];

export const TOTAL = SCENES.reduce((s, x) => s + x.dur, 0);

export const OneSentence: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Fonts />
      {SCENES.map((s, i) => {
        const from = at;
        at += s.dur;
        const next = SCENES[i + 1];
        return (
          <React.Fragment key={s.name}>
            <Sequence from={from} durationInFrames={s.dur}>
              <Background name={s.bg} />
              {/* Centered, kept clear of the Shorts caption/buttons at the bottom. */}
              <AbsoluteFill
                style={{ padding: "200px 80px 380px", justifyContent: "center" }}
              >
                <s.C />
              </AbsoluteFill>
            </Sequence>
            {next ? (
              <Sequence from={at - WIPE / 2} durationInFrames={WIPE}>
                <DiagonalWipe color={BG[next.bg][0]} dur={WIPE} />
              </Sequence>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* 1 ─ "157 dollars to get one customer." */
function Hook() {
  const shake = usePop(40, 6);
  return (
    <div>
      <Pop delay={0}>
        <Tag>The 157 dollar customer</Tag>
      </Pop>
      <Pop delay={6} from="scale" style={{ marginTop: 120 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 340,
            letterSpacing: -18,
            color: C.white,
            lineHeight: 0.9,
            transform: `rotate(${interpolate(shake, [0, 0.5, 1], [0, -3, 0])}deg)`,
            textShadow: "0 16px 50px rgba(0,0,0,0.25)",
          }}
        >
          <Counter from={0} to={157} delay={6} dur={34} prefix="$" />
        </div>
      </Pop>
      <Pop delay={24} style={{ marginTop: 40 }}>
        <Headline size={96}>
          to get <Hi>one</Hi> customer.
        </Headline>
      </Pop>
    </div>
  );
}

/* 2 ─ "New creative did not move it. A cheaper agency brought it to 120.
        More budget pushed it to 198. Same customer, more money." */
function Fixes() {
  const fixes = [
    { label: "New creative", value: "$157", note: "did not move it", strip: "#94a3b8", d: 18 },
    { label: "Cheaper agency", value: "$120", note: "brought it to", strip: C.yellow, d: 60 },
    { label: "More budget", value: "$198", note: "pushed it to", strip: C.red, d: 102 },
  ];
  return (
    <div>
      <Pop>
        <Headline>
          Three <Hi>fixes.</Hi>
        </Headline>
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 70 }}>
        {fixes.map((f, i) => (
          <Pop key={f.label} delay={f.d} style={{ marginLeft: i * 30 }}>
            <Card strip={f.strip}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, opacity: 0.55 }}>
                    FIX {i + 1}
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: -2 }}>
                    {f.label}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 36, opacity: 0.6 }}>{f.note}</div>
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, letterSpacing: -5 }}>
                  {f.value}
                </div>
              </div>
            </Card>
          </Pop>
        ))}
      </div>
      <Pop delay={160} style={{ marginTop: 70 }}>
        <Tag bg={C.yellow} color={C.ink}>
          Same customer, more money
        </Tag>
      </Pop>
    </div>
  );
}

/* 3 ─ "because the ads were never the problem. Nobody asked the only question
        that matters: what does the customer actually get." */
function Question() {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [30, 48], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div>
      <Pop>
        <Headline size={96}>
          The ads were{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            never
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: -6,
                height: 14,
                width: `${strike}%`,
                background: C.yellow,
                borderRadius: 8,
              }}
            />
          </span>{" "}
          the problem.
        </Headline>
      </Pop>
      <Pop delay={55} style={{ marginTop: 110 }}>
        <Tag bg={C.white} color={C.ink}>
          The only question that matters
        </Tag>
      </Pop>
      <Pop delay={62} from="scale" style={{ marginTop: 34 }}>
        <Card dark style={{ minHeight: 420 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
            ))}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: -3 }}>
            <Typed text="What does the customer actually get?" delay={72} cps={20} />
          </div>
        </Card>
      </Pop>
    </div>
  );
}

/* 4 ─ "So they changed one sentence. Same product. Same audience. Same budget." */
function OneLine() {
  return (
    <div>
      <Pop>
        <Headline color={C.ink}>
          So they changed <Hi color={C.white}>one sentence.</Hi>
        </Headline>
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 90 }}>
        <Check label="Same product" delay={40} on={52} />
        <Check label="Same audience" delay={62} on={74} />
        <Check label="Same budget" delay={84} on={96} />
      </div>
    </div>
  );
}

/* 5 ─ "42. 18. 3.58." */
function Result() {
  const steps = [
    { v: 157, d: 0 },
    { v: 42, d: 40 },
    { v: 18, d: 80 },
    { v: 3.58, d: 120 },
  ];
  const frame = useCurrentFrame();
  const cur = [...steps].reverse().find((s) => frame >= s.d) ?? steps[0];
  const idx = steps.indexOf(cur);
  const prev = steps[Math.max(0, idx - 1)];
  const final = usePop(120 + 18, 9);
  return (
    <div>
      <Pop>
        <Tag>Cost per customer</Tag>
      </Pop>
      <div
        style={{
          marginTop: 90,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 300,
          letterSpacing: -16,
          lineHeight: 0.9,
          color: C.white,
          textShadow: "0 16px 50px rgba(0,0,0,0.25)",
          transform: `scale(${interpolate(final, [0, 1], [1, 1.08])})`,
          transformOrigin: "left center",
        }}
      >
        <Counter
          key={idx}
          from={prev.v}
          to={cur.v}
          dur={22}
          delay={cur.d}
          decimals={cur.v % 1 ? 2 : 0}
          prefix="$"
        />
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 70, flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <Pop key={s.v} delay={s.d} from="scale">
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 52,
                padding: "16px 28px",
                borderRadius: 24,
                background: i === idx ? C.yellow : "rgba(255,255,255,0.18)",
                color: i === idx ? C.ink : C.white,
                textDecoration: i < idx ? "line-through" : "none",
              }}
            >
              ${s.v}
            </div>
          </Pop>
        ))}
      </div>
      <Pop delay={140} style={{ marginTop: 80 }}>
        <Headline size={80}>
          From <Hi>one sentence.</Hi>
        </Headline>
      </Pop>
    </div>
  );
}

/* 6 ─ "Comment WIN-WIN and I will send you the book." */
function Cta() {
  const pulse = 1 + Math.sin(useCurrentFrame() / 6) * 0.025;
  return (
    <div>
      <Pop>
        <Headline>Comment</Headline>
      </Pop>
      <Pop delay={8} from="scale" style={{ marginTop: 40 }}>
        <div
          style={{
            display: "inline-block",
            background: C.yellow,
            color: C.ink,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 170,
            letterSpacing: -8,
            padding: "20px 56px",
            borderRadius: 48,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            transform: `scale(${pulse}) rotate(-3deg)`,
          }}
        >
          WIN-WIN
        </div>
      </Pop>
      <Pop delay={24} style={{ marginTop: 70 }}>
        <Headline size={84}>
          and I will send you <Hi>the book.</Hi>
        </Headline>
      </Pop>
    </div>
  );
}
