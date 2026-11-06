# Reel recipes

Start from the closest recipe, not a blank prompt. A vague ask ("make a motion video") gets the generic result: a default font, a purple gradient, a glow and a card sliding in from the left. A recipe gives you a structure that already works, and you fit it to the brief in three ways:

1. **Brand**: colours, fonts and voice from `brand.json`. Nothing else.
2. **Real objects**: the user's product, screens, data and words, taken from the brief, in place of the placeholders.
3. **The track**: scene lengths re-timed to the music's phrases (keep whole bars: 4, 8, 12, 16 beats).

Beat counts below assume 4/4 at about 120 bpm (one beat = 0.5s). At faster tempos, double the beats per scene; at slower ones, halve them.

Each recipe gives its **structure** (scenes, in beats), the **shape's journey** (the one-shape states inside each scene), and a **direction** to keep in mind while you build it.

---

## Product launch

### L1 · Problem → product → proof → CTA (20s, 40 beats)
The default launch reel. `examples/launch-reel/` is this recipe.
- **Hook, 8 beats**: a pill flips through the pain on each beat (four tools, four tabs, four steps), then morphs into a card that names it, then into the answer in two words.
- **Product, 12 beats**: the card becomes the product's main screen. Content lands on the beat, the cursor does the one thing the product is for, and the scene ends on the result (a check, a toast, a status).
- **Proof, 8 beats**: a chart or comparison built from the brief's facts. Without facts, relative bars that are labelled illustrative.
- **Kinetic line, 6 beats**: three verbs, one per 2 beats, with an underline that rides each.
- **CTA, 6 beats**: logo pill → card with the tagline and the button; the cursor clicks it.
- *Direction*: the product scene is the reel. Give it the most beats and the most real UI.

### L2 · Feature drop (15s, 32 beats)
One new feature, shown working.
- **Name, 4 beats**: a "New" badge pops on a pill with the feature's name.
- **Before, 8 beats**: the old way, compressed: three steps, one per 2 beats, a little cramped on purpose.
- **After, 12 beats**: the same task with the feature: one click, the result springs in.
- **CTA, 8 beats**: "Available today" + button.
- *Direction*: before and after use the same shape and the same camera, so the difference reads as the feature, not as a new layout.

### L3 · Changelog roll (20–30s)
Several small updates, one per scene.
- **Title, 4 beats**: "What's new in <month>".
- **One scene per update, 4–8 beats**: a pill names the update and morphs into the smallest UI that shows it (a toggle, a new button, a faster bar).
- **CTA, 4 beats.**
- *Direction*: keep each update's shape in the same position, so the eye stays put while the content swaps. Cut on downbeats.

### L4 · Integration (12s, 24 beats)
Product + another tool working together.
- **Two pills, 8 beats**: your logo mark and the partner's name (text, not their logo unless the user has permission) slide together and merge.
- **Flow, 12 beats**: a file, row or event drags from one side to the other and lands as a result.
- **CTA, 4 beats.**
- *Direction*: one drag across the frame carries the whole idea. Time the drop on a downbeat.

### L5 · Waitlist / teaser (8–10s)
Not showing the product yet.
- **Tease, 8 beats**: kinetic type, one word per beat, building the promise.
- **Reveal, 4–8 beats**: the logo pill, a date if the brief has one, the button "Join the waitlist".
- *Direction*: restraint. Canvas, ink and one accent moment on the reveal.

---

## Data and charts

### D1 · One number (10s, 20 beats)
For a single real metric from the brief.
- **Setup, 8 beats**: the question as kinetic type ("How long does a first reply take?").
- **Count, 8 beats**: a card; the number counts up with `R.count` to the real figure, landing on a downbeat, with its unit and its source in small type.
- **Sign-off, 4 beats**: the logo.
- *Direction*: one number, very large. The source line is required.

### D2 · Before / after bars (8–12 beats inside a reel)
- The first bar grows on beat 1, the second on beat 2 to the same length, then on beat 3 it stretches past (leading edge `M.FAST`, trailing `M.SLOW`) with a small kick.
- A tooltip pill lands at the end of the winning bar on beat 5.
- Without facts: no axis, no numbers, "illustrative" in the subtitle.
- *Direction*: example scene `03-proof.html`.

### D3 · Line that turns (16 beats)
- A line draws left to right over 8 beats (stroke-dashoffset from time), flat, then turns up at the moment the product arrives, marked by a dot and a label on a downbeat.
- *Direction*: the turn is the story. Put it on the strongest beat of the phrase.

---

## Kinetic type

### K1 · Three verbs (6–8 beats)
Three words on one line, each lit on its beat; an accent underline whose edges ride different springs moves under the active word. Example `04-kinetic.html`.

### K2 · Word per beat (8–16 beats)
A sentence revealed one word per beat with `R.words`, centred, in the display font at 120–150px. On the last word, the shape behind it changes colour (canvas → ink) on a downbeat and the text inverts.
- *Direction*: break the sentence where a speaker would breathe, and put the key word on a downbeat.

### K3 · Swap word (8 beats)
"Built for ___" with the blank cycling through audiences on each beat (`R.swap`) inside a pill that resizes to each word, ending on the product name in the accent colour.

### K4 · Scale contrast (8 beats)
One small line ("All your support") and one huge word ("one inbox") that scales in on a downbeat until it nearly fills the frame, then the camera pulls back to reveal it's on a card.

### K5 · Manifesto (20–30s)
A sequence of short lines, 4–8 beats each, alternating between text on the canvas and text in an ink shape. The CTA is the last line.
- *Direction*: no UI at all. Rhythm carries it, so cut only on downbeats.

### K6 · Typing prompt (8–12 beats)
A pill becomes a text field, a prompt types in (characters from time, caret blinking on the beat), Enter on a downbeat, and the field morphs into the answer.

---

## Explainer

### E1 · Three steps (20s, 40 beats)
- **Title, 4 beats**: "How <product> works".
- **Step 1–3, 10 beats each**: a numbered chip morphs into the step's UI, the cursor does the step, and it ends on that step's result. The next step's chip pops from the result.
- **CTA, 6 beats.**
- *Direction*: the shape carries over between steps inside one scene where it can; cut only between big ideas.

### E2 · Input → output (12 beats)
A file (or text, or a URL) drags into a drop target; a progress bar fills over 2 beats; the output card springs out.

### E3 · Before / after split (8 beats)
One shape split down the middle: the left half is the old way (muted), the right half is the new way (ink and accent). The divider slides on the beat.

### E4 · Zoom into detail (12 beats)
A full screen at a low camera zoom; on a downbeat the camera pushes in to one element (`cam` 1.0 → 2.2) and it becomes the shape that the rest of the scene is about.

### E5 · Status island (8 beats)
A small pill at the top shows live status ("Syncing", "3 new", "Done") and stretches with each state, like a phone's island. Good for background work the product does.

### E6 · Comparison (12 beats)
Two cards side by side, attribute rows landing on beats, a check or a cross per row; the product's card wins and grows on the last downbeat. Only real attributes from the brief.

---

## Showreel

### S1 · Feature montage (15–30s)
One scene per feature, 4 beats each, hard cut on every downbeat. Each is a single state change: a toggle flips, a list filters, a chart's tooltip moves.
- *Direction*: keep every scene's shape at the same size and position so the cuts feel like one object changing.

### S2 · Screens carousel (16 beats)
Real product screenshots from `inputs/` in rounded cards with a white surround; the camera slides from one to the next on each downbeat, the current card scaling up slightly.

### S3 · Logo sting (4–8 beats)
The logo mark pops on beat 1, the wordmark wipes in on beat 2, and the tagline arrives on beat 3. Hold. Use at the start or end of any reel.

### S4 · Grid build (8 beats)
A 3×3 grid of small cards (features, integrations, use cases); one per half-beat pops in, then on the last downbeat the grid collapses into the logo pill.

### S5 · Loop (any length)
For a site hero or an event screen: the last state equals the first, using `M.track(..., period)` for seamless looping. No CTA button; the logo stays in a corner (`data-slot="screen"`).

### S6 · Social cutdown (6–10s, 1080×1920)
The L1 structure in about a third of the beats, re-laid out for vertical: text larger (it'll be watched small), the hook on frame 1, the CTA as text (no button to click on a phone feed).

---

## Writing the prompt for one scene

When you build a scene, describe it to yourself in this form before you write code. It keeps the scene on brief:

> **Scene NN, <name>, <beats> beats.** Starts as <state>, which <what it shows>. On beat <n> it morphs to <state> (<size>, <colour token>), and <content> lands on beats <…>. The cursor <moves, clicks or drags> on beat <n>. It ends on <final state>, held from beat <n>. Copy: "<exact words from the brief>". Accent used on: <one thing>. Illustrative: <anything without a fact behind it>.
