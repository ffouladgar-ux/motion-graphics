import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BG, Background, C, DiagonalWipe, Fonts } from "./kit";
import { SCENE_TYPES } from "./scenes";
import { FPS, SCENES } from "./content";

const WIPE = 14;
const frames = SCENES.map((s) => Math.round(s.sec * FPS));
export const TOTAL = frames.reduce((a, b) => a + b, 0);

export const Video: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Fonts />
      {SCENES.map((s, i) => {
        const from = at;
        const dur = frames[i];
        at += dur;
        const next = SCENES[i + 1];
        const { type, bg, sec: _sec, ...props } = s;
        const Comp = SCENE_TYPES[type] as React.FC<typeof props & { dur: number }>;
        return (
          <React.Fragment key={i}>
            <Sequence from={from} durationInFrames={dur} name={`${i + 1} ${type}`}>
              <Background name={bg} />
              {/* Centered, kept clear of the Shorts/Reels caption and buttons at the bottom. */}
              <AbsoluteFill style={{ padding: "200px 80px 380px", justifyContent: "center" }}>
                <Comp {...props} dur={dur} />
              </AbsoluteFill>
            </Sequence>
            {next ? (
              <Sequence from={at - WIPE / 2} durationInFrames={WIPE} name="wipe">
                <DiagonalWipe color={BG[next.bg][0]} dur={WIPE} />
              </Sequence>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
