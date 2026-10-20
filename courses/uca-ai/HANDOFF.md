# UCA AI course: handoff

Read this first in a new session. It says what exists, how it was built, and what is left.

## The course

- **What:** a 6-day intensive AI course, in English, for students at Université Côte d'Azur (Cannes campus).
- **Trainer:** Fadi Fouladgar.
- **Thread:** Fadi's **ODS framework**: **O**bjective, **D**ata, **S**kill. ODS is a framework, not the file format.
- **Plan:** `program/UCA_Cannes_AI_6_days_program.ods`, built by `program/build.py`. The script writes `uca_ai_6days.xlsx`, which was then converted to .ods. It has 52 sessions (42 hours) with the content, exercise, tools and notes for each.
- **Source material:** Fadi's French Simplon "AI Jump" decks, in OneDrive at `Desktop/Cosens couveuse Creative 06/Simplon formation IA`. There are 10 decks, numbered 01–10 (for example "09 Explorer le potentiel de l'IA pour transformer.pptx"). The text of all 746 slides is in `sources/simplon_decks_text.json`, as `{deck, slide, pics, text}`.

## Status

| Day | Theme | Deck |
|---|---|---|
| 1 | Where AI comes from and how it "thinks" | **Done**: `day1/UCA_AI_Day1.pptx`, 63 slides, 296 clicks |
| 2 | Personalise and communicate: from prompts to the master prompt | To build |
| 3 | Reuse and reliability: bots, skills, scheduled tasks and RAG | To build |
| 4 | AI inside your tools, and media production | To build |
| 5 | Branding, free tools, agents and building | To build |
| 6 | Capstone project and pitch | Probably no full deck: sprints and pitches. Confirm with Fadi; at most a short brief with the rules and evaluation grid. |

**Next step:** build the decks for Days 2–5, one at a time. Show Fadi each deck and get his feedback before starting the next.

## How the decks are built

The decks use the **click-deck** skill in this repo, at `skills/click-deck/`. Read its `SKILL.md` and `reference/slides.md`.

- **Format:** 16:9 PowerPoint (.pptx). Every point appears on the presenter's click, as a native PowerPoint animation. The tag and title play by themselves when the slide arrives.
- **Look:** bold gradient backgrounds, rounded cards, Arial.
- **Speaker notes:** each slide has `notes:`. The kit adds a line for each click automatically.

Build and check a deck:

```bash
cd courses/uca-ai/day1
cp -r ../../../skills/click-deck/engine ./engine && (cd engine && npm install)
node deck.js                    # fix every WARN line it prints
python3 ../../../skills/click-deck/scripts/check.py UCA_AI_Day1.pptx            # every element animated
bash ../../../skills/click-deck/scripts/render.sh UCA_AI_Day1.pptx   # LibreOffice render, then look at it
```

### Slide types

- **Original types:** cover, stat, cards, question, checklist, steps, mystery, pair, contrast, points, statement, close, gallery, picture, nested, decompose, colorText.
- **Added this round:**
  - **columns:** category headers, then each item on its own click.
  - **grid:** up to 12 cards, with an optional answer reveal.
  - **gallery answers:** a quiz; ask first, then reveal all answers on one click.
  - **quotes**, **logos** (a logo wall) and **profile** (a "who I am" slide).
  - **tokens:** colour-coded tokenizer rows.
  - **vectors:** words → tokens → numbers.
  - **points:** now takes up to 8 items and clickable links.
- **Hermes copy:** the Hermes Agent edition of the skill is in `hermes-skills/click-deck`. Keep it in sync with `python3 scripts/sync_hermes.py` (use `--check` to verify).

### Fadi's preferences (from his feedback on Day 1)

- **Animation:** every point on its own click, on every slide. Later slides must not have less animation than early ones.
- **Visuals:** use pictures, logos and his own images from the Simplon decks. He liked the colour-coded prompt breakdown, the neuron images, the classification slides, the prompt generators, the AI-vision slides and the case studies.
- **Keep it simple.** Day 1 v1 was "too complicated even for me". Build from **his** decks and wording, translated into English.
- **Speaker notes:** clear, not too long, but enough points that he knows what to say. Explain every term; he didn't understand the earlier note "AI winters: promises beat the computers".
- **Lists:** when a slide has categories with sub-items, show the box first, then each sub-item on its own click.
- **Quizzes:** don't show the answers straight away. Reveal them all on one click, after the students have answered.
- **Exercises:** precise numbered instructions. Show visually what students can choose from.
- **Facts:** real and sourced. Verify quotes and figures with a web search, put the source in the notes, and never invent numbers.
- **Openings:** a "who I am" slide (from his CV) and a "present yourself" round on Day 1.

## Assets and how to get them

### Images

- **Day 1 images:** in `day1/img/`.
  - `b_*`: brand logos.
  - `q_*`: company logos for the quotes.
  - `l_*`: chat-tool logos.
  - `neuron_bio` / `neuron_art`: the neuron image cut in half.
- **Simplon deck images:** for other days, extract them from the original decks. Download the decks again (see OneDrive below), then take the images from `ppt/media` in each .pptx, or render the slides with LibreOffice.
- **Earlier image IDs (from deck 09):**
  - Logos on slide 81: Gemini, Copilot, ChatGPT, Claude, Perplexity, Grok, AI Studio, DeepSeek, Qwen.
  - Coloured prompt: slide 101.
  - Fadi's hacks and funnel: slide 106.
- **Avoid:** deck 01 slide 10 image 2 (Babbage). It carries an Alamy watermark.

### Brand logos

- **simple-icons** gives SVGs: `npm pack simple-icons@16.20.0`, then render with sharp.
- **Wikimedia** is blocked from this container. Fetch through the Composio workbench and download the result locally.

### OneDrive (through Composio)

- Two accounts are connected. Fadi's files are on **`one_drive_unbell-nopal`**.
- Find files with `ONE_DRIVE_SEARCH_ITEMS`. `ONE_DRIVE_DOWNLOAD_FILE` returns a signed `r2.cloudflarestorage.com` URL, which `curl` can download locally.
- **Privacy:** do not open payslips, contracts, ID documents or the trainer application form. The form contains a social-security number.

### Other notes

- **Network:** YouTube, Wikimedia, jsDelivr and backend.composio.dev are blocked here. Real tokenizer downloads (tiktoken) are also blocked, so use Fadi's screenshots or `https://platform.openai.com/tokenizer`.
- **Feedback screenshots:** the images Fadi sent with his Day 1 feedback are in `sources/feedback-images/`: generative AI uses, the 3 families, Marseille tokens, and the chien/croquettes vectors.

## Day 1: what's in it

The deck follows this order:

1. Cover.
2. Today's journey.
3. Who I am, and the logo wall.
4. Present yourself.
5. What AI leaders say: 6 sourced quotes.
6. Hopes and fears.
7. AI in one sentence, then "Is that really intelligence?"
8. AI in your life, and the AI hunt.
9. History, with a clearer 2017 Transformers card.
10. Nested technologies (AI, ML, DL, generative AI).
11. Neurons on separate clicks.
12. The 150M synapses slide, then brain vs AI (a big AI ≈ a sugar cube of brain).
13. The 4 ways people use generative AI, and the 4 families of use (Action added).
14. Before ChatGPT.
15. The 12-example sorting exercise, with the answer reveal.
16. Regression vs classification, and the quiz with the reveal.
17. Teachable Machine.
18. Vision and case studies, with a visual case picker.
19. Tokens and vectors.
20. Next-word prediction.
21. Classic vs reasoning models.
22. The chat tools: Le Chat with the Mistral logo, and Grok added.
23. Good vs bad prompts, the 3 essentials, and the 5 steps.
24. The colour-coded prompt.
25. Prompt structures.
26. Exercise: improve your last prompt.
27. Prompt generators.
28. Teaser: the prompting funnel.
29. Inside a mega prompt, and the master prompt generator.
30. Close.

Supporting file: `day1/master_prompt_generator.md`. It reverse-engineers the recruiting "mega prompt" (the ATS CV prompt) into a prompt that writes master prompts.

## Open items for Fadi

- **MBA:** the University of Brighton MBA (2001) is on his trainer application but not on his CV. He will add it himself.
- **Recruiting mega prompt:** the one used is the ATS CV prompt from his "Devoir rendu" folder. It may be a student's work. Confirm it's the right one.
- **Tokens:** check the English row on the tokens slide live ("Hello, how are you?" = 6 tokens). That figure is estimated; the French rows come from his screenshot.
- **Rehearsal:** play each deck once in real PowerPoint (F5). They are checked by script and LibreOffice render only.

## Day-by-day content to build next

The full session list, exercises and tools for each day are in `program/build.py`, in the `S` list (one tuple per session: day, half, hours, module, content, exercise, tools, notes). In short:

- **Day 2: personalise and communicate.** The full topic list:
  - Recap quiz.
  - Personalising your LLM: the account level (custom instructions, memory), then the project level (Projects, Gems, custom GPTs).
  - API and MCP (the waiter analogy) and connectors.
  - The ODS framework.
  - The funnel method. This is Fadi's technique: who is the best at X → their method → break it down → apply it to me.
  - Prompt structures, and the prompt generator.
  - References and templates.
  - The master prompt: test it, version it, store it.
  - Responsible and ecological use, GDPR, and a shared class library of master prompts.

  Reuse `day1/master_prompt_generator.md`.
- **Day 3: reuse and reliability.**
  - Bots and skills.
  - Build a "PhD expert", plus book-to-skill and course-to-skill.
  - Scheduled tasks.
  - Why AI makes mistakes, and RAG explained.
  - NotebookLM hands-on, then RAG vs plain chat.
- **Day 4: AI in your tools, and media.**
  - Copilot in Microsoft 365 (Excel, Word, PowerPoint).
  - Gemini in Workspace, and from research to a pitch deck.
  - The media map.
  - Images: generation and editing, including the ChatGPT slash commands.
  - Video (Flow/Veo, Runway, HeyGen).
  - Audio and voice (ElevenLabs, VibeVoice), and a mini campaign.
- **Day 5: branding, free tools, agents and building.**
  - Teaching AI your brand (Claude Design, Pomelli), and vision boards (Mixboard, Stitch).
  - Free tools: Wispr Flow, Opal, AI Studio, Learn Your Way.
  - Agentic AI, and agents with real tools (Claude Code/Cowork, Codex, MCP).
  - Motion graphics by code (Remotion, HyperFrames). The `remotion-shorts` skill is in this repo.
  - GitHub skills, and Obsidian memory.
  - Hermes.
  - Vibe-coding a pitch page.
- **Day 6: capstone.** Teams, an ODS canvas, two build sprints, 10-minute pitches scored on ODS, then the final quiz (the same as the Day 1 quiz).

## Other things built in this repo

- **`samples/one-sentence`:** a Remotion sample, from an analysis of a YouTube motion-graphics video (Tristen O'Brien).
- **`skills/remotion-shorts`:** a skill for vertical Shorts in that style.
- **`skills/click-deck`:** the deck skill. It includes the `examples/win-win` deck (11 slides, 43 clicks), which serves as a regression test.
- **`hermes-skills/click-deck`:** the Hermes edition of the skill. Fadi's Hermes profile is **Disme**, with skills in `~/.hermes/profiles/disme/skills/`.
