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
Clicks: 1 per item (max 8; 6–8 items use compact rows). Items take `url` for a clickable note.

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

## Slides with pictures and colour-coded prompts

Image paths are relative to `deck.js`; PNG and JPEG only. Pictures are fitted inside their box without cropping.

### gallery — 2–4 picture cards, one per click
Timelines, everyday uses, AI vision, case studies, tool logos. An item without `image` shows its `kicker` large (e.g. a year).
```js
deck.gallery({ bg: "purple", title: "From an idea to a *field*",
  items: [{ image: "img/turing.png", kicker: "1950", label: "Alan Turing", note: "\"Can machines think?\"" }, ...],
  footer: "…", stress: 3 });
```
Clicks: 1 per item, +1 footer. Labels shrink automatically until label and note fit.

### picture — one large image
With an optional `caption` pill and up to 4 `points` beside it (each on a click).
```js
deck.picture({ bg: "amber", title: "Inspired by the *brain*", image: "img/neuron.png", caption: "Biological vs artificial neuron" });
```

### nested — technologies inside each other
Concentric circles from outermost to innermost (max 4), each with an example card, one per click.
```js
deck.nested({ bg: "blue", title: "Technologies *inside each other*",
  rings: [{ label: "Artificial intelligence", example: "A classic chatbot: rules written by people" }, ...] });
```

### decompose — a prompt piece by piece
Each part (max 6) gets a coloured tag and a tinted row, one per click.
```js
const PROMPT = [{ tag: "Role", text: "You are an expert in marketing…", color: "FFE066" }, ...];
deck.decompose({ bg: "teal", title: "A good prompt, *piece by piece*", parts: PROMPT });
```

### colorText — the same prompt, assembled
The whole prompt with each part highlighted in its colour, then the legend chips one per click. Pair it with `decompose` using the same `parts`.
```js
deck.colorText({ bg: "blue", title: "The same prompt, *assembled*", parts: PROMPT });
```

## More slide types (lists, people, tokens)

### columns — categories, then their items one by one
Up to 4 coloured columns. Each header lands on a click, then each of its items on its own click. Item text shrinks (20 → 12pt) until every column fits.
```js
deck.columns({ bg: "teal", title: "How people use *generative AI*",
  columns: [{ title: "The Teacher", sub: "Learn", color: "7B3FBF", items: ["Explains", "Coaches"] }, ...] });
```

### grid — up to 12 small cards, with an optional answer reveal
Numbered cards (or picture cards when items have `image`). `by`: `"item"` (one per click, default), `"row"` or `"all"`. Items with `answer` (and optional `answerColor`) get the answers on one last click: ask first, reveal later.
```js
deck.grid({ bg: "blue", title: "12 examples: *which circle?*", by: "row",
  items: [{ label: "Gmail spam filter", answer: "Machine learning", answerColor: "74C0FC" }, ...] });
```

### gallery answers
`gallery` items also take `answer`: all answers land together on one click after the cards (a quiz). Galleries now take up to 5 items.

### quotes — who said what
Up to 6 quote cards (3×2), one per click: `logo`, `quote`, `who`, `role`, and an optional corner `mark` ("+", "!", "?") with `markColor`. Use real, sourced quotes only; put the source in the notes.

### logos — a wall of brands
White tiles, a row per click (tiles pop one after another). Items: `{ image }`, or `{ text, color }` for a brand with no picture. Optional `footer`.

### profile — who I am
A dark ID card (`name`, `role`, `lines`), up to 4 stat tiles (`facts: [{ big, small }]`, one per click), then a yellow `wide` card (`{ label, lines }`, e.g. diplomas).

### tokens — text cut into tokens
One tokenizer panel per click, each token highlighted in its own colour, with the token and character counts. `rows: [{ label, tokens: ["ici", " c", "'est", " Marseille"] }]` (keep the spaces inside the tokens). Optional `link: { text, url }`, clickable in slide show. Use real tokenizer output only.

### vectors — from words to numbers
The sentence, its tokens (one click), then each token's vector (one per click). `rows: [{ token, vector: "[67, -78, …]" }]`. Say in the notes when the numbers are illustrative.

### Links and long lists in points
`points` items take `url` (the note becomes a clickable link). Lists of 6–8 items switch to compact rows with the note on the same line.
