# UCA AI course: complete handoff

This document lets someone with no access to the original chat carry on exactly where it stopped. It covers:

- the course plan,
- the finished Day 1 deck,
- every rule and preference Fadi gave,
- and what is left for Days 2 to 5.

Visual style is not repeated here: colours, fonts and animation effects live in Fadi's click-deck skill. Design choices made in the chat that are **not** in the skill are in section 4.

Last updated: 2 November 2026.

---

## 0. Read this first

**Who and what**
- **Trainer:** Fadi Fouladgar.
- **Course:** an intensive AI course in **English** for students at **Université Côte d'Azur (UCA), Cannes campus**.
- **Source material:** Fadi's French "AI Jump" training decks from Simplon.
- **Thread through the course:** Fadi's **ODS framework**: **O**bjective, **D**ata, **S**kill. "ODS" is his framework, not the spreadsheet file format.

**Status**
- **Day 1** is finished: `day1/UCA_AI_Day1.pptx` has 63 slides and 296 clicks.
- **Days 2–5** have a detailed session plan but no slides. Section 1 has a proposed slide-by-slide outline for each; Fadi has not approved them.

**Decided (2 Nov 2026): the course is now five days.** The approved plan had 6 days of 7 hours; Fadi confirmed it is now 5. Day 6 (capstone) is dropped as a separate day; the final repeat of the positioning quiz moves to the end of Day 5. How much of the capstone (if any) moves into Day 5 is still open. Day 6 stays at the end of section 1 for reference only.

**Where everything is.** All paths are relative to the root of the GitHub repo `ffouladgar-ux/motion-graphics`, on branch `ccr-45c0e68b-hc56dd`:

| Path | What |
|---|---|
| `courses/uca-ai/HANDOFF.md` | This document |
| `courses/uca-ai/program/UCA_Cannes_AI_6_days_program.ods` | The approved 6-day plan, as a spreadsheet: 52 sessions with content, exercise, tools and notes for each |
| `courses/uca-ai/program/build.py` | The script that writes that plan. The `S` list has one row per session: day, am/pm, hours, module, content, exercise, tools, notes. `TOOLS` and `CHECKS` hold the tool list and the things to verify. It writes `uca_ai_6days.xlsx`, which was converted to `.ods`. |
| `courses/uca-ai/day1/deck.js` | Source of the Day 1 deck: every slide, its text and its speaker notes |
| `courses/uca-ai/day1/UCA_AI_Day1.pptx` | The Day 1 deck |
| `courses/uca-ai/day1/img/` | All Day 1 images: logos, photos from Fadi's decks, the neuron halves |
| `courses/uca-ai/day1/master_prompt_generator.md` | Handout: a prompt that writes master prompts, reverse-engineered from the recruiting mega prompt |
| `courses/uca-ai/sources/simplon_decks_text.json` | Text of all 746 slides of Fadi's 10 Simplon decks, as `{deck, slide, pics, text}`. Searchable; section 1 cites slides as `deck#slide`, e.g. `09#106`. |
| `courses/uca-ai/sources/feedback-images/` | The 4 screenshots Fadi sent with his Day 1 feedback (generative AI uses, 3 families, Marseille tokens, chien/croquettes vectors) |
| `skills/click-deck/` | The deck-building skill: engine, docs, checks |
| `hermes-skills/click-deck/` | The same skill for Hermes Agent. Fadi's Hermes profile is **Disme**, with skills in `~/.hermes/profiles/disme/skills/`. |

**Original Simplon decks.** Fadi's OneDrive, folder `Desktop/Cosens couveuse Creative 06/Simplon formation IA/`, holds 10 files:
- 01 Acculturation + prompt engineering + automation
- 02 Acculturation + Prompt engineering + LLMs et leurs limites + Au delà du texte
- 03 Acculturation PME + stratégie
- 04 Acculturation cas d'usages PME + Prompt engineering + Au delà du texte
- 05 Ideation + stratégie
- 06 Ideation
- 07 Stratégie (métiers, culture, ROI)
- 08 Stratégie + Au delà du texte
- 09 Explorer le potentiel de l'IA pour transformer
- 10 Génération d'image Simplon 2

They were not committed to the repo; only their text was. Download them again for images.

---

## 1. Course plan

Each day runs **9:00–17:00, with lunch 12:30–13:30**, for 7 hours. Days 2–5 each start with a 15-minute recap quiz on the previous day.

### How Day 1 changed the plan for later days

Day 1, as built, pulled several prompting topics forward from Day 2:
- good vs bad prompts, the 3 essentials and the 5 steps;
- the colour-coded prompt;
- the RTF / RTCE / CO-STAR structures;
- the prompt-generator exercise;
- a teaser of the funnel;
- the master prompt generator.

**Day 2 must not repeat these.** It should recap them in 2–3 slides and go deeper.

Day 1 also added things the plan didn't have: "Who I am", "Present yourself", the AI leaders' quotes, the hopes-and-fears discussion, a one-sentence definition of AI, and brain vs AI.

### Day 1: Where AI comes from and how it "thinks" (DONE)

**Learning goal:** explain what an LLM really does (tokens, prediction, reasoning) and pick the right chat tool.

**Planned sessions (7 h)**

| Session | Time |
|---|---|
| Welcome and framing, with the positioning quiz (repeated at the end of the course) | 0.5 h |
| AI was already in your life, and a short history | 1 h |
| AI families and their uses, with the "sort 12 examples" exercise | 1 h |
| Pattern recognition, with Teachable Machine | 1 h |
| Tokens and the predictive brain | 1.25 h |
| How the model picks the right path (attention, mixture of experts, context) | 1 h |
| Not intelligence: prediction, plus reflection (reasoning models) | 0.75 h |
| The major chat tools, and recap | 0.5 h |

The full slide-by-slide outline of the finished deck is in **section 2**.

### Day 2: Personalise and communicate, from prompts to the master prompt (TO BUILD)

**Learning goal:** set up a personalised LLM and project, and write a first master prompt.

**By the end of the day, students can:**
- write custom instructions and set up one project for a real course;
- explain API and MCP in plain words and connect one tool (e.g. Google Drive) to a chatbot;
- describe a task with ODS;
- turn a vague request into a precise brief with the funnel;
- use prompt structures, few-shot examples and references;
- build and test a first master prompt;
- name the data they must never paste, and the environmental cost of AI.

**Sessions (7 h)**

| Session | Time | Content | Exercise |
|---|---|---|---|
| Recap quiz | 0.25 h | 5 questions on Day 1 | |
| Personalising your LLM, level by level | 1 h | Account level: custom instructions and memory. Project level: Projects (ChatGPT, Claude), Gems (Gemini), custom GPTs, each with its own instructions and files. | Write custom instructions, then create a project for one real course |
| API and MCP | 0.75 h | API = one program asking another (the waiter analogy). MCP = a standard plug that lets an LLM read and act in other tools (Drive, Gmail, Calendar, Notion). Connectors in practice. | Connect Google Drive and ask about one file |
| The ODS framework | 0.5 h | Objective: what you want out and what "good" looks like. Data: what you feed in (references, templates, sources). Skill: the reusable way to get there (master prompt, bot, skill, scheduled task, agent). | Write O, D and S for one study task |
| The funnel method | 1 h | Fadi's technique, from broad to precise: find who is the best at X → ask for their method → break it into steps → apply it to me. Let the AI ask you questions; iterate. | Turn "help me with my internship report" into a precise brief |
| Prompt structures (deeper than Day 1) | 1 h | Role, task, context, format; few-shot examples; step by step; splitting one prompt into several | Rewrite 3 weak prompts with 3 structures and compare |
| The prompt generator | 0.5 h | **Fadi's own** prompt generator. It is not in the repo; get it from him. | Test it against a handwritten prompt |
| References and templates | 0.5 h | A reference (example, template, format) beats adjectives | Give a reference document; reproduce its format with new content |
| The master prompt | 1 h | A prompt that predictably gives the output you want; test it, version it, store it. Core concept of the course; the first "Skill" in ODS. | Build a master prompt (e.g. weekly study summary) and run it 3 times |
| Responsible and ecological use | 0.5 h | Energy and water footprint; data never to paste; GDPR; academic integrity and citing AI use; share master prompts instead of everyone rediscovering them | Start a shared class library of master prompts (shared doc or Notion) |

**Proposed slide outline (about 46 slides; trim after Fadi's review)**

| # | Slide (click-deck type) | Content | Fadi's source slides |
|---|---|---|---|
| 1 | cover | "Make AI work *your way*". Crossed out: "One-off chats", "Copy-paste prompts". Answer: "A master prompt". | |
| 2 | points (compact) | Today's journey: recap, personalise, connect, ODS, funnel, structures, generator and references, master prompt, responsible use | |
| 3 | grid with answers | Recap quiz: 5 Day 1 questions, answers revealed on one click | |
| 4 | statement | Part 1: Personalise | |
| 5 | nested | 3 levels: Account (instructions, memory) → Project (Projects, Gems, GPTs) → Conversation (the prompt) | |
| 6 | columns | Where to find it in ChatGPT / Claude / Gemini. **Check menu names on the day.** | |
| 7 | pair | Same question without and with custom instructions | |
| 8 | points (exercise) | Write your custom instructions: who you are, what you study, tone, preferred format | |
| 9 | points (exercise) | Create a project for one real course: upload the syllabus, set instructions, ask 3 questions | |
| 10 | statement | Part 2: Connect AI to your world | |
| 11 | pair | API = the waiter: you order, it brings the dish from the kitchen | 02#112 uses a waiter image for "expected result"; reuse the idea |
| 12 | cards | API / MCP / Connectors: what each one is, in one line | 01#70, 09#83 |
| 13 | logos or gallery | Connectors: Google Drive, Gmail, Calendar, Notion | |
| 14 | points (exercise) | Connect Drive, ask a question about one of your files | |
| 15 | statement | Part 3: The ODS framework | |
| 16 | cards | O / D / S with one-line definitions. **Confirm the exact wording with Fadi.** | |
| 17 | decompose | One task in ODS (e.g. weekly study summary) | |
| 18 | points (exercise) | Write O, D and S for one study task | |
| 19 | statement | Part 4: The funnel | |
| 20 | points | The full funnel: find the best → their method → break it down → apply it to me → iterate | 09#106 ("Les Hacks de FADI") |
| 21 | pair | Flip the roles: "Ask me the questions you need" | 02#111 |
| 22 | decompose | Worked example: the internship pitch using Steve Jobs's method, the 4 prompts in order (continues Day 1 slide 60) | |
| 23 | points (exercise) | "Help me with my internship report" → a precise brief | |
| 24 | statement | Part 5: Prompt structures, deeper | |
| 25 | colorText | 2-slide recap of Day 1's 6 colours | Day 1 slides 55–56 |
| 26 | pair | The role: hire the best expert in the world | 02#109 |
| 27 | pair | Context is king: like a brief | 02#110 |
| 28 | cards | Few-shot: give examples. Step by step: ask it to reason in stages. | |
| 29 | contrast | 1 big prompt vs 2 smaller prompts (splitting a prompt) | 02#113–117 |
| 30 | points (exercise) | Rewrite 3 weak prompts with 3 structures; compare | |
| 31 | statement | Part 6: Generators and references | |
| 32 | picture | Fadi's prompt generator. **Need it from Fadi.** | 09#102 |
| 33 | points (exercise) | Generator vs your own prompt | |
| 34 | pair | "Write it *professionally*" vs "Write it like *this example*" | |
| 35 | points (exercise) | Give a reference document; reproduce its format with new content | |
| 36 | statement | Part 7: The master prompt | |
| 37 | checklist | A master prompt is: reusable, predictable, tested, versioned, stored | |
| 38 | decompose | Recap: inside a mega prompt (Day 1 slide 61) | |
| 39 | steps or points | Test it 3 times: same input → same quality? Then version it (v1, v2…) | |
| 40 | points (exercise) | Build your first master prompt (weekly study summary), run it 3 times | Hand out `day1/master_prompt_generator.md` |
| 41 | statement | Part 8: Use it responsibly | |
| 42 | stat or cards | Energy and water footprint. **Fadi's decks have no slide on this. Find sourced, dated figures; never invent them.** | |
| 43 | grid | Never paste: personal data, health, grades, passwords, an employer's confidential files… (GDPR) | 02#132 |
| 44 | pair | Academic integrity: say when you used AI. **Check UCA's policy.** | |
| 45 | points (exercise) | Start a shared class library of master prompts | |
| 46 | close | Teaser for Day 3: "Your master prompt becomes a bot" | |

### Day 3: Reuse and reliability, with bots, skills, scheduled tasks and RAG (TO BUILD)

**Learning goal:** turn a master prompt into a reusable expert, schedule it, and ground it in sources.

**By the end of the day, students can:**
- package a master prompt as a bot or skill;
- build a subject expert (a "PhD expert") from a master prompt and reference documents;
- schedule a prompt;
- explain why AI invents things;
- explain RAG with a diagram;
- use NotebookLM to study from their own course material;
- measure the difference sources make.

**Sessions (7 h)**

| Session | Time | Content | Exercise |
|---|---|---|---|
| Recap quiz | 0.25 h | 5 questions on Day 2 | |
| From master prompt to bots and skills | 1 h | Bots (custom GPTs, Gems, Claude Projects) and skills: packaged instructions an AI calls to do a task the same way every time | Turn the Day 2 master prompt into a bot or skill |
| Build your own "PhD expert" | 1.25 h | Master prompt + reference documents + rules. Book-to-skill and course-to-skill: tools from GitHub that turn a book or a course into a skill. **Fadi will show his own tools; get the names and links from him.** | Build an expert in one subject of your degree; test it with real questions |
| Scheduled tasks | 1 h | Once a prompt works, run it daily, weekly or on a trigger | Schedule the master prompt (e.g. a Monday-morning study plan) |
| Why AI makes mistakes | 0.75 h | Hallucinations, outdated knowledge, missing context; sources are the cure | Catch the AI inventing a source, then fix it by giving the source |
| RAG explained | 0.75 h | Retrieval-augmented generation: answers from your documents, not memory. Chunking, indexing, citations. | Draw the RAG pipeline on paper |
| NotebookLM hands-on | 1.5 h | Sources; chat with citations; audio and video overviews, mind maps, study guides, quizzes. **Check the product name on the day (reports say it is being folded into Gemini).** | Load one course; make a study guide and an audio overview |
| RAG vs plain chat | 0.5 h | Compare answers with and without sources | Same 5 questions in plain chat and in NotebookLM; score accuracy |

**Proposed slide outline (about 40 slides)**

| # | Slide | Content | Source |
|---|---|---|---|
| 1 | cover | "Make it *reliable*". Crossed out: "Retyping prompts", "Trusting every answer". Answer: "A reusable expert". | |
| 2 | points | Today's journey | |
| 3 | grid with answers | Recap quiz on Day 2 | |
| 4 | statement | Part 1: Bots and skills | |
| 5 | cards | Master prompt vs bot vs skill: what each one is and when to use it | |
| 6 | gallery | Custom GPTs, Gems, Claude Projects, Claude Skills (logos plus one-line notes) | 09#81 logos |
| 7 | gallery | Fadi's own bots: Strategist, offer builder, copywriter, NLP bot… | 09#107–108 |
| 8 | points (exercise) | Turn your master prompt into a bot or skill | |
| 9 | statement | Part 2: Your "PhD expert" | |
| 10 | decompose | The recipe: role, master prompt, reference documents, rules, test questions | |
| 11 | steps or points | Book-to-skill, course-to-skill: how it works. **Fadi's GitHub tools.** | |
| 12 | picture | Live demo screenshot | |
| 13 | points (exercise) | Build an expert in one subject of your degree; test with 5 real questions | |
| 14 | statement | Part 3: Scheduled tasks | |
| 15 | steps or points | Works once → works every time → runs by itself | |
| 16 | gallery | ChatGPT tasks / Gemini scheduled actions / Claude scheduled tasks. **Check names and free-tier availability on the day.** | |
| 17 | points (exercise) | Schedule a Monday-morning study plan | |
| 18 | statement | Part 4: Why AI makes mistakes | |
| 19 | stat or pair | Hallucination: a false answer said with confidence | 02#128–129 |
| 20 | cards | 3 causes: no source, outdated knowledge, missing context | 01#48, 04#39 |
| 21 | pair | Bias: it repeats the stereotypes in its data | 02#131 |
| 22 | points (exercise) | Catch it inventing a source (e.g. ask for 5 academic references on a niche topic), then fix it by giving the source | |
| 23 | statement | Part 5: RAG | |
| 24 | pair | Closed-book exam vs open-book exam: plain chat vs RAG | |
| 25 | points or steps | The pipeline: your documents → cut into chunks → indexed → your question finds the right chunks → answer with citations | 09#111, 09#113 |
| 26 | gallery | Uses: course notes, company knowledge base, HR, customer support | 09#114, 04#42 |
| 27 | points (exercise) | Draw the RAG pipeline on paper | |
| 28 | statement | Part 6: NotebookLM | |
| 29 | picture | The NotebookLM interface | |
| 30 | grid | What it makes: chat with citations, audio overview, video overview, mind map, study guide, quiz, flashcards. **Check the current features.** | 09#86 |
| 31 | points (exercise) | Load one course; make a study guide and an audio overview | |
| 32 | grid (exercise) | RAG vs plain chat: same 5 questions, score each answer | |
| 33 | close | Teaser for Day 4: "AI inside the tools you already use" | |

### Day 4: AI inside your tools, and media production (TO BUILD)

**Learning goal:** use Copilot and Gemini in everyday tools, and produce images, video, audio and slides.

**By the end of the day, students can:**
- analyse data in Excel with Copilot and turn it into slides;
- plan from their inbox and calendar with Gemini;
- make a pitch deck from research notes;
- generate and edit images without starting over;
- make a short video clip and a voice-over in another language;
- explain consent and deepfakes;
- combine all of it into a mini campaign.

**Sessions (7 h)**

| Session | Time | Content | Exercise |
|---|---|---|---|
| Recap quiz | 0.25 h | 5 questions on Day 3 | |
| Copilot in Microsoft 365 | 1 h | Excel (analyse, formulas, charts), Word (draft, summarise), PowerPoint (deck from a document), Outlook. **Check which licence UCA students have.** | Analyse a dataset in Excel and turn it into 3 slides |
| Gemini in Google Workspace | 1 h | Gmail, Calendar, Docs, Sheets, Slides; NotebookLM with Google Docs. **Depends on personal vs university account.** | Plan a group project from your inbox and calendar; draft the plan in Docs |
| From research to pitch deck | 1.25 h | AI slide tools and design assistants: Gemini in Slides, Gamma, Claude Design | Build a 5-slide pitch from your NotebookLM notebook |
| The media map | 0.25 h | Audio, video, images, presentations, communication content: who does what | |
| Images: generation and editing | 1 h | Generating; editing (inpainting, style, background), including ChatGPT image editing and its slash commands. **Confirm the commands on the day; they change.** Tools: ChatGPT images, Gemini (Nano Banana), Google Flow. | Create a visual, then edit it 3 times without starting over |
| Video | 0.75 h | Text-to-video, image-to-video, avatars. Tools: Google Flow (Veo), Runway, HeyGen. | Make a 5-second clip for your pitch |
| Audio and voice | 0.75 h | Text-to-speech, voice cloning, transcription, music; consent and deepfake ethics. Tools: ElevenLabs, Microsoft VibeVoice, Flow Music. **Fadi will show his own voice-clone setup.** **Check VibeVoice is still available (reports say its TTS code was pulled).** | Record a 30-second pitch, then generate it in another language |
| Mini campaign | 0.75 h | Combine image, video, audio and text into one message | A mini campaign for a real or fictional project |

**Proposed slide outline (about 42 slides)**

| # | Slide | Content | Source |
|---|---|---|---|
| 1 | cover | "AI *inside your tools*". Crossed out: "Copy-paste between apps". Answer: "AI where you already work". | |
| 2 | points | Today's journey | |
| 3 | grid with answers | Recap quiz on Day 3 | |
| 4 | statement | Part 1: Copilot in Microsoft 365 | |
| 5 | gallery | Excel / Word / PowerPoint / Outlook: one thing Copilot does in each | 09#85, 01#55, 01#57 |
| 6 | picture | Copilot in Excel: analyse a table (screenshot) | |
| 7 | points (exercise) | Dataset → Copilot analysis → 3 slides | 01#58 is a similar exercise |
| 8 | statement | Part 2: Gemini in Google Workspace | |
| 9 | gallery | Gmail / Calendar / Docs / Sheets / Slides | |
| 10 | points (exercise) | Plan a group project from your inbox and calendar | |
| 11 | statement | Part 3: From research to pitch deck | |
| 12 | gallery or logos | Gemini in Slides, Gamma, Claude Design, Napkin, Genspark | 09#86 |
| 13 | points (exercise) | 5-slide pitch from your NotebookLM notebook | |
| 14 | statement | Part 4: The media map | |
| 15 | columns | Image / Video / Audio / Presentations: tools in each column | 02#49, 10#1–3 |
| 16 | pair | How image AI works, simply: diffusion = noise turned into a picture, step by step | 02#49, 03#30 |
| 17 | statement | Part 5: Images | |
| 18 | gallery | Fun uses: avatar, photo extension, upscale, quality fix | 08#9, 08#12–15 |
| 19 | gallery | Professional uses: poster, logo, flyer, product image, social post | 08#16–21 |
| 20 | gallery | Tools: ChatGPT images, Gemini (Nano Banana), Google Flow, Adobe Firefly | 10#4–5, 08#10 |
| 21 | points | Editing without starting over; ChatGPT slash commands. **Verify on the day.** | |
| 22 | points (exercise) | Create a visual, then edit it 3 times | |
| 23 | statement | Part 6: Video | |
| 24 | gallery | Text-to-video, image-to-video, avatars, automatic editing | 08#24–29 |
| 25 | picture | HeyGen demo: original vs generated | 08#30 |
| 26 | logos | Flow (Veo), Runway, HeyGen | 10#6, 10#10 |
| 27 | points (exercise) | A 5-second clip for your pitch | |
| 28 | statement | Part 7: Audio and voice | |
| 29 | gallery | Text-to-speech, voice cloning, noise removal, music | 08#32–35, 10#7–9 (Suno) |
| 30 | picture | Fadi's voice-clone demo | |
| 31 | contrast | Deepfakes: what is allowed vs not; consent | 02#130 |
| 32 | points (exercise) | 30-second pitch → another language | |
| 33 | statement | Part 8: Mini campaign | |
| 34 | points (exercise) | One message, four formats: text, image, clip, voice | |
| 35 | close | Teaser for Day 5: "Brand, agents and your own website" | |

### Day 5: Branding, free tools, agents and building (TO BUILD)

**Learning goal:** see how skills, media and connectors combine into agents, and vibe-code a pitch page.

**By the end of the day, students can:**
- extract a brand's identity with AI;
- make a vision board;
- demo one free tool;
- map an agent (goal, tools, skills, memory);
- give an agent a real task;
- make an animated title with code;
- install a skill from GitHub;
- build a one-page website by describing it.

**Sessions (7 h)**

| Session | Time | Content | Exercise |
|---|---|---|---|
| Recap quiz | 0.25 h | 5 questions on Day 4 | |
| Teaching AI your brand | 1 h | Getting an LLM to grasp a brand (colours, fonts, tone) from references; design systems; brand profiles from a website. Tools: Claude Design, Google Pomelli. | Feed a brand you admire to the AI; extract its identity guide |
| Vision boards and UI ideas | 0.75 h | AI mood boards; sketch or prompt → interface. Tools: Google Mixboard, Google Stitch. **Check regional availability.** | A vision board for your personal brand or project |
| Free tools for your future job | 0.75 h | Dictation, mini-app builders, AI studios, learning tools: Wispr Flow, Google Opal, Google AI Studio, Learn Your Way | Each student demos one tool in 2 minutes |
| Agentic AI: how it all fits | 0.75 h | Skills + master prompts + RAG + media + connectors = an agent that plans, decides and acts | Map your own agent on paper: goal, tools, skills, memory |
| Agents with real tools | 1 h | Claude (Code, Cowork) and Codex as agents; connectors; API and MCP in action. Revisits Day 2. | Live demo, then students give an agent one real task |
| Motion graphics and video by code | 0.75 h | Video made from code, edited by describing the change: Remotion, HeyGen HyperFrames. Show Fadi's motion-graphics skills: `remotion-shorts` and `click-deck` in this repo (the course decks themselves are built by code). | Generate a short animated title for your pitch |
| GitHub skills and memory | 0.5 h | Finding skills on GitHub; agent memory with an Obsidian vault | Install one skill from GitHub |
| Introduction to Hermes | 0.25 h | Open-source agent (Nous Research) with skills, profiles and connections | |
| Vibe-coding a pitch page | 1 h | Building a site by describing it: Claude, Google AI Studio, Lovable, Bolt | One-page site supporting your final pitch |

**Proposed slide outline (about 40 slides)**

| # | Slide | Content | Source |
|---|---|---|---|
| 1 | cover | "From prompts to *agents*". Crossed out: "Chatting", "Copy-pasting". Answer: "AI that acts". | |
| 2 | points | Today's journey | |
| 3 | grid with answers | Recap quiz on Day 4 | |
| 4 | statement | Part 1: Teach AI your brand | |
| 5 | steps or points | References → AI extracts colours, fonts, tone → a brand guide → consistent content | |
| 6 | gallery | Pomelli (brand from a website), Claude Design (design systems) | |
| 7 | points (exercise) | Extract the identity guide of a brand you admire | 05#23 (AI charter brief) as a related template |
| 8 | statement | Part 2: Vision boards and UI | |
| 9 | gallery | Mixboard, Stitch: examples | |
| 10 | points (exercise) | A vision board for your project | |
| 11 | statement | Part 3: Free tools for your future job | |
| 12 | grid (picker) | Wispr Flow, Opal, AI Studio, Learn Your Way, NotebookLM, Gamma… one card each | 09#86, 09#106 (Wispr demo) |
| 13 | points (exercise) | Pick one tool, demo it in 2 minutes | |
| 14 | statement | Part 4: Agentic AI | |
| 15 | nested or cards | Agent = goal + tools (connectors) + skills + memory, in a plan → act → check loop | |
| 16 | pair | Chatbot answers; agent acts. Links back to Day 1's "Action" family. | |
| 17 | points (exercise) | Map your agent on paper | |
| 18 | statement | Part 5: Agents with real tools | |
| 19 | logos | Claude Code, Claude Cowork, Codex, n8n, Make, Zapier | 01#59–69 (Zapier exercise) |
| 20 | picture | Live demo: an agent reads Google Drive (MCP) and acts | |
| 21 | points (exercise) | Give an agent one real task | |
| 22 | statement | Part 6: Video by code | |
| 23 | pair | Classic editing vs describe-the-change editing | |
| 24 | gallery | Remotion, HyperFrames, Fadi's skills (this deck was made by code) | |
| 25 | points (exercise) | Animated title for your pitch | |
| 26 | statement | Part 7: Skills and memory | |
| 27 | gallery | GitHub (skills), Obsidian (memory vault), Hermes (open-source agent; Fadi uses the Disme profile) | |
| 28 | points (exercise) | Install one skill from GitHub | |
| 29 | statement | Part 8: Vibe-coding | |
| 30 | logos | Claude, Google AI Studio, Lovable, Bolt | 09#86 |
| 31 | points (exercise) | One-page site for your final pitch | |
| 32 | close | Teaser for the capstone, or the course close if the course ends at Day 5 | |

### Day 6: Capstone project and pitch (IN THE APPROVED PLAN; CONFIRM)

**Learning goal:** build and pitch a working AI workflow for a real need.

**Sessions:**
- Recap and brief (rules, evaluation grid), 0.25 h.
- Teams and project choice with an ODS canvas, 0.25 h.
- Build sprint 1, 3 h: combine a master prompt, a skill or bot, a RAG source, media and a page into one workflow.
- Build sprint 2, 1 h.
- Pitch preparation, 0.5 h: what it does, and its limits.
- 10-minute pitches plus questions, 1.25 h, scored on ODS (clear Objective, right Data, reusable Skill).
- Feedback, the Day 1 positioning quiz again, and certificates, 0.75 h.

**Deliverables if kept:** a short brief deck (about 6 slides), an evaluation grid and an ODS canvas.

**If the course becomes 5 days:** the capstone must shrink into Day 5 or disappear, and the final quiz (the repeat of the Day 1 positioning quiz) moves to the end of Day 5.

---

## 2. Day 1 as it was finally made

### Version history (what changed and why)

1. **v1:** first Day 1 deck. Fadi: "a little complicated even for me". It also missed his own content.
2. **v2:** rebuilt from his Simplon decks and images, 44 slides and 160 clicks. He asked to keep:
   - the colour-coded prompt decomposition,
   - "how people use AI",
   - the neuron system,
   - the classification and categorisation slides,
   - the online prompt generators,
   - his images,
   - the AI vision uses,
   - the case studies,
   - pictures on the history timeline (Turing and others).
3. **v3, the current deck:** 63 slides, 296 clicks. Every change Fadi asked for after v2 was made:

   | Fadi's request | What was done |
   |---|---|
   | "Who I am and what I do" after the table of contents | Built from his OneDrive CV ("CV Fadi Fouladgar Full Profile.pdf"); he has no vault access here. Facts, diplomas and a pile of client logos. |
   | A "Present yourself" slide | 7 items: name, major, target job, goal in the course, expectations, AI tools tried, what they want to learn |
   | What AI leaders say, then students' opinions and fears | 6 quotes, each verified by web search with the source in the notes. Then a hopes / fears / vote slide. |
   | The simplest definition of AI, then their opinion | "It learns, then guesses", then "Is that really intelligence?" |
   | Clearer notes ("AI winters promises beat the computer" was not understood) | Every slide's notes rewritten as plain "•" talking points that explain each term |
   | Clearer 2017 transformer card | "Transformers: AI reads whole sentences at once: the T in GPT", with "Attention Is All You Need" explained in the notes |
   | Neuron images on separate clicks | The image was cut into two halves (biological, artificial), each on its own click |
   | Compare 150M synapses/mm³ with AI | New "Brain vs AI" slide (below) |
   | Generative AI uses: his full lists, box then each item on click, his original colours | `columns` slide with all 25 items, translated |
   | Families of use, same click behaviour; Fadi believed there were more | His 3 families, plus a 4th, **Action** (agents, workflows, using a computer, scheduled tasks), labelled "new" |
   | Sorting exercise: precise instructions and visible examples | 5-step instruction slide, plus a 12-example grid with an answer reveal |
   | Quiz: ask first, reveal all answers in one click | Done (slide 30) |
   | Case exercise: show the cases visually | 8-picture "pick one case" grid before the questions |
   | Colour-coded tokens like his Marseille screenshots, the tokenizer link, the chien/croquettes vectors in English | Done (slides 41–42) |
   | "New models reflect" unclear | Split into "a classic model answers at once" and "a reasoning model thinks first" |
   | Le Chat needs the Mistral logo, not "FR"; add Grok | Done |
   | Good vs bad prompt discussion before starting | Slide 52 |
   | The 3 essentials with why | Slide 53 |
   | His 5 steps, translated | Slide 54 |
   | The generators exercise came too early; first exercise should be improve your last prompt (structure, better, test, tell us) | New slide 58 before the generators (slide 59) |
   | Tease the prompting funnel with an example | Slide 60: Steve Jobs pitch |
   | Use "the mega prompt for recruiting" to make a master prompt for master prompts | Slides 61–62 and the handout `master_prompt_generator.md` (see the caveat in section 5) |

### Day 1 slide by slide (v3)

The speaker notes in the .pptx (and in `deck.js`) hold the full talking points and sources. Below, "/" separates what appears on each click.

| # | Title | What appears, click by click |
|---|---|---|
| 1 | Cover: "Where AI comes from and how it *thinks*" | "Magic" crossed out / "A brain" crossed out / "Prediction: very good guesses from data" / subline on today's plan |
| 2 | Today's journey | Who we are / AI is already in your life / What AI is / How machines learn / Tokens and prediction / First steps in prompting |
| 3 | Who I am and what I do | ID card: Fadi Fouladgar, AI integration and growth trainer; trains students, job seekers and entrepreneurs; growth marketing and digital transformation consultant; teaches in English, French and Arabic / 25+ years in marketing, sales and training / 15+ countries / 1,000+ professionals trained / 50+ people in teams led / Diplomas: Bachelor in Digital Marketing, Oreegami Academy with Google France (2023); Business Computing, C&E American University Institute (1995) |
| 4 | Who I have worked with | Training row: Simplon, UCA, France Travail, Rocket School / Media row: Google, Ipsos, France 24, Al Jazeera / Al Arabiya, Fox News, Le Méridien, Choueiri Group / "Training · media · hospitality · publishing". The notes say which were clients, partners or employers. |
| 5 | Now, present yourself | The 7 items, one per click |
| 6 | What AI leaders say | One per click, with a mark: + enthusiast, ! warning, ? sceptic. Sundar Pichai (Google, 2018, +): AI more profound than electricity or fire. Demis Hassabis (Google DeepMind, 2025, +): 10× bigger than the Industrial Revolution, maybe 10× faster. Jensen Huang (Nvidia, 2025, !): you'll lose your job to someone who uses AI. Dario Amodei (Anthropic, 2025, !), a **paraphrase** from Axios: AI could wipe out half of entry-level white-collar jobs within 5 years. Sam Altman (OpenAI, US Senate 2023, !): "If this technology goes wrong, it can go quite wrong." Arthur Mensch (Mistral AI, 2024, ?): "The whole AGI rhetoric is about creating God. I don't believe in God." The notes also mention Hinton (10–20% extinction odds) and LeCun (a house cat has more common sense). |
| 7 | Your turn: hopes and fears | Hopes / Fears / Your vote (which quote do you agree with) / "No wrong answers" |
| 8 | AI in one sentence | "It learns, then guesses." / "Nobody writes the rules: it finds them in the data." / "It *learns patterns* from examples, then *predicts*." |
| 9 | Is that really intelligence? | Underline / "Your opinion" / "Smart, or just very good at guessing?" (answered later, on slide 46) |
| 10 | You have already used AI today | "How many times did AI touch your morning?" |
| 11 | AI is already everywhere | Recommendations / Driving help / Your phone / Voice assistants / "None of these is ChatGPT" |
| 12 | Exercise: the AI hunt | List every AI used before 10 a.m. / Compare in pairs / Share the most surprising (10 min) |
| 13 | Part 1: A short history | |
| 14 | From an idea to a field | 1950 Turing / 1958 perceptron / 1970s–80s AI winters ("big promises, weak computers") / 1997 Deep Blue beats Kasparov |
| 15 | From learning to talking | 2012 deep learning (ImageNet) / 2017 Transformers / 2022 ChatGPT / 2024+ reasoning and agents |
| 16 | "AI did not arrive in 2022. It became visible." | |
| 17 | Part 2: What AI is, and how we use it | |
| 18 | Technologies inside each other | Rings: AI (rules-based chatbot) / machine learning (Netflix) / deep learning (faces in images) / generative AI (ChatGPT, Midjourney) |
| 19 | Inspired by the brain | Biological neuron / artificial neuron (perceptron), on separate clicks. The images keep their French labels. |
| 20 | How many connections? | "1 mm³ of brain: how many synapses?" (students guess) |
| 21 | 150M | 150 million synapses in 1 mm³ (Harvard and Google, *Science*, May 2024) |
| 22 | Brain vs AI: how big? | 1 mm³ brain: 150M synapses / whole brain: about 100T / GPT-3: 175B parameters ≈ 1.2 cm³ of brain / DeepSeek-V3: 671B ≈ 4.5 cm³ / "A big AI ≈ a sugar cube of brain". The notes say parameters are only roughly comparable to synapses, the brain runs on 20 W, and GPT-4, Claude and Gemini sizes aren't public. |
| 23 | How people use generative AI (29 clicks) | **The Teacher (Learn):** explains, coaches, advises, teaches new practices, gives methods, offers an outside view, constructive criticism. **The Partner (Brainstorm):** analyses data, identifies options, evaluates decisions, challenges your choices, asks questions, builds strategies. **The Creative (Co-create):** watches trends, brainstorms, inspires, generates ideas, innovates, links ideas and analogies, stimulates and provokes. **The Expert (Delegate):** corrects, translates, summarises; writes emails, texts, speeches, files, reports, tenders, articles; reproduces; improves; plans. |
| 24 | Four families of use (20 clicks) | **Content (Make):** text, image, video, sound, formulas, code. **Documents (Understand):** summaries, analysis, translation, classification. **Conversation (Real time):** chatbots and callbots, talking to your documents. **Action (Automate · new):** agents that do tasks, workflows (n8n, Make), using a computer, scheduled tasks. |
| 25 | AI before ChatGPT: everyday tasks | Sentiment / Translation / Chatbots / Sorting texts |
| 26 | Exercise: sort the examples | Groups of 3 / read the 12 examples / place each in a circle (rules-based AI, ML, DL, generative AI) / name its family of use / defend one choice (15 min) |
| 27 | 12 examples: which circle? | Row 1, row 2, row 3, then all answers at once. **ML:** spam filter, Netflix, Maps arrival time, bank fraud alert, Instagram feed. **DL:** Face ID, Google Translate, Siri, X-ray reading. **Generative AI:** ChatGPT essay, Midjourney poster. **Rules-based:** website bot with a fixed menu. |
| 28 | Part 3: How machines learn | |
| 29 | Two ways to predict | Regression: stock price, house price / Classification: loan yes/no, cat or dog / "Regression predicts a number, classification a group" |
| 30 | Quiz: regression or classification? | Exam grade / diploma yes-no / room temperature / the next word (each "number or group?") / all answers revealed together / "ChatGPT picks the next word from a list" |
| 31 | How a machine learns | Training: examples / it finds the pattern / prediction: new cases / "Garbage in, garbage out." (Notes: the Amazon hiring-AI bias example.) |
| 32 | Exercise: Teachable Machine | Train / test / break it with bad data (teachablemachine.withgoogle.com, 20 min) |
| 33 | Part 4: AI that sees | |
| 34 | What AI vision does | Classify / detect / identify / segment |
| 35 | AI vision at work | Recycling / road safety / nature / health |
| 36 | Case studies: AI for good | Plastic in the ocean (Surfrider) / waste sorting / crop yield / plant ID |
| 37 | Case studies: AI at work | Factories / maintenance / safety / farming (coffee) |
| 38 | Exercise: pick one case | 8 case pictures, a row per click |
| 39 | Dissect your case | What problem? / what data? / classification, regression or vision? / what could go wrong? (seeds ODS) |
| 40 | Part 5: Tokens and prediction | |
| 41 | AI reads tokens, not words | "ici c'est Marseille": 4 tokens, 19 characters / "Ici c'est Marseille": 5 tokens / "Hello, how are you?": 6 tokens, 19 characters / clickable link to platform.openai.com/tokenizer |
| 42 | From words to numbers | "The dog eats its kibble" / tokens / each token's vector, one per click (illustrative numbers, as in Fadi's slide) |
| 43 | It only predicts the next word | "The cat sat on the…" |
| 44 | Every next word is a bet | mat (very likely) / sofa / floor / moon (unlikely) / "Your context changes the odds" (temperature in the notes) |
| 45 | Context steers the answer | "bank": river or money (attention in the notes) |
| 46 | Is it intelligent? | "No: it predicts" / "It understands me" crossed out / "It calculates the most likely next word" (hallucinations in the notes) |
| 47 | A classic model answers at once | You ask / word by word / no going back / "Fast, but it never reconsiders" |
| 48 | A reasoning model thinks first | First, a hidden draft / breaks it into steps / tries, then checks / fixes, then answers / "Still prediction. Just more of it." |
| 49 | The main chat tools | ChatGPT / Claude / Gemini / Copilot / "All have a free version" |
| 50 | Also worth knowing | Le Chat (Mistral logo) / Grok (xAI) / Perplexity / DeepSeek / Qwen / "Mind where your data goes" |
| 51 | Part 6: First steps in prompting | |
| 52 | Good prompt, bad prompt | "Which one works?" / bad: "Write a post about our tapenade." / crossed out / good: a food-marketer prompt with a number, format and tone |
| 53 | Three essentials | Clear and precise (vague in, vague out) / give context (it knows nothing about you) / say it plainly (it can't read your mind) |
| 54 | Five steps to a good prompt | Define your objectives / give context / analyse and check / refine and discuss / make it yours |
| 55 | A good prompt, piece by piece | The tapenade prompt in 6 colour-coded parts: Role, Context, Objective, Expected result, Constraints, Format |
| 56 | The same prompt, assembled | The full paragraph with each part highlighted / the legend chips |
| 57 | Prompt structures to remember | RTF / RTCE / CO-STAR |
| 58 | Exercise: improve your last prompt | Open it / rebuild it with a structure / make it better / test in a new chat / tell us what changed in the answer and in the reasoning |
| 59 | Exercise: prompt generators | feedough.com/ai-prompt-generator (clickable) / ask the chatbot to write the prompt / compare |
| 60 | Tomorrow: the prompting funnel | Find the best / their method / break it down / apply it to me / "Example: pitch like Steve Jobs" |
| 61 | Inside a mega prompt | The recruiting (ATS CV) prompt's anatomy: expert role / mission / inputs first / numbered steps / measurable rules / deliverables |
| 62 | The master prompt generator | Role / mission / ask first / structure / measurable / format (full text in the handout) |
| 63 | Today: AI predicts | Remember / Data decides / Context steers / Prompts guide / badge "Next: the funnel" (homework in the notes: 3 tasks they'd like AI help with) |

### Planned for Day 1 but not in the deck

Decide whether to add these to Day 1 or to Day 2's recap:
- the 3-contexts exercise (same question, 3 contexts);
- the fast mode vs reasoning mode logic-puzzle exercise;
- the "which model for which task" table;
- the English vs French token-count exercise (only shown, via the tokenizer link);
- the context window (not covered).

### Facts used in Day 1 and their sources (re-check before class)

**Leaders' quotes**
- Pichai: Recode/MSNBC town hall, 2018.
- Hassabis: *The Guardian*, August 2025.
- Huang: Milken Institute conference, May 2025.
- Amodei: Axios, May 2025. It's a paraphrase, so it has no quote marks.
- Altman: US Senate Judiciary subcommittee, 16 May 2023.
- Mensch: *New York Times*, April 2024.
- Hinton: BBC Radio 4, December 2024.
- LeCun: posts on X, 2023 and 2024.

**Brain vs AI figures**
- 1 mm³ of human cortex holds about 57,000 cells and 150 million synapses (Harvard and Google, *Science*, May 2024).
- The whole brain has about 86 billion neurons and roughly 100 trillion synapses (estimates range from 100 to 1,000 trillion). It uses about 20 W.
- Model sizes: GPT-3 175B parameters, DeepSeek-V3 671B.

**Tokens**
- The French token counts come from Fadi's screenshot.
- The English count ("Hello, how are you?" = 6 tokens) was estimated, because no tokenizer was reachable. **Verify it live.**

---

## 3. Rules, preferences and things to avoid

### Content
- **Every point on its own click, on every slide.** Later slides must never have less animation than early ones. Fadi presents point by point and noticed when an earlier deck thinned out.
- **Keep it simple.** v1 was "too complicated even for me". One idea per slide.
- **Use his material first:** his Simplon decks, his wording (translated into English), his images and his examples. Don't replace his content with generic content.
- **Visual over text.** Pictures, logos, photos on history cards, and a visual picker whenever students must choose something.
- **Speaker notes:** clear and not too long, but with enough points that he knows what to say. Explain every term. No cryptic shorthand like "promises beat the computers". Put sources in the notes.
- **Categories with sub-items:** show the category box first, then each sub-item on its own click.
- **Quizzes:** never show answers straight away. Ask everything first, then reveal all answers on one click, on or under the visuals.
- **Exercises:**
  - precise numbered instructions, with group size, timing and what to hand back;
  - options visible on screen;
  - an exercise must come after the content it needs (the generators exercise was moved after "improve your last prompt").
- **Truthfulness:**
  - Verify quotes and figures with a web search before using them.
  - Mark paraphrases (no quote marks).
  - Say when numbers are illustrative.
  - Never invent numbers or quotes. If something is inferred, say so in the notes.
- **Be precise about relationships** on the "worked with" slide: client, partner or employer.
- **Each day ends with a teaser** for the next day.

### Things to avoid
- **Don't read "ODS" as a file format.** It is Objective / Data / Skill.
- **Don't install skills into the default Hermes profile.** Fadi uses **Disme**.
- **Don't use deck 01's Babbage image** (slide 10, image 2): it has an Alamy watermark.
- **No placeholder text where a real logo exists.** Le Chat needed the Mistral logo, not "FR".
- **Don't add the MBA.** The University of Brighton MBA (2001) appears on his trainer application but not his CV; Fadi will add it himself.
- **Privacy:**
  - Never open payslips, contracts, ID cards or the carte vitale in his OneDrive.
  - Don't reuse the CRESS trainer application form: it contains his social-security number, home address and his references' phone numbers. It was read once for diplomas only, then deleted locally.
  - Never put personal contact details (phone, address) on slides.
- **Students' data:** remind students never to paste personal or confidential data into free tools (GDPR).
- **Git:** work on the working branch only, don't open a pull request unless asked, and don't put AI model names in commit messages.

### How Fadi wants to be spoken to
Candid and honest, like a trusted friend. No flattery or sugar-coating. Say when he is wrong and why. Separate facts from guesses, and say "I don't know" rather than bluff. Praise only when it's earned. Be kind in delivery.

---

## 4. Design choices made in the chat that aren't in the base skill

The click-deck skill handles colours, fonts and motion.

**Check your skill version first.** These slide types were added to the skill **during this chat**, in commit `d772bd9` of the repo:
- `columns` (category header, then items one by one);
- `grid` (up to 12 cards, with an optional answer reveal);
- gallery `answer` (quiz reveal; galleries now take up to 5 items);
- `quotes`, `logos`, `profile`, `tokens` and `vectors`;
- `points` with up to 8 items (compact rows) and clickable `url` links.

The earlier commit `f9c2d0f` had added `gallery`, `picture`, `nested`, `decompose` and `colorText`. If your copy of the skill is older (for example the copy Hermes pulled before the course work began), update it from `skills/click-deck` (or `hermes-skills/click-deck` for Hermes). The docs for every type are in `skills/click-deck/reference/slides.md`.

**Course conventions (keep them the same across all days)**
1. **Prompt colour code**, used on every prompting slide all week as a checklist:

   | Part | Colour |
   |---|---|
   | Role | yellow `FFE066` |
   | Context | green `8CE99A` |
   | Objective | orange `FFA94D` |
   | Expected result | blue `74C0FC` |
   | Constraints | pink `F783AC` |
   | Format | violet `B197FC` |

   The `decompose` slide shows the parts one by one; the `colorText` slide shows the assembled prompt.
2. **Fadi's original category colours** for "How people use generative AI": Teacher purple `7B3FBF`, Partner magenta `C2187A`, Creative coral `F0605D`, Expert orange `F59E0B`. Keep them if this slide is recapped.
3. **Answer colours** in the sorting grid: machine learning blue, deep learning violet, generative AI pink, rules-based yellow. Quiz answers: regression blue, classification yellow.
4. **Quote marks:** green "+" enthusiast, red "!" warning, black "?" sceptic.
5. **Token colouring** imitates the OpenAI tokenizer: pastel highlights, spaces kept inside tokens (e.g. " Marseille"), with token and character counts beside each row.
6. **Structure of each day:**
   - cover (crossed-out misconceptions, then the real answer);
   - journey list;
   - (Days 2–5) recap quiz;
   - "Part N" divider slides;
   - content, then a numbered exercise slide;
   - close slide with 3 takeaways and a "Next:" badge.
7. **History timeline:** picture cards with the year as kicker. Cards without a photo show the year big (e.g. "2017").
8. **Logos and photos:**
   - Chat tools use their real logos.
   - Client logos are on white tiles.
   - Brands with no available logo (France Travail, Rocket School, Choueiri Group) are shown as their name in text.
   - Images from Fadi's French decks may keep French labels (the neurons); say so in the notes.
9. **Links** (tokenizer, prompt generator) are clickable in slide show and also written out.
10. **Speaker-note format:** "•" talking points, then automatic "Click N:" lines listing what each click reveals.

---

## 5. What's left to do

### Decisions and inputs needed from Fadi
1. ~~Five days or six?~~ **Five** (confirmed 2 Nov 2026). Still open: does any of the capstone (mini pitch) move into Day 5?
2. ~~Prompt generator~~ **Decided (2 Nov 2026): "Fadi's prompt generator" is his own way, the funnel** (09#106 "My way"). Day 2's separate "generator" part merges into the funnel part; no external tool is needed.
3. **Book-to-skill and course-to-skill tools** (GitHub) for Day 3: names and links.
4. **Voice-clone setup** for the Day 4 demo, and confirmation that VibeVoice still works.
5. **His bots** (Strategist, offer builder, copywriter… from deck 09, slides 107–108) for Day 3: what each does, and screenshots.
6. ~~ODS definitions~~ **Approved (2 Nov 2026):** Objective = what you want to get, and what a good result looks like. Data = what you give the AI: examples, templates, sources. Skill = the way you reuse it every time: a master prompt, a bot or an agent.
7. ~~Recruiting mega prompt~~ **Confirmed: the ATS CV prompt is Fadi's own** (2 Nov 2026). Keep it.
8. **UCA logistics:**
   - group size, level and degree programme;
   - Microsoft 365 Copilot licence and/or Google Workspace accounts;
   - all-English or English with French support;
   - UCA's policy on AI use and academic integrity;
   - what certificate UCA awards.

### Work to do
1. **Build the Days 2–5 decks**, one at a time, using the outlines in section 1 as a starting point.
   - Show Fadi each outline first, then each deck, and apply his feedback before the next day.
   - Expect a v1 → v2 cycle like Day 1.
2. **Get images for Days 2–5** from his decks (download them again from OneDrive, then extract `ppt/media` or render the slides). Useful ones:
   - deck 08: slides 9–35 (image, video, sound uses);
   - deck 10: slides 1–10 (media generators);
   - deck 02: slides 109–117 (prompting) and 128–131 (hallucinations, deepfakes, bias);
   - deck 09: slides 85–86 (Office, demos), 102 (generator), 106–108 (hacks, bots) and 109–118 (RAG).
3. **Research and verify** before writing any figure or product claim:
   - AI energy and water footprint (no source slide exists);
   - current names and free-tier limits of NotebookLM, Gemini scheduled actions, ChatGPT tasks, Claude scheduled tasks, Mixboard, Pomelli, Stitch, Opal and Flow;
   - ChatGPT image-editing slash commands;
   - VibeVoice availability.
4. **Write the quizzes:** the Day 1 positioning quiz (to repeat at the end) and the recap quizzes for Days 2–5. None are written yet.
5. **Set up the shared class library** of master prompts (shared doc or Notion) before Day 2.
6. **If Day 6 is kept:** a short brief deck, an evaluation grid scored on ODS, and an ODS canvas.

### Still open on Day 1
- **Rehearse it once in real PowerPoint (F5).** It has been checked by script and rendered in LibreOffice only, never played in PowerPoint.
- **Verify the English token count live** (slide 41).
- **Fadi adds his MBA** himself, if he wants it.
- **Decide on the planned items not in the deck** (section 2).
- **Timing:** 63 slides and 7 exercises for 7 hours is unrehearsed; trim if the dry run runs long.

---

## 6. How to rebuild or extend a deck

Requires Node.js, Python 3, LibreOffice and pdftoppm.

```bash
cd courses/uca-ai/day1                      # or a new day2/ folder with its own deck.js and img/
cp -r ../../../skills/click-deck/engine ./engine && (cd engine && npm install)
node deck.js                                # writes the .pptx; fix every WARN line (text too long for its box)
python3 ../../../skills/click-deck/scripts/check.py UCA_AI_Day1.pptx      # fails if anything is not animated
bash ../../../skills/click-deck/scripts/render.sh UCA_AI_Day1.pptx        # renders every slide to check by eye
```

**Start a new day** by copying `day1/deck.js` as a template. It shows every slide type in use, the `img()` helper and the `notes(...)` helper for "•" talking points.

**Sanity check** after changing the skill engine: rebuild `skills/click-deck/examples/win-win/deck.js`. It must still give 11 slides and 43 clicks.

**Access used last time** (your new account may differ):
- **OneDrive:** reached through Composio, account alias `one_drive_unbell-nopal`. Search with `ONE_DRIVE_SEARCH_ITEMS`. `ONE_DRIVE_DOWNLOAD_FILE` returns a signed `r2.cloudflarestorage.com` URL, which `curl` can download.
- **Brand logos:** `npm pack simple-icons@16.20.0` gives SVGs (Mistral, Google, Nvidia, Anthropic…), rendered to PNG with `sharp`. Wikipedia logos were fetched through the Composio workbench because Wikimedia was blocked from the container.
- **Blocked from the container:** YouTube, Wikimedia, jsDelivr and the tiktoken encoding files.
