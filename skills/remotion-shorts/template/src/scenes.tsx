// Scene types. Each one acts out one idea; content.ts picks them and fills the words.
// Text props accept *stars* around the word to highlight.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  C,
  Card,
  Check,
  Counter,
  Headline,
  MONO,
  Pop,
  Rich,
  SANS,
  Tag,
  Typed,
  fitGap,
  usePop,
} from "./kit";

/** Every scene also receives `dur` (its length in frames) from Video.tsx. */
type Fit = { dur?: number };

/** Opening number: a big figure counts up under a tag, with one line below. */
export type StatProps = {
  tag?: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  line?: string;
};
export const Stat: React.FC<StatProps> = ({ tag, value, prefix = "", suffix = "", decimals = 0, line }) => {
  const nudge = usePop(40, 6);
  return (
    <div>
      {tag ? (
        <Pop>
          <Tag>{tag}</Tag>
        </Pop>
      ) : null}
      <Pop delay={6} from="scale" style={{ marginTop: tag ? 120 : 0 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 340,
            letterSpacing: -18,
            color: C.white,
            lineHeight: 0.9,
            transform: `rotate(${interpolate(nudge, [0, 0.5, 1], [0, -3, 0])}deg)`,
            textShadow: "0 16px 50px rgba(0,0,0,0.25)",
          }}
        >
          <Counter from={0} to={value} delay={6} dur={34} decimals={decimals} prefix={prefix} />
          {suffix}
        </div>
      </Pop>
      {line ? (
        <Pop delay={24} style={{ marginTop: 40 }}>
          <Headline size={96}>
            <Rich text={line} />
          </Headline>
        </Pop>
      ) : null}
    </div>
  );
};

/** Title card for a numbered series ("TIP 03"): tag, number tile, title that types in. */
export type NumberTitleProps = { tag?: string; kicker?: string; number: string; title: string };
export const NumberTitle: React.FC<NumberTitleProps> = ({ tag, kicker = "PART", number, title }) => (
  <div>
    {tag ? (
      <Pop>
        <Tag>{tag}</Tag>
      </Pop>
    ) : null}
    <Pop delay={6} from="scale" style={{ marginTop: 80 }}>
      <div
        style={{
          display: "inline-block",
          background: C.yellow,
          color: C.ink,
          borderRadius: 48,
          padding: "26px 48px 34px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 4 }}>{kicker}</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 230, letterSpacing: -10, lineHeight: 0.85 }}>
          {number}
        </div>
      </div>
    </Pop>
    <div style={{ marginTop: 70 }}>
      <Headline size={120}>
        <Typed text={title} delay={20} cps={18} />
      </Headline>
    </div>
  </div>
);

/** A headline, then cards that drop in one by one (options, attempts, steps). */
export type CardsProps = {
  title: string;
  cards: { kicker?: string; label: string; note?: string; value?: string; strip?: string }[];
  footer?: string;
  /** Frames between cards. Raise it to land each card on its spoken line. */
  gap?: number;
};
export const Cards: React.FC<CardsProps & Fit> = ({ title, cards, footer, gap: want = 42, dur }) => {
  const gap = fitGap(want, 18, cards.length + (footer ? 1 : 0), dur);
  const strips = ["#94a3b8", C.yellow, C.red, C.green];
  return (
    <div>
      <Pop>
        <Headline>
          <Rich text={title} />
        </Headline>
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 70 }}>
        {cards.map((c, i) => (
          <Pop key={i} delay={18 + i * gap} style={{ marginLeft: i * 30 }}>
            <Card strip={c.strip ?? strips[i % strips.length]}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                <div>
                  {c.kicker ? (
                    <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, opacity: 0.55 }}>{c.kicker}</div>
                  ) : null}
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: -2 }}>{c.label}</div>
                  {c.note ? <div style={{ fontFamily: SANS, fontSize: 36, opacity: 0.6 }}>{c.note}</div> : null}
                </div>
                {c.value ? (
                  <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, letterSpacing: -5 }}>{c.value}</div>
                ) : null}
              </div>
            </Card>
          </Pop>
        ))}
      </div>
      {footer ? (
        <Pop delay={18 + cards.length * gap + 16} style={{ marginTop: 70 }}>
          <Tag bg={C.yellow} color={C.ink}>
            {footer}
          </Tag>
        </Pop>
      ) : null}
    </div>
  );
};

/** A statement with one word underlined, then a question typing into a dark card. */
export type QuestionProps = { headline: string; underline?: string; tag?: string; question: string };
export const Question: React.FC<QuestionProps> = ({ headline, underline, tag, question }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [30, 48], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [before, after] = underline ? headline.split(underline) : [headline, undefined];
  return (
    <div>
      <Pop>
        <Headline size={96}>
          <Rich text={before} />
          {underline ? (
            <>
              <span style={{ position: "relative", display: "inline-block" }}>
                {underline}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: -6,
                    height: 14,
                    width: `${w}%`,
                    background: C.yellow,
                    borderRadius: 8,
                  }}
                />
              </span>
              <Rich text={after ?? ""} />
            </>
          ) : null}
        </Headline>
      </Pop>
      {tag ? (
        <Pop delay={55} style={{ marginTop: 110 }}>
          <Tag bg={C.white} color={C.ink}>
            {tag}
          </Tag>
        </Pop>
      ) : null}
      <Pop delay={62} from="scale" style={{ marginTop: 34 }}>
        <Card dark style={{ minHeight: 420 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
            ))}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: -3 }}>
            <Typed text={question} delay={72} cps={20} />
          </div>
        </Card>
      </Pop>
    </div>
  );
};

/** A headline, then a checklist that ticks off one row at a time. */
export type ChecklistProps = { headline: string; items: string[]; dark?: boolean; gap?: number };
export const Checklist: React.FC<ChecklistProps & Fit> = ({ headline, items, dark = true, gap: want = 22, dur }) => {
  const gap = fitGap(want, 24, items.length, dur, 42);
  return (
  <div>
    <Pop>
      <Headline color={dark ? C.ink : C.white}>
        <Rich text={headline} hi={dark ? C.white : C.yellow} />
      </Headline>
    </Pop>
    <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 90 }}>
      {items.map((label, i) => (
        <Check key={label} label={label} delay={24 + i * gap} on={36 + i * gap} />
      ))}
    </div>
  </div>
  );
};

/** One big number stepping through values (before → after), old values crossed out. */
export type StepsProps = {
  tag?: string;
  values: number[];
  prefix?: string;
  suffix?: string;
  footer?: string;
  /** Frames between steps. */
  gap?: number;
};
export const Steps: React.FC<StepsProps & Fit> = ({ tag, values, prefix = "", suffix = "", footer, gap: want = 40, dur }) => {
  const gap = fitGap(want, 0, values.length - 1 + (footer ? 1 : 0), dur, 40);
  const frame = useCurrentFrame();
  const idx = Math.min(values.length - 1, Math.max(0, Math.floor(frame / gap)));
  const last = (values.length - 1) * gap;
  const land = usePop(last + 18, 9);
  const fmt = (v: number) => `${prefix}${v}${suffix}`;
  return (
    <div>
      {tag ? (
        <Pop>
          <Tag>{tag}</Tag>
        </Pop>
      ) : null}
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
          transform: `scale(${interpolate(land, [0, 1], [1, 1.08])})`,
          transformOrigin: "left center",
        }}
      >
        <Counter
          key={idx}
          from={values[Math.max(0, idx - 1)]}
          to={values[idx]}
          dur={22}
          delay={idx * gap}
          decimals={values[idx] % 1 ? 2 : 0}
          prefix={prefix}
        />
        {suffix}
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 70, flexWrap: "wrap" }}>
        {values.map((v, i) => (
          <Pop key={i} delay={i * gap} from="scale">
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
              {fmt(v)}
            </div>
          </Pop>
        ))}
      </div>
      {footer ? (
        <Pop delay={last + 20} style={{ marginTop: 80 }}>
          <Headline size={80}>
            <Rich text={footer} />
          </Headline>
        </Pop>
      ) : null}
    </div>
  );
};

/** Call to action: lead line, tilted pulsing badge, tail line. */
export type CtaProps = { lead: string; badge: string; tail?: string };
export const Cta: React.FC<CtaProps> = ({ lead, badge, tail }) => {
  const pulse = 1 + Math.sin(useCurrentFrame() / 6) * 0.025;
  return (
    <div>
      <Pop>
        <Headline>
          <Rich text={lead} />
        </Headline>
      </Pop>
      <Pop delay={8} from="scale" style={{ marginTop: 40 }}>
        <div
          style={{
            display: "inline-block",
            background: C.yellow,
            color: C.ink,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: badge.length > 10 ? 120 : 170,
            letterSpacing: -6,
            padding: "20px 56px",
            borderRadius: 48,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            transform: `scale(${pulse}) rotate(-3deg)`,
          }}
        >
          {badge}
        </div>
      </Pop>
      {tail ? (
        <Pop delay={24} style={{ marginTop: 70 }}>
          <Headline size={84}>
            <Rich text={tail} />
          </Headline>
        </Pop>
      ) : null}
    </div>
  );
};

/** Plain statement: up to three lines that pop in one after another. */
export type StatementProps = { lines: string[]; tag?: string; size?: number; gap?: number };
export const Statement: React.FC<StatementProps & Fit> = ({ lines, tag, size = 140, gap: want = 20, dur }) => {
  const gap = fitGap(want, 6, lines.length - 1, dur);
  return (
  <div>
    {tag ? (
      <Pop>
        <Tag>{tag}</Tag>
      </Pop>
    ) : null}
    <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: tag ? 60 : 0 }}>
      {lines.map((l, i) => (
        <Pop key={i} delay={6 + i * gap}>
          <Headline size={size}>
            <Rich text={l} />
          </Headline>
        </Pop>
      ))}
    </div>
  </div>
  );
};

export const SCENE_TYPES = {
  stat: Stat,
  numberTitle: NumberTitle,
  cards: Cards,
  question: Question,
  checklist: Checklist,
  steps: Steps,
  cta: Cta,
  statement: Statement,
};
