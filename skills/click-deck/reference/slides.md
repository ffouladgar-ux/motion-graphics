# Slide types

Every slide type takes `bg` (`coral`, `blue`, `purple`, `amber`, `green`, `teal`) and optional `notes` (what you say before the first click).
Text accepts `*stars*` around words to highlight. "Clicks" counts the presenter's clicks; the tag and title play as the slide arrives.

## cover — the opening
Tag + headline arrive with the slide. Then two cards get crossed out one by one (what it is *not*), the real answer lands in yellow and pulses, and a subline comes last.
```js
deck.cover({ bg: "coral", tag: "Win-Win", headline: "Why the *worse product* keeps winning",
  crossed: [{ label: "Price", note: "It is not price." }, { label: "Quality", note: "It is not quality." }],
  answer: { label: "The transformation", note: "your product really gives them" },
  sub: "People buy the transformation your product really gives them." });
```
Clicks: 1 per crossed card (max 2), +1 answer, +1 sub. Headline ≤ ~40 characters.

## stat — one big number
```js
deck.stat({ bg: "coral", tag: "The 157 dollar customer", value: "$157", line: "to get *one* customer." });
```
Clicks: the number, then the line (the number pulses). Values over 5 characters get a smaller size.

## cards — options, attempts, steps (2–4)
Title, then one card per click, then a yellow footer pill; `stress` (card index) pulses as the footer lands.
```js
deck.cards({ bg: "blue", title: "Three *fixes.*",
  cards: [{ kicker: "FIX 1", label: "New creative", note: "did not move it", value: "$157" }, ...],
  footer: "Same customer, more money", stress: 2 });
```
Clicks: 1 per card, +1 footer. Labels ≤ ~16 characters, values ≤ ~5.

## question — the question that matters
Title with one word underlined (measured, so it sits exactly under the word), a tag, then a dark card the question types into letter by letter.
```js
deck.question({ bg: "purple", title: "The ads were never the problem.", underline: "never",
  tag: "The only question that matters", question: "What does the customer actually get?" });
```
Clicks: underline, tag, question. The title must fit on one line for the underline.

## checklist — same / done / what they get
Optional lead line, ticked rows (one per click), and an optional dark side card that lands last and pulses.
`side: { big: "1", small: "sentence changed" }` shows a huge number; `side: { big: "The drill is just the tool." }` shows a sentence.
```js
deck.checklist({ bg: "amber", title: "So they changed *one sentence.*",
  items: ["Same product", "Same audience", "Same budget"], side: { big: "1", small: "sentence changed" } });
```
Clicks: lead, 1 per item (max 5), side. Items ≤ ~24 characters.

## steps — before → after numbers
One big number that swaps on each click, old values crossed out in a chip row, footer last (the final number pulses).
```js
deck.steps({ bg: "green", tag: "Cost per customer", values: ["$157", "$42", "$18", "$3.58"], footer: "From *one sentence.*" });
```
Clicks: 1 per value (max 6), +1 footer. Only values the person gave, and a tag that says what they measure. In Normal view and PDF the numbers overlap (they swap in the show).

## mystery — unknowns, the options someone is staring at
Dark "?" cards, one per click, then a footer pill as they all pulse. `symbol` changes the "?".
```js
deck.mystery({ bg: "blue", title: "Picture a man staring at *three drills.*", labels: ["Drill 1", "Drill 2", "Drill 3"],
  footer: "He is not reading the boxes" });
```
Clicks: 1 per card (max 4), +1 footer.

## pair — what it looks like vs. what it really is
A light card (the surface answer), a line, then a dark card (the real answer) that pulses. In `left.text`, stars highlight in red; in `right.text`, in yellow.
```js
deck.pair({ bg: "purple", title: "Nobody buys a ride *in the taxi.*",
  left: { kicker: "They are buying", text: "a ride home." },
  line: "Nobody buys your service for the service.",
  right: { text: "They are buying the *identity* you hand them." } });
```
Clicks: left, line, right. `left.text` ≤ ~22 characters, `right.text` ≤ ~60.

## contrast — the wrong move, crossed out, then the right move
A dark tile (a moment, a number), the wrong move, a red ✕ on its own click, then the right move in yellow, pulsing.
```js
deck.contrast({ bg: "coral", title: "Someone asks *your price.*", tile: { big: "2s", small: "They go quiet." },
  wrong: { kicker: "What most people do", text: "Fill the silence with a *discount.*" },
  right: { kicker: "Instead", text: "Fill the pause with the transformation and the discount never comes up." } });
```
Clicks: tile, wrong, ✕, right.

## points — a numbered list
Rows with a yellow number tile (01, 02…) and an optional grey note, one per click. The workhorse for agendas, steps and takeaways.
```js
deck.points({ bg: "teal", title: "How the *bootcamp* works",
  items: [{ label: "Pick one task", note: "the one you repeat every week" }, "Write the prompt", "Hand it over"] });
```
Clicks: 1 per item (max 5).

## statement — words on their own
Up to three lines, one per click. Use it only when nothing more active fits: a claim, a turn, a quote.
```js
deck.statement({ bg: "purple", tag: "Remember", lines: ["It is not *price.*", "It is not *quality.*"] });
```
Clicks: 1 per line. `size` defaults to 64pt.

## close — the ending
Title, a lead line, chips (one per click), then a big tilted badge that lands and pulses.
```js
deck.close({ bg: "teal", title: "Name the transformation *they are buying.*", lead: "Then make it show in",
  chips: ["every page", "every price", "every word"], badge: "WIN-WIN" });
```
Clicks: lead, 1 per chip (max 4), badge.
