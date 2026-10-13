// The only file to edit per video. One entry per scene, in order.
// `sec` = how long the scene stays on screen. `bg` = its section colour.
// Words go in exactly as the creator wrote or said them; *stars* highlight a word.
import type { BgName } from "./kit";
import type {
  CardsProps,
  ChecklistProps,
  CtaProps,
  NumberTitleProps,
  QuestionProps,
  StatProps,
  StatementProps,
  StepsProps,
} from "./scenes";

type Base = { sec: number; bg: BgName };
export type Scene = Base &
  (
    | ({ type: "stat" } & StatProps)
    | ({ type: "numberTitle" } & NumberTitleProps)
    | ({ type: "cards" } & CardsProps)
    | ({ type: "question" } & QuestionProps)
    | ({ type: "checklist" } & ChecklistProps)
    | ({ type: "steps" } & StepsProps)
    | ({ type: "cta" } & CtaProps)
    | ({ type: "statement" } & StatementProps)
  );

export const FPS = 30;

// Example: the "157 dollars to 3.58, from one sentence" Short. Replace with the new script.
export const SCENES: Scene[] = [
  {
    type: "stat",
    bg: "coral",
    sec: 4,
    tag: "The 157 dollar customer",
    value: 157,
    prefix: "$",
    line: "to get *one* customer.",
  },
  {
    type: "cards",
    bg: "blue",
    sec: 7.5,
    title: "Three *fixes.*",
    cards: [
      { kicker: "FIX 1", label: "New creative", note: "did not move it", value: "$157" },
      { kicker: "FIX 2", label: "Cheaper agency", note: "brought it to", value: "$120" },
      { kicker: "FIX 3", label: "More budget", note: "pushed it to", value: "$198" },
    ],
    footer: "Same customer, more money",
  },
  {
    type: "question",
    bg: "purple",
    sec: 5.5,
    headline: "The ads were never the problem.",
    underline: "never",
    tag: "The only question that matters",
    question: "What does the customer actually get?",
  },
  {
    type: "checklist",
    bg: "amber",
    sec: 5,
    headline: "So they changed *one sentence.*",
    items: ["Same product", "Same audience", "Same budget"],
  },
  {
    type: "steps",
    bg: "green",
    sec: 6,
    tag: "Cost per customer",
    values: [157, 42, 18, 3.58],
    prefix: "$",
    footer: "From *one sentence.*",
  },
  {
    type: "cta",
    bg: "teal",
    sec: 4,
    lead: "Comment",
    badge: "WIN-WIN",
    tail: "and I will send you *the book.*",
  },
];
