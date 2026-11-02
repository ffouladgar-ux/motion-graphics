# Scene types

Every scene takes `type`, `bg` and `sec`. `bg` is one of `coral`, `blue`, `purple`, `amber`, `green`, `teal`.
Text fields accept `*stars*` around one word to highlight it.
"Needs" is the time the animation takes to land. Give the scene at least that much plus time to read.
`cards`, `checklist`, `steps` and `statement` squeeze their item spacing to fit a short scene, so a voice-timed scene never cuts off its last item, but squeezed items arrive faster than the words. When that happens, give the scene more time or split it.

## stat — the opening number
A tag, a big number counting up, one line under it. Use it for a hook built on a figure ("157 dollars to get one customer").
```ts
{ type: "stat", bg: "coral", sec: 4, tag: "The 157 dollar customer", value: 157, prefix: "$", line: "to get *one* customer." }
```
Fields: `value`, `prefix?`, `suffix?` ("%", "x"), `decimals?`, `tag?`, `line?`. Needs ~1.5 s.

## statement — words on their own
Up to three lines popping in one after another. Use it only when nothing more active fits: a claim, a turn ("It is not price. It is not quality.").
```ts
{ type: "statement", bg: "purple", sec: 4, lines: ["It is not *price.*", "It is not *quality.*"], tag: "Why the worse product wins" }
```
Fields: `lines` (≤3, short), `tag?`, `size?` (default 140; use 110 for lines over ~14 characters, 90 over ~22), `gap?` (frames between lines, default 20). Needs ~1 s + 0.7 s per line.

## numberTitle — a numbered part of a series
A tag, a yellow tile with a number, a title that types itself in. Use it for listicles ("Tip 03", "Mod 02").
```ts
{ type: "numberTitle", bg: "blue", sec: 3, tag: "Mistake number two", kicker: "MISTAKE", number: "02", title: "Discounting" }
```
Needs ~1 s + title length ÷ 18 s.

## cards — options, attempts, steps
A headline, then cards dropping in one by one, each with an optional kicker, label, note and value. Use it for any list of 2–4 things said in sequence: three fixes tried, three drills on a shelf, three prices.
```ts
{ type: "cards", bg: "blue", sec: 7.5, title: "Three *fixes.*",
  cards: [{ kicker: "FIX 1", label: "New creative", note: "did not move it", value: "$157" }, ...],
  footer: "Same customer, more money", gap: 42 }
```
Keep labels under ~16 characters and values under ~5. Needs 0.6 s + `gap` × cards + 1 s for the footer.

## question — the question that matters
A statement with one word underlined, an optional tag, then a question typing into a dark card. Use it when the script turns on a question.
```ts
{ type: "question", bg: "purple", sec: 5.5, headline: "The ads were never the problem.", underline: "never",
  tag: "The only question that matters", question: "What does the customer actually get?" }
```
`underline` must appear in `headline` exactly. Needs ~2.4 s + question length ÷ 20 s.

## checklist — things that stay the same, or get done
A headline, then rows sliding in and ticking. Use it for "same product, same audience, same budget", requirements, or steps completed.
```ts
{ type: "checklist", bg: "amber", sec: 5, headline: "So they changed *one sentence.*", items: ["Same product", "Same audience", "Same budget"] }
```
On light backgrounds (`amber`) keep the default dark headline; on darker ones set `dark: false`. `gap` = frames between rows (default 22). Needs ~1.2 s + 0.75 s per item.

## steps — before → after numbers
One big number stepping through values, with the old ones crossed out in a row of chips. Use it for results and for anything that changed over time.
```ts
{ type: "steps", bg: "green", sec: 6, tag: "Cost per customer", values: [157, 42, 18, 3.58], prefix: "$", footer: "From *one sentence.*" }
```
Only use values the creator gave, and make sure the tag says what they measure. Needs (`values` − 1) × `gap`/30 s + 1.5 s.

## cta — the call to action
A lead line, a tilted pulsing badge, a tail line. Use the creator's exact CTA wording and keyword.
```ts
{ type: "cta", bg: "teal", sec: 4, lead: "Comment", badge: "WIN-WIN", tail: "and I will send you *the book.*" }
```
Badges over 10 characters shrink automatically. Needs ~1.5 s.
