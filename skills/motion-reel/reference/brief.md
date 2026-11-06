# Brief template

Fill this in with the user before planning, and save it as `motion/brief.md`. Every field the user leaves blank gets the default in brackets. The brief is the contract: the plan, the copy and the lint all check against it.

```markdown
# <Product or campaign> reel

## The reel
- Kind: <product launch | data story | kinetic type | explainer | showreel>
- Length: <seconds> [20s]
- Format: <1920×1080 | 1080×1920 | 1080×1080> at <fps> [1920×1080, 60fps]
- Where it runs: <launch post, site hero, ad, event screen…> (sets pacing and whether it must work muted)

## The message
- One sentence the viewer should leave with: <…>
- Hook (first 2 beats): <the problem, the surprise, or the product's name>
- Call to action: <button words> → <where it goes> (shown for the last 4+ beats)

## Brand (locked)
- Canvas: <#hex>   Ink: <#hex>   Accent: <#hex>
- Neutrals: <#hex white>, <#hex muted text>, <#hex hairlines>
- Display font: <name> (<file in inputs/>), weight <600>
- Body font: <name> (<file in inputs/>), weight <400>
- Logo: <inputs/logo.svg | none>
- Voice: <e.g. short, plain, confident; full stops; no exclamation marks>
- Never: <anything the brand forbids: a colour, a word, a competitor's name>

## Music
- Track: <inputs/track.mp3 | none, cut to <bpm> bpm> [120 bpm, silent]
- Rights: <the user confirms they can use it>
- Start at: <first downbeat | the drop at m:ss>

## Facts (the only things that may appear as numbers, names or quotes)
- <real metric with its source, e.g. "3× faster first reply, internal study, Q3">
- <feature names, exactly as the product spells them>
- <customer names or logos they have permission to show>

## Real objects to recreate
- <screenshots in inputs/: which screen, which state, which element matters>

## Avoid
- <lines, visuals or claims to leave out>
```

## How the brief drives the plan

- **Kind** picks the recipe in `library.md`.
- **Hook, message and CTA** are the first, middle and last scenes. Everything else earns its place or goes.
- **Brand** becomes `brand.json` word for word. Nothing outside it appears on screen.
- **Music** sets the beat; the scene lengths in the plan are in beats, not seconds.
- **Facts** are the only numbers. Bars without facts are relative and are listed as illustrative in `reel.json` notes.
