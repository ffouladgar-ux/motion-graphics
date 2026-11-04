// Day 2 — Make AI work your way. Université Côte d'Azur (Cannes campus). v2.
// v2: Fadi's edits — Day 1 parts 5–6 (tokens, first prompting) moved here as parts 0.5–0.6, his custom instructions, a new Part 8.
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

// Prompts Fadi pastes in the notes, kept word for word (handouts/ has the same text).
const HONEST = fs.readFileSync("../handouts/honest_advisor_prompt.md", "utf8").split("---")[1].trim();
const ARCHITECT = fs.readFileSync("../handouts/prompt_architect_mode.md", "utf8").split("\n---\n")[1].trim().replace(/^```\n/gm, "");

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
    "Welcome back. Last session: what AI is and how it learns. Today: how to make it work for you, every time.",
    "Click by click: no more retyping and starting from zero in every chat, no more copying other people's prompts.",
    "The answer: a master prompt, a prompt of your own that you test once and reuse forever. It is the core idea of the whole course.",
  ),
});

deck.columns({
  bg: "blue",
  title: "Today's *journey*",
  columns: [
    { title: "Finish Day 1", sub: "Parts 0.5–0.6", color: "7B3FBF", items: ["0.5 · Tokens and prediction", "0.6 · First steps in prompting"] },
    { title: "Make it yours", sub: "Parts 1–4", color: "0EA5E9", items: ["1 · Personalise your AI", "2 · Connect it", "3 · The ODS framework", "4 · The funnel"] },
    { title: "Make it reliable", sub: "Parts 5–9", color: "10B981", items: ["5 · Structures, deeper", "6 · References", "7 · The master prompt", "8 · Hack master prompts", "9 · Use AI responsibly"] },
  ],
  notes: notes(
    "We start with a 6-question recap of Day 1, then we finish what we didn't have time for last week: parts 0.5 and 0.6.",
    "Then the Day 2 parts: make the AI yours (personalise, connect, ODS, the funnel), then make it reliable (structures, references, the master prompt, responsible use).",
    "Every part ends with an exercise. By tonight, everyone leaves with a personalised AI and a first master prompt that works.",
  ),
});

deck.grid({
  bg: "coral",
  title: "Recap quiz: *Day 1*",
  items: [
    { label: "AI learns patterns, then it…?", answer: "Predicts", answerColor: "FFE066" },
    { label: "Gmail spam filter: which circle?", answer: "Machine learning", answerColor: "74C0FC" },
    { label: "The next word: regression or classification?", answer: "Classification", answerColor: "FFC93C" },
    { label: "Face ID unlocks your phone: which circle?", answer: "Deep learning", answerColor: "B197FC" },
    { label: "Garbage in…?", answer: "Garbage out", answerColor: "F783AC" },
    { label: "Exam grade: regression or classification?", answer: "Regression", answerColor: "74C0FC" },
  ],
  cols: 3,
  reveal: "answers",
  notes: notes(
    "15 minutes. Read each of the 6 questions as it lands; students write their answers on paper or in Wooclap. Don't confirm yet.",
    "Once all six are on screen, one click reveals all the answers.",
    "1: AI learns patterns from examples, then predicts (Day 1: \"It learns, then guesses\"). 2: the spam filter learns from data, so machine learning. 3: the next word is one choice out of a list of about 100,000 tokens, so classification. 4: Face ID recognises faces in images, so deep learning. 5: garbage out: bad data gives bad predictions. 6: a grade is a number, so regression.",
    "Anyone below 4 out of 6: no stress, everything comes back today.",
    "Only topics we covered last week: tokens and prompting come next, in parts 0.5 and 0.6.",
  ),
});

const TAPENADE = [
  { tag: "Role", text: "You are an expert in marketing and communication.", color: C.role },
  { tag: "Context", text: "You work for a gourmet food company known for its tapenades.", color: C.context },
  { tag: "Objective", text: "Write one post per social network to launch our organic almond tapenade.", color: C.objective },
  { tag: "Expected result", text: "The goal is to turn readers into customers.", color: C.result },
  { tag: "Constraints", text: "Each post mentions the ingredients, their Provençal origin and the craft.", color: C.constraints },
  { tag: "Format", text: "100 to 150 words per post, in a friendly tone.", color: C.format },
];

// ── Tokens and prediction ─────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 0.5", lines: ["Tokens and *prediction*"], notes: notes("How a chatbot reads your text, and what it really does with it.") });

deck.tokens({
  bg: "teal",
  title: "AI reads *tokens*, not words",
  rows: [
    { label: "lowercase", tokens: ["ici", " c", "'est", " Marseille"] },
    { label: "one capital letter", tokens: ["I", "ci", " c", "'est", " Marseille"] },
    { label: "English", tokens: ["Hello", ",", " how", " are", " you", "?"] },
  ],
  link: { text: "Try it: platform.openai.com/tokenizer", url: "https://platform.openai.com/tokenizer" },
  notes: notes(
    "A token is a piece of text: a word, part of a word, or punctuation. Each colour = one token.",
    "Row 1: \"ici c'est Marseille\" = 19 characters, 4 tokens.",
    "Row 2: the same sentence with a capital I = 5 tokens. One capital letter changes how it is cut. The AI doesn't see words; it sees pieces.",
    "Row 3: \"Hello, how are you?\" also 19 characters, 6 tokens (every word and punctuation mark is one token in English). Check it live before class: tokenizers change with models.",
    "Why it matters: you pay and you are limited in tokens, not words. Roughly 1 token ≈ 4 characters in English; French usually needs more tokens.",
    "Last click: the link. Open it live (it's clickable in slide show) and type a student's name.",
  ),
});

deck.vectors({
  bg: "blue",
  title: "From words to *numbers*",
  sentence: "The dog eats its kibble",
  rows: [
    { token: "The", vector: "[67, -78, -56, 1, 0, 6]" },
    { token: "dog", vector: "[-79, 8, 56, 8, 20, 5]" },
    { token: "eats", vector: "[47, 78, 12, -89, 2, 7]" },
    { token: "its", vector: "[87, 13, -85, -17, 7, 6]" },
    { token: "kibble", vector: "[-34, 4, 6, 46, -21, 5]" },
  ],
  notes: notes(
    "Step 1: the sentence is cut into tokens.",
    "Step 2: each token becomes a vector, a list of numbers that places it on a map of meaning.",
    "These numbers are made up for the example. Real vectors have thousands of numbers.",
    "Words with close meanings get close numbers: \"dog\" sits near \"puppy\" and \"cat\", far from \"invoice\".",
    "From here on, the AI only calculates with numbers. It never \"reads\" like we do.",
  ),
});

deck.question({
  bg: "coral",
  title: "It only predicts the next word.",
  underline: "next",
  tag: "Finish the sentence",
  question: "The cat sat on the…",
  notes: notes("Let the room finish the sentence. Everyone says \"mat\" or \"sofa\". That's exactly what the AI does: it picks the most likely next word, then the next, then the next."),
});

deck.cards({
  bg: "blue",
  title: "Every next word is a *bet*",
  cards: [
    { kicker: "VERY LIKELY", label: "mat" },
    { kicker: "LIKELY", label: "sofa" },
    { kicker: "POSSIBLE", label: "floor" },
    { kicker: "UNLIKELY", label: "moon" },
  ],
  stress: 0,
  footer: "Your context changes the odds",
  notes: notes(
    "The model gives every possible next word a probability, then picks one, usually among the most likely.",
    "That's why the same question can give different answers: a bit of chance is built in (called \"temperature\").",
    "Footer: if the sentence started with \"In the rocket, the cat sat on the…\", \"moon\" becomes likely. Context changes the odds.",
  ),
});

deck.pair({
  bg: "amber",
  title: "Context *steers* the answer",
  left: { kicker: "Same word", text: "\"bank\"" },
  line: "A river nearby, or money talk?",
  right: { text: "Your context picks the *river* bank or the *money* bank." },
  notes: notes(
    "\"I sat on the bank and watched the water\" vs \"I need to call my bank about my card\".",
    "The transformer's \"attention\" looks at the other words to decide which meaning applies.",
    "The more context you give, the better it guesses what you mean.",
  ),
});

deck.contrast({
  bg: "purple",
  title: "Is it *intelligent*?",
  tile: { big: "No", small: "it predicts" },
  wrong: { kicker: "What it looks like", text: "It *understands* me." },
  right: { kicker: "What really happens", text: "It calculates the most likely next word." },
  notes: notes(
    "Back to the morning question: smart, or very good at guessing?",
    "It sounds like it understands because it learned from billions of human texts.",
    "But it has no intention, no experience, no idea if it's true. That's why it can invent facts with confidence (\"hallucinations\").",
  ),
});

deck.cards({
  bg: "teal",
  title: "A classic model answers *at once*",
  cards: [
    { kicker: "STEP 1", label: "You ask", note: "your prompt" },
    { kicker: "STEP 2", label: "Word by word", note: "each word is a new bet" },
    { kicker: "STEP 3", label: "No going back", note: "it can't rewrite a word" },
  ],
  footer: "Fast, but it never reconsiders",
  notes: notes(
    "A classic chat model (like the first ChatGPT) starts answering immediately.",
    "It writes one word at a time, each word a bet based on the words before.",
    "Once a word is written, it can't go back. If it starts down a wrong path, it keeps going and justifies it.",
    "Example: ask a tricky maths or logic question; a classic model often answers fast and wrong.",
  ),
});

deck.checklist({
  bg: "coral",
  title: "A reasoning model *thinks first*",
  lead: "First, a hidden draft:",
  items: ["Breaks it into steps", "Tries, then checks", "Fixes, then answers"],
  side: { big: "Still prediction. Just more of it." },
  notes: notes(
    "Newer \"reasoning\" models (OpenAI o-series and GPT-5 Thinking, Claude with extended thinking, Gemini Thinking, DeepSeek-R1) write a draft you usually don't see before answering.",
    "In that draft they split the problem into steps, try an answer, check it, and correct their mistakes.",
    "You can see it: \"Thought for 12 seconds\", with a summary of the reasoning.",
    "Side card: it is still next-word prediction, just a lot more of it. It is slower and costs more, but it's much better at maths, code and planning.",
    "Tip: use reasoning mode for hard problems, the fast mode for simple writing.",
  ),
});

// ── The chat tools ────────────────────────────────────────────────────────
deck.gallery({
  bg: "blue",
  title: "Not all chat tools are *born equal*",
  items: [
    { image: img("l_chatgpt.png"), label: "ChatGPT", note: "OpenAI" },
    { image: img("l_claude.png"), label: "Claude", note: "Anthropic" },
    { image: img("l_gemini.png"), label: "Gemini", note: "Google" },
    { image: img("l_copilot.png"), label: "Copilot", note: "Microsoft" },
  ],
  footer: "All have a free version",
  notes: notes(
    "ChatGPT: the most used, good all-rounder.",
    "Claude: strong at writing, long documents and code.",
    "Gemini: built into Google (Docs, Gmail, Drive).",
    "Copilot: built into Microsoft (Word, Excel, Teams); students often have it free with their university account.",
    "They were not all born equal: each comes from a different company with different strengths. Pick by task, not by habit.",
    "All four have a free version. We use several during the week and compare.",
  ),
});

deck.gallery({
  bg: "purple",
  title: "Also worth *knowing*",
  items: [
    { image: img("l_mistral.png"), label: "Le Chat", note: "Mistral AI, French" },
    { image: img("l_grok.jpg"), label: "Grok", note: "xAI, built into X" },
    { image: img("l_perplexity.png"), label: "Perplexity", note: "search with sources" },
    { image: img("l_deepseek.png"), label: "DeepSeek", note: "China, open models" },
    { image: img("l_qwen.png"), label: "Qwen", note: "Alibaba, open models" },
  ],
  footer: "Mind where your data goes",
  notes: notes(
    "Le Chat by Mistral AI: the French champion, based in Paris, fast and GDPR-friendly. The French state's choice: France Travail partnered with Mistral in 2025, and the armed forces ministry signed a framework agreement in January 2026.",
    "Grok by xAI (Elon Musk): built into X, with access to live posts. A major player; also the most controversial on content moderation.",
    "Perplexity: an AI search engine that cites its sources. Good for research.",
    "DeepSeek and Qwen: Chinese models, very strong and open (anyone can download them). Data from their apps is stored in China.",
    "Footer: never paste personal or confidential data (yours, your employer's, your classmates') into a free tool. GDPR applies.",
  ),
});

// ── A first look at prompting ─────────────────────────────────────────────
deck.statement({ bg: "teal", tag: "Part 0.6", lines: ["First steps in", "*prompting*"], notes: notes("Prompt engineering = the art of writing instructions for an AI. It's the skill we build all week.") });

deck.contrast({
  bg: "coral",
  title: "Good prompt, *bad prompt*",
  tile: { big: "?", small: "Which one works?" },
  wrong: { kicker: "Bad prompt", text: "Write a post about our *tapenade.*" },
  right: { kicker: "Good prompt", text: "Food marketer: 3 Instagram posts, organic tapenade, 100 words, friendly." },
  notes: notes(
    "Before showing anything, ask: what makes a prompt good or bad? Collect 3–4 answers.",
    "Bad prompt: no role, no audience, no goal, no format. The AI fills the gaps with the most average answer.",
    "Good prompt: a role, a precise task, a number, a format and a tone. Same AI, much better result.",
    "Optional: run both live in ChatGPT and compare.",
  ),
});

deck.cards({
  bg: "blue",
  title: "Three *essentials*",
  cards: [
    { kicker: "1 · CLARITY", label: "Clear, precise", note: "Why: vague in, vague out" },
    { kicker: "2 · CONTEXT", label: "Give context", note: "Why: it knows nothing about you" },
    { kicker: "3 · INSTRUCTIONS", label: "Say it plainly", note: "Why: it can't read your mind" },
  ],
  notes: notes(
    "Clarity and precision: simple sentences, no ambiguity, be specific. A vague request gets a vague, generic answer.",
    "Context: the subject, the tone you want, the audience. The AI starts from zero every time; it doesn't know you, your class or your project.",
    "Explicit instructions: say exactly what you expect (length, format, steps). It won't guess what you didn't write.",
  ),
});

deck.points({
  bg: "purple",
  title: "Five steps to a *good prompt*",
  items: [
    { label: "Define your objectives", note: "what for? what result? which format, style, language?" },
    { label: "Give context", note: "who you are, what you want, for whom, for what use" },
    { label: "Analyse and check", note: "think critically: verify the facts, rephrase if it's off" },
    { label: "Refine and discuss", note: "guide it, add examples, go back, split into steps" },
    { label: "Make it yours", note: "it's never perfect: add your value, then put it to use" },
  ],
  notes: notes(
    "1. Objectives: what will you use it for? Do you know what you want at the end? Any format, style or language requirements?",
    "2. Context: the more context, the more precise the answer. Who are you, what do you want, for whom, why, at what level?",
    "3. Analyse and check: you need to know enough about the topic to judge the answer, or check other sources. Rephrase if it's far off; dig deeper if it's good.",
    "4. Refine and discuss: talk to it like an assistant who needs material and feedback. Add details, give examples, go back, validate, split into steps.",
    "5. Make it yours: the result is never perfect. Add your own value and be creative in how you use it.",
  ),
});

deck.colorText({
  bg: "blue",
  title: "The *structured* prompt",
  parts: TAPENADE,
  notes: notes(
    "A structured prompt: six parts written as one normal paragraph. A good prompt reads like a clear brief to a colleague.",
    "The colours are a checklist: before you send a prompt, can you find each colour in it?",
  ),
});

deck.decompose({
  bg: "teal",
  title: "A structured prompt, *piece by piece*",
  parts: TAPENADE,
  notes: notes(
    "Read each part aloud as it appears. After each, ask: what would the answer look like without this part?",
    "Role: sets the expertise and vocabulary. Context: who we are. Objective: the task. Expected result: why we do it. Constraints: what must be in it. Format: length and tone.",
  ),
});

deck.cards({
  bg: "amber",
  title: "Prompt *structures* to remember",
  cards: [
    { kicker: "SIMPLE", label: "RTF", note: "Role, Task, Format" },
    { kicker: "PRECISE", label: "RTCE", note: "Role, Task, Constraints, Examples" },
    { kicker: "COMPLETE", label: "CO-STAR", note: "Context, Objective, Style, Tone, Audience, Response" },
  ],
  notes: notes(
    "Three ready-made structures, from quick to complete.",
    "RTF for everyday requests. RTCE when you need precision; examples are the most powerful part. CO-STAR for anything public-facing.",
    "They all contain the same colours as our tapenade prompt. Pick one; the structure matters more than which one.",
  ),
});

deck.points({
  bg: "coral",
  title: "Exercise: *improve* your last prompt",
  items: [
    { label: "Open the last prompt you wrote", note: "in any chat tool" },
    { label: "Rebuild it with a structure", note: "the 6 colours, RTF, RTCE or CO-STAR" },
    { label: "Make it better", note: "add context, constraints and a format" },
    { label: "Test it", note: "same tool, in a new chat" },
    { label: "Share what changed", note: "in the answer, and in how it reasoned" },
  ],
  notes: notes(
    "20 minutes, alone, then share in pairs.",
    "No old prompt? Use: \"Help me prepare for a job interview.\"",
    "New chat matters: the AI remembers the conversation, so a fresh chat gives a fair comparison.",
    "Debrief: 3 volunteers read before and after. Ask: what changed in the output? In the reasoning (did it ask questions, plan, check)?",
  ),
});

deck.decompose({
  bg: "teal",
  title: "Inside a *master prompt*",
  parts: [
    { tag: "Expert role", text: "You are a recruitment and ATS expert (Taleez, Flatchr, Recruitee…) who knows their keyword logic.", color: "FFE066" },
    { tag: "Mission", text: "Optimise the Experience section of a CV for one job ad, so it passes ATS filters.", color: "8CE99A" },
    { tag: "Inputs first", text: "First ask for the current CV and the full job ad.", color: "FFA94D" },
    { tag: "Numbered steps", text: "Find the ad's 30 key words, find the CV's gaps, then rewrite.", color: "74C0FC" },
    { tag: "Measurable rules", text: "6 lines per job, 85–90 characters each, one keyword per line, 40 lines max.", color: "F783AC" },
    { tag: "Deliverables", text: "The new section, the 30 keywords and a 5-line explanation.", color: "B197FC" },
  ],
  notes: notes(
    "This is my recruiting master prompt (the ATS CV prompt from the Simplon job-search course), summarised in English. The full English text is in the students' shared doc.",
    "ATS = Applicant Tracking System: software that filters CVs by keywords before a human reads them.",
    "What makes it \"mega\": an expert role with precise knowledge, inputs requested first, numbered steps, rules you can measure (characters, lines, numbers) and a clear list of deliverables.",
    "Reverse engineering: if we keep the shape and remove the CV topic, we get a recipe for any master prompt. Next slide.",
  ),
});

deck.decompose({
  bg: "blue",
  title: "The master prompt *generator*",
  parts: [
    { tag: "Role", text: "You are an expert prompt engineer who builds reusable master prompts.", color: "FFE066" },
    { tag: "Mission", text: "Write a master prompt for the task I describe, one I can reuse every time.", color: "8CE99A" },
    { tag: "Ask first", text: "First ask me 5 questions: task, audience, inputs, result, limits.", color: "FFA94D" },
    { tag: "Structure", text: "Include: role, mission, inputs, numbered steps, rules, deliverables.", color: "74C0FC" },
    { tag: "Measurable", text: "Turn every rule into numbers or checklists. End with a self-check step.", color: "F783AC" },
    { tag: "Format", text: "One copy-ready block, then 3 lines on why it works.", color: "B197FC" },
  ],
  notes: notes(
    "The same anatomy, turned into a machine that writes mega prompts for any task.",
    "Demo: paste it into ChatGPT or Claude, answer its 5 questions for \"prepare me for a job interview at L'Oréal\", and show the master prompt it produces.",
    "The full text is in the file master_prompt_generator.md; share it with the students now.",
    "We use it in Part 7 to build everyone's personal master prompt.",
  ),
});
deck.points({
  bg: "amber",
  title: "Testing: *prompt generators*",
  items: [
    { label: "Try an online generator", note: "feedough.com/ai-prompt-generator", url: "https://www.feedough.com/ai-prompt-generator/" },
    { label: "Build a master prompt to write the prompt", note: "\"Write me the best prompt to…\"" },
    { label: "Compare with your improved prompt", note: "which answer is better, and why?" },
  ],
  notes: notes(
    "15 minutes. The link is clickable in slide show.",
    "Second option: use the master prompt generator (previous slide) to write the prompt. The AI is good at writing prompts for itself.",
    "Compare: generator vs their own improved prompt. Usually the best is a mix: the generator's structure plus their own context.",
  ),
});


deck.colorText({
  bg: "teal",
  title: "Recap: the *six colours*",
  parts: TAPENADE,
  notes: notes(
    "The tapenade prompt we just built. Each colour is one part of a good prompt: role, context, objective, expected result, constraints, format.",
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
    "The three ready-made structures from part 0.6. Quick check: which one would you use for an email to a teacher?",
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
    { title: "ChatGPT", sub: "OpenAI", color: "10A37F", items: ["Custom instructions", "Memory", "Projects", "Custom GPTs (soon to be plugins)"] },
    { title: "Claude", sub: "Anthropic", color: "D97757", items: ["Profile preferences", "Memory", "Projects"] },
    { title: "Gemini", sub: "Google", color: "4285F4", items: ["Instructions for Gemini", "Memory", "Gems (soon to be skills)"] },
  ],
  notes: notes(
    "Each heading lands, then where personalisation lives in that tool.",
    "ChatGPT: Settings → Personalization for custom instructions and memory; Projects in the sidebar; custom GPTs in the GPTs section.",
    "Claude: Settings for your profile preferences and memory; Projects in the sidebar.",
    "Gemini: Settings for instructions and memory; Gems are custom assistants with their own instructions.",
    "Changing now: OpenAI retires custom GPTs on 11 December 2026 and replaces them with plugins (OpenAI help centre, \"Custom GPT retirement and migration FAQ\"). Google starts turning Gems into Skills on 17 November 2026 (9to5Google, September 2026).",
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


deck.question({
  bg: "purple",
  title: "Want my custom instructions?",
  underline: "my",
  tag: "Disclaimer: it is brutal",
  question: "Fed up with an AI that always agrees with you?",
  notes: notes(
    "Only try it if you are fed up with the AI agreeing with you: my own custom instructions turn it into a brutally honest advisor.",
    "Disclaimer: it is brutal. It will challenge your thinking, not flatter you.",
    "Next slide: the prompt, part by part. The full text is in the students' shared doc, ready to copy.",
  ),
});

deck.decompose({
  bg: "teal",
  title: "Copy my *custom instructions*",
  parts: [
    { tag: "Role", text: "Act as my brutally honest, high-level advisor and mirror.", color: C.role },
    { tag: "Constraints", text: "Don't validate me. Don't soften the truth. Don't flatter.", color: C.constraints },
    { tag: "Objective", text: "Challenge my thinking, question my assumptions, expose my blind spots.", color: C.objective },
    { tag: "Call it out", text: "Point out excuses, self-deception, wasted time and the opportunity cost.", color: C.context },
    { tag: "Expected result", text: "A precise, prioritized plan: what to change in my thoughts, actions, mindset.", color: C.result },
    { tag: "Format", text: "Ask me clarifying questions one by one, then answer from what I told you.", color: C.format },
  ],
  notes: notes(
    "My own custom instructions, shown with the six colours: the same anatomy as any good prompt.",
    "The slide shortens each part. The full text (1,112 characters, fits ChatGPT's free custom-instructions limit) is in the students' shared doc.",
    "Paste it in Settings → custom instructions, or in a project's instructions for one topic.",
    "Warn them: honest is not the same as right. The AI only knows what you tell it; judge its advice yourself.",
  ),
});

deck.points({
  bg: "blue",
  title: "Exercise: *test* my instructions",
  items: [
    { label: "Create a project", note: "Projects in ChatGPT or Claude, a Gem in Gemini" },
    { label: "Paste my instructions", note: "as the project's instructions" },
    { label: "Give it something you have created", note: "no one else's personal data" },
    { label: "Answer its questions", note: "one at a time" },
    { label: "Check out the result" },
  ],
  notes: [
    "Prompt to paste (also in the students' shared doc, tab \"Honest advisor\"):",
    HONEST,
    "",
    notes(
      "20 minutes, alone.",
      "Something they created: a CV, a cover letter, an essay plan, a project idea, a LinkedIn profile.",
      "It should ask questions first, one at a time, then give a brutally honest review and a prioritised plan.",
      "Debrief: who was surprised by the answer? Honest is not the same as right: did they agree with it?",
    ),
  ].join("\n"),
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
    "Use one of the 3 tasks from the Day 1 homework if you wrote them.",
    "Check in pairs: can your partner tell what a good result looks like from your O?",
  ),
});

// ── Part 4: The funnel ────────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 4", lines: ["*My way:*", "the funnel", "(social prompting)"], notes: notes("My own way of prompting, from my toolbox: social prompting, borrowing the method of the best.") });

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
    "A worked example: 4 real prompts in a row, in the same chat.",
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
deck.statement({ bg: "teal", tag: "Part 5", lines: ["Prompt structures,", "*deeper*"], notes: notes("Part 0.6: the six colours. Now: what makes each one powerful, and when to split a prompt.") });

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
    { kicker: "STEP BY STEP", label: "Ask in stages", note: "plan first, then write" },
    { kicker: "SELF-CHECK", label: "Ask it to check", note: "against your own rules" },
  ],
  footer: "Examples beat adjectives",
  stress: 0,
  notes: notes(
    "Few-shot: give 2 or 3 examples of the result you want. \"Here are two posts I like; write a third in the same style.\" \"Shot\" = example.",
    "Step by step: ask it to work in stages: \"First list the key points, then plan, then write.\" Fewer mistakes, and you can correct each stage.",
    "Self-check: end with \"Before you answer, check your answer against my rules and fix what doesn't fit.\" The same last step as the master prompt generator from part 0.6.",
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
  title: "Recap: inside a *master prompt*",
  parts: [
    { tag: "Expert role", text: "You are a recruitment and ATS expert (Taleez, Flatchr, Recruitee…) who knows their keyword logic.", color: C.role },
    { tag: "Mission", text: "Optimise the Experience section of a CV for one job ad, so it passes ATS filters.", color: C.context },
    { tag: "Inputs first", text: "First ask for the current CV and the full job ad.", color: C.objective },
    { tag: "Numbered steps", text: "Find the ad's 30 key words, find the CV's gaps, then rewrite.", color: C.result },
    { tag: "Measurable rules", text: "6 lines per job, 85–90 characters each, one keyword per line, 40 lines max.", color: C.constraints },
    { tag: "Deliverables", text: "The new section, the 30 keywords and a 5-line explanation.", color: C.format },
  ],
  notes: notes(
    "My recruiting master prompt from part 0.6: the shape every master prompt follows.",
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
    { label: "Store it", note: "your project, as a skill, a doc, the class library" },
  ],
  notes: notes(
    "Why 3 times: the AI has built-in chance (part 0.5: temperature). One good run can be luck.",
    "If the results differ, the prompt leaves too much to guess. Add a measurable rule (\"exactly 5 points\"), an example, or a step.",
    "Versioning: name it \"Weekly summary v2, 14 Nov\". You'll thank yourself in a month.",
  ),
});

deck.points({
  bg: "coral",
  title: "Exercise: your first *master prompt*",
  items: [
    { label: "Take your ODS task from Part 3" },
    { label: "Paste the master prompt generator" },
    { label: "Answer its 5 questions" },
    { label: "Run the result 3 times", note: "with real input" },
    { label: "Fix it and save v1", note: "in your course project" },
  ],
  notes: notes(
    "30 minutes, alone, then show a neighbour.",
    "The generator is the file master_prompt_generator.md shared in part 0.6.",
    "No ODS task? Use the weekly study summary.",
    "Walk around: check that every master prompt has measurable rules and a clear list of deliverables.",
  ),
});

// ── Part 8: Hack master prompts ───────────────────────────────────────────
deck.statement({ bg: "blue", tag: "Part 8", lines: ["*Hack* master prompts", "Master prompt inception"], notes: notes("Inception: a master prompt that writes master prompts. My \"Prompt architect\" mode: you paste it once at the start of a chat, and from then on it turns every request into a structured master prompt.") });

deck.points({
  bg: "coral",
  title: "Exercise: *architect* your prompt",
  items: [
    { label: "Paste the architect prompt", note: "in a new chat" },
    { label: "Ask for the prompt you need", note: "a real task from your studies or job search" },
    { label: "Answer its 7 questions", note: "one at a time" },
    { label: "Test the prompt it gives you", note: "in another new chat" },
    { label: "Save it as v1", note: "in the class library" },
  ],
  notes: [
    "Prompt to paste (also in the students' shared doc, tab \"Prompt architect\"):",
    ARCHITECT,
    "",
    notes(
    "20 minutes, alone. The architect prompt is in the students' shared doc, ready to copy.",
    "Ideas: a cover letter for one job ad, a weekly revision plan, a LinkedIn \"About\" section.",
    "Compare with the master prompt from Part 7: which one is more precise?",
    ),
  ].join("\n"),
});

// ── Part 9: Responsible use ───────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 9", lines: ["Use AI", "*responsibly*"], notes: notes("Three questions before you prompt: what does it cost the planet, what data am I giving, and am I being honest about it?") });

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
    "Next session: your master prompt becomes a bot, then your own subject expert, scheduled tasks, and AI that answers from your documents (RAG, NotebookLM).",
    "Homework: run your master prompt once on real coursework before next session.",
  ),
});

deck.build();