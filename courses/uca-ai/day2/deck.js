// Day 2 — Make AI work your way. Université Côte d'Azur (Cannes campus). v1.
// Built from Fadi's Simplon decks (02#109–117, 02#132, 01#70, 09#83, 09#106) and the approved Day 2 plan.
// Notes: "•" lines are talking points.
const { Deck } = require("./engine/kit");
const fs = require("fs");
// img("turing.png") finds img/turing.png or img/turing.jpg
const img = (n) => {
  const base = `img/${n.replace(/\.\w+$/, "")}`;
  const f = [".png", ".jpg"].map((e) => base + e).find((x) => fs.existsSync(x));
  if (!f) throw new Error(`missing image ${n}`);
  return f;
};
const notes = (...lines) => lines.map((l) => `• ${l}`).join("\n");

const deck = new Deck({
  title: "Day 2 — Make AI work your way",
  author: "Fadi Fouladgar",
  out: "UCA_AI_Day2.pptx",
});

// The course prompt colour code (same as Day 1).
const C = { role: "FFE066", context: "8CE99A", objective: "FFA94D", result: "74C0FC", constraints: "F783AC", format: "B197FC" };

// ── Opening ───────────────────────────────────────────────────────────────
deck.cover({
  bg: "coral",
  tag: "AI in Practice · Day 2",
  headline: "Make AI work *your way*",
  crossed: [
    { label: "Retype", note: "Start from zero." },
    { label: "Copy", note: "Someone else's prompts." },
  ],
  answer: { label: "A master prompt", note: "yours, tested, reusable" },
  sub: "Today: personalise your AI, connect it, and build your first master prompt.",
  notes: notes(
    "Welcome back. Yesterday: what AI is and how it predicts. Today: how to make it work for you, every time.",
    "Click by click: no more retyping and starting from zero in every chat, no more copying other people's prompts.",
    "The answer: a master prompt, a prompt of your own that you test once and reuse forever. It is the core idea of the whole course.",
  ),
});

deck.points({
  bg: "blue",
  title: "Today's *journey*",
  items: [
    { label: "Personalise your AI", note: "instructions, memory, projects" },
    { label: "Connect it", note: "API, MCP, connectors" },
    { label: "The ODS framework", note: "Objective, Data, Skill" },
    { label: "The funnel", note: "my way of prompting" },
    { label: "Structures, deeper", note: "role, context, result, splitting" },
    { label: "References", note: "show an example" },
    { label: "The master prompt", note: "build, test, version" },
    { label: "Responsible use", note: "data, energy, integrity" },
  ],
  notes: notes(
    "We start with a 5-question recap of Day 1, then eight parts.",
    "Morning: parts 1 to 4. Afternoon: parts 5 to 8. Every part ends with an exercise.",
    "By tonight, everyone leaves with a personalised AI and a first master prompt that works.",
  ),
});

deck.grid({
  bg: "purple",
  title: "Recap quiz: *Day 1*",
  items: [
    { label: "AI learns patterns, then it…?", answer: "Predicts", answerColor: "FFE066" },
    { label: "Gmail spam filter: which circle?", answer: "Machine learning", answerColor: "74C0FC" },
    { label: "The next word: regression or classification?", answer: "Classification", answerColor: "FFC93C" },
    { label: "AI reads words or…?", answer: "Tokens", answerColor: "8CE99A" },
    { label: "Garbage in…?", answer: "Garbage out", answerColor: "F783AC" },
    { label: "A reasoning model, before it answers?", answer: "Thinks first", answerColor: "B197FC" },
  ],
  cols: 3,
  reveal: "answers",
  notes: notes(
    "15 minutes. Read each of the 6 questions as it lands; students write their answers on paper or in Wooclap. Don't confirm yet.",
    "Once all six are on screen, one click reveals all the answers.",
    "1: AI learns patterns from examples, then predicts (Day 1: \"It learns, then guesses\"). 2: the spam filter learns from data, so machine learning. 3: the next word is one choice out of a list of about 100,000 tokens, so classification. 4: tokens, pieces of words. 5: garbage out: bad data gives bad predictions. 6: it thinks first: a hidden draft where it breaks the problem into steps and checks itself.",
    "Anyone below 4 out of 6: no stress, everything comes back today.",
  ),
});

const TAPENADE = [
  { tag: "Role", text: "You are an expert in marketing and communication.", color: C.role },
  { tag: "Context", text: "You work for a company that makes gourmet products, including a wide range of tapenades.", color: C.context },
  { tag: "Objective", text: "Write one post for each social network to launch our new organic green olive and almond tapenade.", color: C.objective },
  { tag: "Expected result", text: "The goal is to turn readers into customers.", color: C.result },
  { tag: "Constraints", text: "Each post must mention the ingredients, their Provençal origin and the artisanal process.", color: C.constraints },
  { tag: "Format", text: "100 to 150 words per post, in a friendly tone.", color: C.format },
];

deck.colorText({
  bg: "teal",
  title: "Recap: the *six colours*",
  parts: TAPENADE,
  notes: notes(
    "Yesterday's tapenade prompt. Each colour is one part of a good prompt: role, context, objective, expected result, constraints, format.",
    "Ask: which colour do you forget most often? Usually context and format.",
    "We use these colours all week as a checklist.",
  ),
});

deck.cards({
  bg: "amber",
  title: "Recap: prompt *structures*",
  cards: [
    { kicker: "SIMPLE", label: "RTF", note: "Role, Task, Format" },
    { kicker: "PRECISE", label: "RTCE", note: "Role, Task, Constraints, Examples" },
    { kicker: "COMPLETE", label: "CO-STAR", note: "Context, Objective, Style, Tone, Audience, Response" },
  ],
  footer: "Today we go deeper",
  notes: notes(
    "The three ready-made structures from yesterday. Quick show of hands: who used one since yesterday?",
    "Today we don't learn new acronyms. We learn to personalise the AI, connect it, and turn a good prompt into a master prompt.",
  ),
});

// ── Part 1: Personalise ───────────────────────────────────────────────────
deck.statement({ bg: "blue", tag: "Part 1", lines: ["Personalise *your AI*"], notes: notes("Stop introducing yourself to the AI every time. Tell it once, at the right level.") });

deck.nested({
  bg: "purple",
  title: "Three *levels* of personalisation",
  rings: [
    { label: "Account", example: "Custom instructions and memory: who you are, how you like answers" },
    { label: "Project", example: "One course or job: its own files and instructions" },
    { label: "Conversation", example: "The prompt: what you want right now" },
  ],
  notes: notes(
    "Like Day 1's circles: each level sits inside the one before.",
    "Account level: applies to every chat. Custom instructions = a short text about you and your preferred style. Memory = facts the AI remembers about you between chats.",
    "Project level: a workspace for one topic, e.g. your marketing course. It has its own files (syllabus, notes) and its own instructions. Called Projects in ChatGPT and Claude, Gems in Gemini; custom GPTs are similar.",
    "Conversation level: the prompt you type now. The more the outer levels know, the shorter your prompt can be.",
  ),
});

deck.columns({
  bg: "teal",
  title: "Where to find it",
  columns: [
    { title: "ChatGPT", sub: "OpenAI", color: "10A37F", items: ["Custom instructions", "Memory", "Projects", "Custom GPTs"] },
    { title: "Claude", sub: "Anthropic", color: "D97757", items: ["Profile preferences", "Memory", "Projects"] },
    { title: "Gemini", sub: "Google", color: "4285F4", items: ["Instructions for Gemini", "Memory", "Gems"] },
  ],
  notes: notes(
    "Each heading lands, then where personalisation lives in that tool.",
    "ChatGPT: Settings → Personalization for custom instructions and memory; Projects in the sidebar; custom GPTs in the GPTs section.",
    "Claude: Settings for your profile preferences and memory; Projects in the sidebar.",
    "Gemini: Settings for instructions and memory; Gems are custom assistants with their own instructions.",
    "Menu names move every few months and guides disagree. Open each tool and check the exact names before class.",
  ),
});

deck.pair({
  bg: "coral",
  title: "Same question, *two answers*",
  left: { kicker: "Without instructions", text: "A generic answer." },
  line: "\"Help me plan my revision.\"",
  right: { text: "With them: a plan for *your* course, your level and your week." },
  notes: notes(
    "Left: without instructions, the AI answers for an average person. A generic revision plan anyone could find online.",
    "Line: the same question, typed in both cases.",
    "Right: with instructions (\"I'm a 2nd-year business student in Cannes, exams in January, I like tables\"), it plans for you.",
    "Optional: demo it live with two accounts, or with instructions switched off and on.",
  ),
});

deck.points({
  bg: "amber",
  title: "Exercise: your *custom instructions*",
  items: [
    { label: "Open Settings in your chat tool", note: "ChatGPT, Claude or Gemini" },
    { label: "Who you are", note: "your degree, year and target job" },
    { label: "What you need", note: "studies, job search, a project" },
    { label: "How you want answers", note: "tone, length, tables or lists, language" },
    { label: "Test it", note: "ask the revision question again" },
  ],
  notes: notes(
    "15 minutes, alone.",
    "Keep it short: 5–8 lines are enough. No personal data: no address, phone or student number.",
    "Example: \"I'm a 2nd-year business student at UCA Cannes, aiming for a marketing internship. Answer in English, short, with a table when you compare things.\"",
    "Debrief: 2 volunteers compare the answer before and after.",
  ),
});

deck.points({
  bg: "blue",
  title: "Exercise: a *project* for one course",
  items: [
    { label: "Create a project", note: "Projects in ChatGPT or Claude, a Gem in Gemini" },
    { label: "Name it after one real course" },
    { label: "Upload the syllabus or your notes", note: "no one else's personal data" },
    { label: "Write its instructions", note: "\"You are my tutor for this course…\"" },
    { label: "Ask it 3 questions", note: "about that course only" },
  ],
  notes: notes(
    "20 minutes, alone.",
    "The syllabus or the course slides are ideal: the project now answers from your course, not from the whole internet.",
    "Good test questions: \"What are the 3 key ideas of week 2?\", \"Quiz me on chapter 3\", \"What will the exam probably ask?\"",
    "We reuse this project tomorrow when we build bots.",
  ),
});

// ── Part 2: Connect ───────────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 2", lines: ["Connect AI", "to *your world*"], notes: notes("Until now the AI only knows what you type. Now it can reach your files and tools.") });

deck.pair({
  bg: "teal",
  title: "AI works *inside other tools*",
  left: { kicker: "An API", text: "Apps talking to apps." },
  line: "Zapier, Canva and Office use ChatGPT through an API.",
  right: { text: "The AI works *inside* the tools you already use." },
  notes: notes(
    "API = Application Programming Interface: a door that lets one program ask another program for something, and get an answer back.",
    "From my Simplon synthesis: language models are used in many services through APIs. Zapier, Canva and other tools call ChatGPT; Microsoft builds Copilot into Office 365.",
    "You don't need to code to benefit: every time an app has an \"AI\" button, there is probably an API call behind it.",
  ),
});

deck.cards({
  bg: "coral",
  title: "API, MCP, *connectors*",
  cards: [
    { kicker: "API", label: "App to app", note: "one program asks another" },
    { kicker: "MCP", label: "One plug", note: "the AI reads and acts in tools" },
    { kicker: "CONNECTORS", label: "Ready to click", note: "MCP inside your chat app" },
  ],
  footer: "MCP: like a USB-C port for AI",
  stress: 1,
  notes: notes(
    "API: each app has its own door, and someone has to write the code for each one.",
    "MCP = Model Context Protocol, an open standard launched by Anthropic in November 2024. One way for any AI to connect to any tool: Drive, Gmail, Calendar, Notion… The AI can read and also act (create a file, draft an email).",
    "Connectors: MCP made easy. In ChatGPT, Claude or Gemini you click \"connect\" and log in; no code.",
    "Footer: the official MCP site compares it to a USB-C port: one plug for everything.",
  ),
});

deck.logos({
  bg: "blue",
  title: "Connectors you can *use today*",
  cols: 3,
  items: [
    { image: img("c_googledrive.png"), name: "Google Drive" },
    { image: img("c_gmail.png"), name: "Gmail" },
    { image: img("c_googlecalendar.png"), name: "Google Calendar" },
    { image: img("c_notion.png"), name: "Notion" },
    { image: img("c_zapier.png"), name: "Zapier" },
    { text: "Canva", color: "00C4CC", name: "Canva" },
  ],
  footer: "Free accounts: check what's included",
  notes: notes(
    "Row 1, Google: Drive (your files), Gmail (your emails), Calendar (your schedule).",
    "Row 2: Notion (notes and wikis), Zapier (automation between thousands of apps), Canva (designs).",
    "Which connectors are free, and in which tool, changes often. Check on the day with a free account.",
    "Privacy: a connector gives the AI access to everything in that account. Connect only what you need.",
  ),
});

deck.points({
  bg: "amber",
  title: "Exercise: *connect* Google Drive",
  items: [
    { label: "Open your chat tool's connectors", note: "Settings, or the + in the chat box" },
    { label: "Connect Google Drive", note: "log in and allow access" },
    { label: "Pick one of your own files", note: "a course document, no personal data" },
    { label: "Ask: \"Summarise this file in 5 points\"", note: "then one question about it" },
  ],
  notes: notes(
    "15 minutes, in pairs: one connects, the other checks the answer against the file.",
    "If a free account has no Drive connector, upload the file directly instead; the lesson is the same.",
    "Debrief: did it find the right file? Did it invent anything that is not in the file?",
  ),
});

// ── Part 3: ODS ───────────────────────────────────────────────────────────
deck.statement({ bg: "teal", tag: "Part 3", lines: ["The *ODS* framework"], notes: notes("ODS: my framework for any AI task. Objective, Data, Skill. We use it every day until the end of the course.") });

deck.cards({
  bg: "purple",
  title: "Objective, Data, *Skill*",
  cards: [
    { kicker: "O · OBJECTIVE", label: "What you want", note: "and what a good result looks like" },
    { kicker: "D · DATA", label: "What you give", note: "examples, templates, sources" },
    { kicker: "S · SKILL", label: "How you reuse it", note: "a master prompt, a bot or an agent" },
  ],
  footer: "Think O, D, S before you type",
  stress: 2,
  notes: notes(
    "Objective: what you want to get, and what a good result looks like. If you can't describe a good result, the AI can't either.",
    "Data: what you give the AI: examples, templates, sources. The AI is only as good as what you feed it (Day 1: garbage in, garbage out).",
    "Skill: the way you reuse it every time: a master prompt, a bot or an agent. Today: the master prompt. Day 3: bots. Day 5: agents.",
  ),
});

deck.decompose({
  bg: "blue",
  title: "One task in *ODS*",
  parts: [
    { tag: "Objective", text: "A one-page summary of this week's lectures: 5 key ideas and 3 quiz questions.", color: C.objective },
    { tag: "Data", text: "My lecture notes, the slides, and last week's summary as a model.", color: C.context },
    { tag: "Skill", text: "A master prompt I run every Monday, in my course project.", color: C.role },
  ],
  notes: notes(
    "Example: a weekly study summary.",
    "Objective: precise enough to judge the result (one page, 5 ideas, 3 questions).",
    "Data: the notes and slides, plus one example of a good summary to copy.",
    "Skill: a master prompt saved in the course project from Part 1, run every week.",
  ),
});

deck.points({
  bg: "coral",
  title: "Exercise: your task in *ODS*",
  items: [
    { label: "Pick one study task you repeat", note: "summaries, revision, essays, emails…" },
    { label: "O: write the result you want", note: "and how you'll know it's good" },
    { label: "D: list what you'll give the AI", note: "files, examples, templates" },
    { label: "S: say how you'll reuse it", note: "every week? every essay?" },
  ],
  notes: notes(
    "10 minutes, alone, on paper or in a doc. Keep it: this task becomes your master prompt in Part 7.",
    "Use one of the 3 tasks from yesterday's homework if you wrote them.",
    "Check in pairs: can your partner tell what a good result looks like from your O?",
  ),
});

// ── Part 4: The funnel ────────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 4", lines: ["*My way:*", "the funnel"], notes: notes("My own way of prompting, from my toolbox. Yesterday's teaser, now done properly.") });

deck.points({
  bg: "teal",
  title: "The *funnel*, step by step",
  items: [
    { label: "Who is the best at X?", note: "the expert, the brand, the classic" },
    { label: "What is their method?", note: "ask the AI to describe it" },
    { label: "Break it into steps", note: "a checklist you can follow" },
    { label: "Make me the same", note: "apply it to my task and my context" },
    { label: "Iterate", note: "let it ask questions; correct and refine" },
  ],
  notes: notes(
    "Broad to precise, like a funnel. Instead of asking the AI \"do my task\", you borrow the method of the best.",
    "1. Who is the best in the world at this? 2. What is his or her methodology? 3. Break it into steps. 4. \"Make me the same\" for my task.",
    "5. Iterate: never stop at the first answer. Correct it, add context, ask again.",
    "Why it works: the AI has read a lot about famous methods. You turn that knowledge into a recipe for you.",
  ),
});

deck.pair({
  bg: "amber",
  title: "Flip the *roles*",
  left: { kicker: "Instead of", text: "guessing what to say," },
  line: "let the AI interview you.",
  right: { text: "\"Ask me *all the questions* you need, one at a time.\"" },
  notes: notes(
    "From my Simplon deck: rather than looking for the information to give the AI, ask it to ask you questions.",
    "Full prompt: \"Ask me all the relevant questions you need to do [this task]. As soon as I answer, ask me another one until you have everything for an optimal answer. Understood?\"",
    "It works best inside the funnel, at step 4: before it makes you the same, it asks about you.",
  ),
});

deck.decompose({
  bg: "blue",
  title: "The funnel: *pitch like Steve Jobs*",
  parts: [
    { tag: "1 · Who", text: "Who was the best in the world at presenting a product?", color: C.role },
    { tag: "2 · How", text: "What was Steve Jobs's method for his keynotes?", color: C.context },
    { tag: "3 · Split", text: "Turn his method into steps I can follow.", color: C.objective },
    { tag: "4 · Use", text: "Use this method to write my 2-minute internship pitch. Here is my CV.", color: C.result },
  ],
  notes: notes(
    "The example from yesterday's teaser, as 4 real prompts in a row, in the same chat.",
    "Prompt 2 typically gives: one big idea, the rule of three, a demo, \"one more thing\". Check the answer: the AI can be wrong about famous methods too.",
    "Prompt 4: add \"Ask me questions first\" (the flip) for a far better pitch.",
    "Demo it live, then show the final pitch.",
  ),
});

deck.cards({
  bg: "coral",
  title: "Three *hacks* from my toolbox",
  cards: [
    { kicker: "HACK 1", label: "What do you see?", note: "send a screenshot, ask" },
    { kicker: "HACK 2", label: "What is this?", note: "let it explain a doc first" },
    { kicker: "HACK 3", label: "Paste the text", note: "not a Word or PDF file" },
  ],
  notes: notes(
    "Hack 1: take a screenshot (a chart, a web page, an error) and ask \"What do you see?\" before asking anything else.",
    "Hack 2: give it a document and ask \"What is this doc?\" first. You check it understood before you give it the task.",
    "Hack 3: paste plain text rather than attaching a Word or PDF file: less formatting noise, fewer tokens, fewer mistakes.",
    "These three come from my notes (\"Funnel Prompt Hacks\"); the explanations here are my reading of them. Adjust them in your own words.",
  ),
});

deck.points({
  bg: "purple",
  title: "Exercise: from *vague to precise*",
  items: [
    { label: "Start from: \"Help me with my internship report\"" },
    { label: "Who is the best at reports like this?", note: "funnel step 1" },
    { label: "Get their method, in steps", note: "steps 2 and 3" },
    { label: "Make me the same, ask me questions first", note: "steps 4 and the flip" },
    { label: "Hand back a precise brief", note: "5–10 lines, ready to paste" },
  ],
  notes: notes(
    "20 minutes, in pairs: one types, one challenges each answer.",
    "No internship yet? Use any report from your degree.",
    "Debrief: compare the first answer to \"help me with my internship report\" with the last one. What changed?",
  ),
});

// ── Part 5: Structures, deeper ────────────────────────────────────────────
deck.statement({ bg: "teal", tag: "Part 5", lines: ["Prompt structures,", "*deeper*"], notes: notes("Yesterday: the six colours. Today: what makes each one powerful, and when to split a prompt.") });

deck.pair({
  bg: "blue",
  title: "The role: hire *the best*",
  left: { kicker: "No budget limit", text: "Your dream team." },
  line: "Hire the best expert in their field, for any task.",
  right: { text: "\"Act as an *expert in [job]*, specialised in [your task].\"" },
  notes: notes(
    "From my Simplon deck: imagine you could hire the best expert in their category for any task, with no budget limit.",
    "Define that role and give it to the AI. Your dream team is ready for every challenge.",
    "Be precise: not \"a marketer\" but \"a growth marketer specialised in student internships in France\".",
  ),
});

deck.pair({
  bg: "amber",
  title: "Context is *king*",
  left: { kicker: "It's like", text: "a brief." },
  line: "The more you tell it, the better the answer.",
  right: { text: "What you offer, *who it's for*, and who you are." },
  notes: notes(
    "\"Context is king. It's like a brief!\" The more information and context, the better the answer.",
    "My template: here is the information you need for this task. What I sell (my offer or expertise). Who I sell to (my target, my ideal client). About me (my positioning, my value). My audience (where my list comes from).",
    "For students: what I study, who will read it (teacher, recruiter), why I need it, my level.",
  ),
});

deck.pair({
  bg: "coral",
  title: "Order *the right dish*",
  left: { kicker: "You tell the waiter", text: "\"Something good.\"" },
  line: "You get Brussels sprouts. You wanted seafood.",
  right: { text: "Say the *objective* and the *result you expect*." },
  notes: notes(
    "From my Simplon deck: think of the AI as a waiter in a big restaurant.",
    "If you just say \"Something good, please\", you may get Brussels sprouts when you dreamed of a seafood platter.",
    "The clearer you are, the happier you'll be with the dish.",
    "Example: \"Today your objective is to write a very attractive press kit about [my company] that gets me many interview requests and generates leads on [my website].\"",
  ),
});

deck.cards({
  bg: "purple",
  title: "Three *power moves*",
  cards: [
    { kicker: "FEW-SHOT", label: "Show examples", note: "2–3 of what you want" },
    { kicker: "STEP BY STEP", label: "Ask for stages", note: "plan first, then write" },
    { kicker: "SELF-CHECK", label: "Ask it to check", note: "against your own rules" },
  ],
  footer: "Examples beat adjectives",
  stress: 0,
  notes: notes(
    "Few-shot: give 2 or 3 examples of the result you want. \"Here are two posts I like; write a third in the same style.\" \"Shot\" = example.",
    "Step by step: ask it to work in stages: \"First list the key points, then plan, then write.\" Fewer mistakes, and you can correct each stage.",
    "Self-check: end with \"Before you answer, check your answer against my rules and fix what doesn't fit.\" The same last step as Day 1's master prompt generator.",
    "Footer: one good example tells the AI more than ten adjectives.",
  ),
});

deck.contrast({
  bg: "teal",
  title: "Split *one big prompt*",
  tile: { big: "1 → 2", small: "prompts" },
  wrong: { kicker: "One big prompt", text: "Research, plan *and* write it all at once." },
  right: { kicker: "Two prompts", text: "First: research and plan. Then: write from that plan." },
  notes: notes(
    "From my Simplon deck (\"Découper un prompt\": 1 prompt vs 2 prompts).",
    "A huge prompt asks for too much at once; the AI does everything a little, nothing well.",
    "Split it: prompt 1 gathers and plans; you check the plan; prompt 2 writes from the approved plan.",
    "It's the step-by-step idea, done by you across two messages.",
  ),
});

deck.points({
  bg: "blue",
  title: "Exercise: *rewrite* 3 weak prompts",
  items: [
    { label: "\"Write my cover letter.\"", note: "rewrite with a role and context" },
    { label: "\"Summarise this article.\"", note: "rewrite with an example (few-shot)" },
    { label: "\"Make a marketing plan.\"", note: "split it into 2 prompts" },
    { label: "Run old and new, compare", note: "which answer would you hand in?" },
  ],
  notes: notes(
    "20 minutes, in groups of 3: each person rewrites one prompt, then the group compares.",
    "Use the six colours as a checklist on each rewrite.",
    "Debrief: each group shows its best before and after.",
  ),
});

// ── Part 6: References ────────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 6", lines: ["References and", "*templates*"], notes: notes("The fastest way to get the format you want: show it.") });

deck.pair({
  bg: "amber",
  title: "Show, *don't describe*",
  left: { kicker: "Adjectives", text: "\"Make it *professional.*\"" },
  line: "Professional for whom? The AI has to guess.",
  right: { text: "Paste a model: \"Write it *like this*.\"" },
  notes: notes(
    "\"Professional\", \"engaging\", \"clear\" mean different things to everyone.",
    "A reference (an example, a template, a past document) shows the length, structure, tone and layout in one go.",
    "Good references: last year's best report, a job ad you like, a post that worked, your teacher's template.",
  ),
});

deck.points({
  bg: "coral",
  title: "Exercise: *copy the format*",
  items: [
    { label: "Pick a reference document", note: "a report, a post, a CV you like" },
    { label: "Paste it as \"the model\"" },
    { label: "Give your own new content", note: "your notes, your facts" },
    { label: "Ask: same format, my content" },
    { label: "Check the result against the model", note: "structure, length, tone" },
  ],
  notes: notes(
    "15 minutes, alone.",
    "Hack 3 applies: paste the text rather than attaching the file when you can.",
    "Never paste someone else's personal data from the reference: remove names and contact details first.",
  ),
});

// ── Part 7: The master prompt ─────────────────────────────────────────────
deck.statement({ bg: "blue", tag: "Part 7", lines: ["The *master prompt*"], notes: notes("The core idea of the course: the first Skill in ODS.") });

deck.checklist({
  bg: "teal",
  title: "What makes a *master prompt*",
  items: ["Reusable", "Predictable", "Tested", "Versioned and stored"],
  side: { big: "Same input, same quality." },
  notes: notes(
    "Reusable: you write it once and use it for the same task again and again.",
    "Predictable: it gives the output you want, in the format you want, every time.",
    "Tested: you ran it several times before trusting it.",
    "Versioned and stored: when you improve it, save v2 and keep v1 in case v2 is worse. Store it in a doc, your project or the class library, not lost in your chat history.",
  ),
});

deck.decompose({
  bg: "purple",
  title: "Recap: inside a *mega prompt*",
  parts: [
    { tag: "Expert role", text: "You are a recruitment and ATS expert (Taleez, Flatchr, Recruitee…) who knows their keyword logic.", color: C.role },
    { tag: "Mission", text: "Optimise the Experience section of a CV for one job ad, so it passes ATS filters.", color: C.context },
    { tag: "Inputs first", text: "First ask for the current CV and the full job ad.", color: C.objective },
    { tag: "Numbered steps", text: "Find the ad's 30 key words, find the CV's gaps, then rewrite.", color: C.result },
    { tag: "Measurable rules", text: "6 lines per job, 85–90 characters each, one keyword per line, 40 lines max.", color: C.constraints },
    { tag: "Deliverables", text: "The new section, the 30 keywords and a 5-line explanation.", color: C.format },
  ],
  notes: notes(
    "My recruiting mega prompt from yesterday: the shape every master prompt follows.",
    "ATS = Applicant Tracking System: software that filters CVs by keywords before a human reads them.",
    "Look for the anatomy: an expert role, a mission, inputs requested first, numbered steps, rules you can measure, a list of deliverables.",
  ),
});

deck.points({
  bg: "amber",
  title: "Test it, then *version it*",
  items: [
    { label: "Run it 3 times", note: "same input, in new chats" },
    { label: "Compare the 3 results", note: "same quality? same format?" },
    { label: "Fix what changes", note: "add a rule, an example or a step" },
    { label: "Save it as v2", note: "keep v1 too" },
    { label: "Store it", note: "your project, a doc, the class library" },
  ],
  notes: notes(
    "Why 3 times: the AI has built-in chance (Day 1: temperature). One good run can be luck.",
    "If the results differ, the prompt leaves too much to guess. Add a measurable rule (\"exactly 5 points\"), an example, or a step.",
    "Versioning: name it \"Weekly summary v2, 14 Nov\". You'll thank yourself in a month.",
  ),
});

deck.points({
  bg: "coral",
  title: "Exercise: your first *master prompt*",
  items: [
    { label: "Take your ODS task from Part 3" },
    { label: "Paste the master prompt generator", note: "the handout from Day 1" },
    { label: "Answer its 5 questions" },
    { label: "Run the result 3 times", note: "with real input" },
    { label: "Fix it and save v1", note: "in your course project" },
  ],
  notes: notes(
    "30 minutes, alone, then show a neighbour.",
    "The generator is the file master_prompt_generator.md shared yesterday; share it again now.",
    "No ODS task? Use the weekly study summary.",
    "Walk around: check that every master prompt has measurable rules and a clear list of deliverables.",
  ),
});

// ── Part 8: Responsible use ───────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 8", lines: ["Use it", "*responsibly*"], notes: notes("Three questions before you prompt: what does it cost the planet, what data am I giving, and am I being honest about it?") });

deck.cards({
  bg: "teal",
  title: "The *energy* behind a prompt",
  cards: [
    { kicker: "GEMINI PROMPT", label: "watt-hours", value: "0.24" },
    { kicker: "GEMINI PROMPT", label: "mL of water", value: "0.26" },
    { kicker: "CHATGPT QUERY", label: "watt-hours", value: "0.34" },
    { kicker: "WORLD · 2030", label: "TWh ≈ Japan", value: "945" },
  ],
  footer: "Tiny per prompt, huge in total",
  stress: 3,
  notes: notes(
    "Gemini: Google says its median text prompt uses 0.24 Wh of energy and 0.26 mL of water, about five drops (Google technical paper, August 2025). Median = the middle prompt; long or reasoning prompts use more.",
    "ChatGPT: Sam Altman wrote that an average query uses about 0.34 Wh, \"what an oven would use in a little over one second\" (blog post, June 2025). OpenAI gave no method, so treat it with care.",
    "Wh = watt-hour. 0.3 Wh is roughly an LED bulb on for 2–3 minutes.",
    "Data centres: about 415 TWh in 2024 (1.5% of world electricity), projected about 945 TWh in 2030, roughly Japan's consumption today, with AI the main driver (IEA, Energy and AI, April 2025). TWh = a billion kWh.",
    "Message: one prompt is tiny, billions a day are not. Don't stop using AI; avoid waste: a master prompt that works first time beats ten retries.",
  ),
});

deck.grid({
  bg: "coral",
  title: "Never *paste* these",
  items: [
    { label: "ID or passport numbers" },
    { label: "Health information" },
    { label: "Passwords and codes" },
    { label: "Bank details" },
    { label: "Other students' grades" },
    { label: "Classmates' personal data" },
    { label: "An employer's confidential files" },
    { label: "Unpublished exams or research" },
  ],
  notes: notes(
    "Not into a free tool, and not into any tool your university or employer hasn't approved.",
    "Why: free tools may use your chats to train their models, and data can leak. Companies restrict generative AI for fear of leaks and GDPR breaches (my Simplon deck).",
    "GDPR = the EU's General Data Protection Regulation: personal data about someone else is not yours to share.",
    "If you need to work on a sensitive document: remove names and numbers first, or use your university's approved tool.",
  ),
});

deck.columns({
  bg: "blue",
  title: "Should I use *generative AI*?",
  columns: [
    { title: "No", sub: "if…", color: "E8453C", items: ["The facts must be highly reliable or expert", "The data is sensitive or personal", "It should be entirely my own work"] },
    { title: "Yes", sub: "if…", color: "1FAE6B", items: ["Repetitive, non-sensitive tasks", "Picturing ideas before a creative project", "Summaries, corrections, minutes, translations"] },
  ],
  notes: notes(
    "From my Simplon deck. The \"No\" box lands, then each case; then the \"Yes\" box and its cases.",
    "No, if I must create content with highly reliable or expert data: today's models can't guarantee the information is true.",
    "No, if I work with sensitive data (personal, named, confidential): GDPR.",
    "No, if I want it to produce a personal or professional piece entirely by itself: plagiarism and copyright.",
    "Yes: automating repetitive tasks that aren't sensitive; visualising ideas with images before a creative project; summaries, corrections, meeting minutes, translations.",
  ),
});

deck.pair({
  bg: "amber",
  title: "Be *honest* about it",
  left: { kicker: "Hiding it", text: "\"I wrote it all.\"" },
  line: "Teachers and recruiters can often tell.",
  right: { text: "Say *which tool* you used, and for what." },
  notes: notes(
    "Academic integrity: using AI is not cheating in itself; hiding it, or breaking a course's rules, is.",
    "Good habit: one line at the end, e.g. \"I used ChatGPT to plan this essay and correct my English; the ideas and analysis are mine.\"",
    "Each course can have its own rules. When in doubt, ask the teacher before, not after.",
    "TO CHECK BEFORE CLASS: UCA's official policy on AI use, and quote it here.",
  ),
});

deck.points({
  bg: "teal",
  title: "Exercise: the *class library*",
  items: [
    { label: "Open the class library", note: "the shared doc, link on the board" },
    { label: "Add your master prompt", note: "name, task, version" },
    { label: "Add one line: what it's good for" },
    { label: "Try one from a classmate", note: "and leave a comment" },
  ],
  notes: notes(
    "15 minutes. The library is a shared doc or a Notion page: set it up before class.",
    "Why share: instead of 25 people rediscovering the same prompt, everyone starts from the best version. It's also the most ecological use: fewer retries.",
    "Remove any personal data from your prompt before sharing it.",
  ),
});

// ── Close ─────────────────────────────────────────────────────────────────
deck.close({
  bg: "green",
  title: "Today: AI works *your way*.",
  lead: "Remember",
  chips: ["Think ODS", "Use the funnel", "Test, then reuse"],
  badge: "Next: your bot",
  notes: notes(
    "Think ODS: objective, data, skill, before you type.",
    "Use the funnel: borrow the method of the best, and let the AI ask you questions.",
    "Test, then reuse: a master prompt run 3 times, versioned and stored.",
    "Tomorrow: your master prompt becomes a bot, then your own subject expert, scheduled tasks, and AI that answers from your documents (RAG, NotebookLM).",
    "Homework: run your master prompt once on real coursework before tomorrow.",
  ),
});

deck.build();
