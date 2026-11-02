// Day 1 — AI in Practice, Université Côte d'Azur (Cannes campus). v3.
// Built from Fadi's Simplon decks, CV and feedback. Notes: "•" lines are talking points.
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
  title: "Day 1 — Where AI comes from and how it thinks",
  author: "Fadi Fouladgar",
  out: "UCA_AI_Day1.pptx",
});

// ── Opening ───────────────────────────────────────────────────────────────
deck.cover({
  bg: "coral",
  tag: "AI in Practice · Day 1",
  headline: "Where AI comes from and how it *thinks*",
  crossed: [
    { label: "Magic", note: "It is not magic." },
    { label: "A brain", note: "It is not a brain." },
  ],
  answer: { label: "Prediction", note: "very good guesses from data" },
  sub: "Today: where AI comes from, how it works, and why it only seems intelligent.",
  notes: notes(
    "Welcome everyone. Six days, all hands-on: every session ends with something you made.",
    "Before we start: quick positioning quiz (Wooclap or Google Forms, 5 min). We repeat it on Day 6 to measure progress.",
    "Click by click: AI is not magic, not a brain. It is prediction. That one idea runs through the whole day.",
  ),
});

deck.points({
  bg: "blue",
  title: "Today's *journey*",
  items: [
    { label: "Who we are", note: "me, you, and what AI leaders say" },
    { label: "AI is already in your life", note: "and a short history" },
    { label: "What AI is", note: "how people use it" },
    { label: "How machines learn", note: "classification, regression, vision" },
    { label: "Tokens and prediction", note: "why it is not intelligence" },
    { label: "First steps in prompting", note: "good prompts and the chat tools" },
  ],
  notes: notes(
    "The plan for today, in six parts. Morning: parts 1 to 3. Afternoon: parts 4 to 6.",
    "Each part has a short exercise. Breaks around 10:30 and 15:00.",
  ),
});

// ── Who we are ────────────────────────────────────────────────────────────
deck.profile({
  bg: "teal",
  title: "Who I am and *what I do*",
  name: "Fadi Fouladgar",
  role: "AI integration and growth trainer",
  lines: [
    "I train students, job seekers and entrepreneurs to use AI for real results.",
    "Growth marketing and digital transformation consultant.",
    "I teach in English, French and Arabic.",
  ],
  facts: [
    { big: "25+", small: "years in marketing, sales and training" },
    { big: "15+", small: "countries: Europe, Middle East, Asia, USA" },
    { big: "1,000+", small: "professionals trained" },
    { big: "50+", small: "people in the teams I have led" },
  ],
  wide: {
    label: "Diplomas",
    lines: [
      "Bachelor, Digital Marketing · Oreegami Academy with Google France (2023)",
      "Business Computing · C&E American University Institute (1995)",
    ],
  },
  notes: notes(
    "Click 1, the ID card: today I train people to use AI: Simplon, Rocket School, France Travail, and here at Université Côte d'Azur.",
    "My background is marketing: Marketing Director at Total Media Cast (media group, MENA and Europe), 14 years Marketing Manager at Dar El Marefah (publishing, 14 countries), and before that Hospitality Marketing Concepts in California (luxury hotels, Le Méridien).",
    "Tiles: 25+ years, 15+ countries, more than 1,000 people trained, teams of up to 52 people.",
    "Why it matters for you: I use AI every day for real work, not in theory. Everything I show you, I use.",
    "Keep it to 2 minutes. Then move to them: this course is about you.",
  ),
});

deck.logos({
  bg: "blue",
  title: "Who I have *worked with*",
  cols: 4,
  items: [
    { image: img("b_simplon.png"), name: "Simplon" },
    { image: img("b_uca.png"), name: "Université Côte d'Azur" },
    { text: "France Travail", color: "1E3A8A", name: "France Travail" },
    { text: "Rocket School", color: "E8453C", name: "Rocket School" },
    { image: img("b_google.png"), name: "Google" },
    { image: img("b_ipsos.png"), name: "Ipsos" },
    { image: img("b_france24.png"), name: "France 24" },
    { image: img("b_aljazeera.png"), name: "Al Jazeera" },
    { image: img("b_alarabiya.png"), name: "Al Arabiya" },
    { image: img("b_foxnews.png"), name: "Fox News" },
    { image: img("b_lemeridien.png"), name: "Le Méridien" },
    { text: "Choueiri Group", color: "16131F", name: "Choueiri Group" },
  ],
  footer: "Training · media · hospitality · publishing",
  notes: notes(
    "Row 1, training: Simplon, Université Côte d'Azur, France Travail, Rocket School. AI workshops for students, job seekers and entrepreneurs.",
    "Row 2, media (Total Media Cast): Google, Ipsos and DMS Choueiri Group were key accounts; France 24, Fox News, Al Jazeera and Al Arabiya were partnerships.",
    "Row 3: Le Méridien, where I set up marketing departments with Hospitality Marketing Concepts.",
    "Say exactly what each relationship was: client, partner or employer. Students respect precision.",
  ),
});

deck.points({
  bg: "amber",
  title: "Now, *present yourself*",
  items: [
    { label: "Your name" },
    { label: "Your major", note: "what you study" },
    { label: "The job you are aiming for" },
    { label: "Your goal in this course" },
    { label: "What you expect from it" },
    { label: "AI tools you have tried", note: "and how often you use them" },
    { label: "What you want to learn about AI" },
  ],
  notes: notes(
    "One minute each, maximum. Go around the room; I take notes.",
    "Listen for: their majors and target jobs (use them as examples all week), their level with AI, and their fears.",
    "Write the tools they name on the board. Come back to it on Day 6: who tried something new?",
    "If the group is big: pairs present each other in 30 seconds.",
  ),
});

deck.quotes({
  bg: "purple",
  title: "What AI leaders *say*",
  items: [
    { logo: img("b_google.png"), mark: "+", markColor: "1FAE6B", quote: "“AI is one of the most important things humanity is working on. It is more profound than… electricity or fire.”", who: "Sundar Pichai", role: "CEO, Google · 2018" },
    { logo: img("b_google.png"), mark: "+", markColor: "1FAE6B", quote: "“10 times bigger than the Industrial Revolution, and maybe 10 times faster.”", who: "Demis Hassabis", role: "CEO, Google DeepMind · 2025" },
    { logo: img("q_nvidia.png"), mark: "!", markColor: "E8453C", quote: "“You're not going to lose your job to an AI, but you're going to lose your job to someone who uses AI.”", who: "Jensen Huang", role: "CEO, Nvidia · 2025" },
    { logo: img("q_anthropic.png"), mark: "!", markColor: "E8453C", quote: "AI could wipe out half of all entry-level white-collar jobs within five years.", who: "Dario Amodei", role: "CEO, Anthropic · 2025 (Axios)" },
    { logo: img("l_chatgpt.png"), mark: "!", markColor: "E8453C", quote: "“If this technology goes wrong, it can go quite wrong.”", who: "Sam Altman", role: "CEO, OpenAI · US Senate, 2023" },
    { logo: img("l_mistral.png"), mark: "?", markColor: "16131F", quote: "“The whole AGI rhetoric is about creating God. I don't believe in God.”", who: "Arthur Mensch", role: "CEO, Mistral AI · 2024" },
  ],
  notes: notes(
    "Read each quote aloud as it lands. Green + = enthusiast, red ! = warning, ? = sceptic.",
    "Pichai (Recode/MSNBC town hall, 2018). Hassabis (The Guardian, Aug 2025). Huang (Milken conference, May 2025).",
    "Amodei is a paraphrase, not a word-for-word quote: in Axios (May 2025) he warned half of entry-level white-collar jobs could go within 1–5 years, unemployment 10–20%. It is one CEO's forecast, not a fact.",
    "Altman said it at the US Senate hearing, 16 May 2023, asking for regulation.",
    "Mensch (New York Times, April 2024): the French voice. He thinks AGI talk is almost religious.",
    "Point to make: the people who build AI disagree with each other. Also: Geoffrey Hinton (Nobel 2024) gives 10–20% odds of AI causing extinction within 30 years; Yann LeCun (Meta) says a house cat has more common sense than any LLM.",
  ),
});

deck.cards({
  bg: "coral",
  title: "Your turn: *hopes and fears*",
  cards: [
    { kicker: "QUESTION 1", label: "Hopes", note: "what excites you about AI?" },
    { kicker: "QUESTION 2", label: "Fears", note: "jobs, cheating, privacy…?" },
    { kicker: "QUESTION 3", label: "Your vote", note: "which quote do you agree with?" },
  ],
  footer: "No wrong answers",
  notes: notes(
    "Quick round: 1 hope and 1 fear each, on sticky notes or in Wooclap (word cloud works well).",
    "Group the fears on the board: jobs, cheating at school, fake news, privacy, losing skills. Keep the board: we answer these fears during the week.",
    "Vote by show of hands on the quotes: enthusiast, warning or sceptic.",
    "Don't argue with fears. Acknowledge them; the course gives them tools, and tools reduce fear.",
  ),
});

deck.pair({
  bg: "teal",
  title: "AI in *one sentence*",
  left: { kicker: "The simplest version", text: "It learns, then guesses." },
  line: "Nobody writes the rules: it finds them in the data.",
  right: { text: "It *learns patterns* from examples, then *predicts*." },
  notes: notes(
    "Left: the short version to remember. AI learns from examples, then makes guesses.",
    "Line: classic software follows rules a person wrote. AI finds its own rules in the data.",
    "Right: predict what? The next word (ChatGPT), the right label (spam or not), the best move (chess), the price (house).",
    "Everything today comes back to this sentence.",
  ),
});

deck.question({
  bg: "purple",
  title: "Is that really intelligence?",
  underline: "really",
  tag: "Your opinion",
  question: "Smart, or just very good at guessing?",
  notes: notes(
    "Ask them to vote: smart, or very good at guessing? Then let 2–3 people defend their answer.",
    "Don't give the answer yet. We come back to it in Part 5, after tokens: \"It only predicts the next word.\"",
  ),
});

// ── AI is already in your life ────────────────────────────────────────────
deck.question({
  bg: "blue",
  title: "You have already used AI today.",
  underline: "already",
  tag: "Before 10 a.m.",
  question: "How many times did AI touch your morning?",
  notes: notes(
    "Let them guess a number. Most say 0 or 1. The real answer is usually 10 or more.",
    "Hint: your alarm, your phone unlock, your music, your feed, your route to campus.",
  ),
});

deck.gallery({
  bg: "teal",
  title: "AI is *already everywhere*",
  items: [
    { image: img("recommendation.png"), label: "Recommendations", note: "Netflix, YouTube, Spotify" },
    { image: img("driving.png"), label: "Driving help", note: "GPS, lane assist" },
    { image: img("smartphones.png"), label: "Your phone", note: "face unlock, photos, keyboard" },
    { image: img("speakers.png"), label: "Voice assistants", note: "Siri, Alexa, Google" },
  ],
  footer: "None of these is ChatGPT",
  notes: notes(
    "Recommendations: they learn what you watch and suggest more. Driving: GPS predicts traffic. Phone: face unlock, photo sorting, the keyboard guessing your next word. Voice: turning speech into text.",
    "Footer: AI existed long before ChatGPT. It was just invisible.",
  ),
});

deck.points({
  bg: "amber",
  title: "Exercise: the *AI hunt*",
  items: [
    { label: "List every AI you used before 10 a.m.", note: "apps, devices, services" },
    { label: "Compare in pairs", note: "who found more?" },
    { label: "Share the most surprising one" },
  ],
  notes: notes(
    "10 minutes. Phones allowed: check the apps you opened this morning.",
    "Surprising answers to look for: bank fraud checks, spam filter, photo enhancement, Uber prices, Instagram filters.",
  ),
});

deck.statement({ bg: "blue", tag: "Part 1", lines: ["A short *history*"], notes: notes("75 years in 3 minutes. The goal: AI did not appear in 2022.") });

deck.gallery({
  bg: "purple",
  title: "From an idea to a *field*",
  items: [
    { image: img("turing.png"), kicker: "1950", label: "Alan Turing", note: "\"Can machines think?\"" },
    { image: img("perceptron.png"), kicker: "1958", label: "The perceptron", note: "a first artificial neuron" },
    { image: img("winter.png"), kicker: "1970s–80s", label: "AI winters", note: "big promises, weak computers" },
    { image: img("kasparov.png"), kicker: "1997", label: "Deep Blue", note: "beats Kasparov at chess" },
  ],
  notes: notes(
    "1950, Turing asks \"Can machines think?\" and proposes a test: can a machine pass for a human in a conversation?",
    "1956: the Dartmouth workshop gives the field its name, \"artificial intelligence\".",
    "1958, the perceptron: the first machine that learns, one artificial neuron (we see it in Part 2).",
    "AI winters: researchers promised human-level AI in 20 years. Computers were far too slow and data too scarce, so results disappointed and the funding was cut. Twice: in the 1970s and late 1980s. \"Winter\" = no money, no interest.",
    "1997: IBM's Deep Blue beats world chess champion Garry Kasparov. But by brute force, calculating millions of moves, not by learning.",
  ),
});

deck.gallery({
  bg: "teal",
  title: "From learning to *talking*",
  items: [
    { image: img("imagenet.png"), kicker: "2012", label: "Deep learning", note: "wins at recognising images" },
    { kicker: "2017", label: "Transformers", note: "AI reads whole sentences at once: the T in GPT" },
    { image: img("chatgpt.png"), kicker: "2022", label: "ChatGPT", note: "AI reaches everyone" },
    { kicker: "2024+", label: "Reasoning and agents", note: "AI that checks and acts" },
  ],
  notes: notes(
    "2012: a deep learning network wins the ImageNet image-recognition contest by a huge margin. Thanks to GPUs (graphics cards) and big data, the winters are over.",
    "2017, Transformers: Google researchers publish \"Attention Is All You Need\". Before, AI read a sentence word by word and forgot the start. The transformer looks at all the words at once and works out which ones matter for each other (\"attention\"). GPT = Generative Pre-trained Transformer.",
    "2022: ChatGPT reaches 100 million users in two months. AI becomes visible to everyone.",
    "2024 and after: models that reason before answering, and agents that take actions (browse, book, write code).",
    "Also: 2016, AlphaGo beats Lee Sedol at Go.",
  ),
});

deck.statement({
  bg: "coral",
  lines: ["AI did not arrive in 2022.", "It became *visible*."],
  notes: notes("The one sentence to remember from the history. 70 years of research; 2022 is when it got a chat window."),
});

// ── What AI is and how we use it ──────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 2", lines: ["What AI *is*", "and how we use it"], notes: notes("Now: what is inside, and what people actually do with it.") });

deck.nested({
  bg: "blue",
  title: "Technologies *inside each other*",
  rings: [
    { label: "Artificial intelligence", example: "A classic chatbot: rules written by people" },
    { label: "Machine learning", example: "Netflix learns what you like" },
    { label: "Deep learning", example: "Recognising faces and objects in images" },
    { label: "Generative AI", example: "ChatGPT writes, Midjourney draws" },
  ],
  notes: notes(
    "Like Russian dolls: each circle sits inside the one before.",
    "AI: any machine that imitates a human decision, even with rules written by hand (\"if the client types 1, show prices\").",
    "Machine learning: no hand-written rules; it learns them from examples.",
    "Deep learning: machine learning with many layers of artificial neurons. Good with images, sound and text.",
    "Generative AI: deep learning that creates new content: text, images, music, video.",
    "Keep this slide in mind: the sorting exercise uses these four circles.",
  ),
});

deck.gallery({
  bg: "amber",
  title: "Inspired by the *brain*",
  items: [
    { image: img("neuron_bio.png"), kicker: "BIOLOGICAL", label: "A neuron", note: "dendrites in, axon out, synapses connect" },
    { image: img("neuron_art.png"), kicker: "ARTIFICIAL", label: "A perceptron", note: "inputs × weights → sum → output" },
  ],
  notes: notes(
    "Click 1, the biological neuron: dendrites receive signals, the cell body adds them up, the axon sends a signal on. Synapses are the connections between neurons; they get stronger as we learn.",
    "Click 2, the artificial neuron: numbers come in (inputs), each is multiplied by a weight (how important it is), they are added up, and an activation function decides the output.",
    "Learning = adjusting the weights. Exactly like synapses getting stronger or weaker.",
    "Deep learning stacks thousands of these in layers. Inspired by the brain, but far simpler. (Labels in the images are in French.)",
  ),
});

deck.question({
  bg: "teal",
  title: "How many connections?",
  underline: "connections",
  tag: "Guess",
  question: "1 mm³ of brain: how many synapses?",
  notes: notes("1 mm³ is a grain of sand. Let them shout numbers. Write the guesses on the board."),
});

deck.stat({
  bg: "purple",
  tag: "1 mm³ of human brain · 2024 study",
  value: "150M",
  line: "*synapses* in 1 mm³ of brain",
  notes: notes(
    "150 million connections in a grain of sand of brain, plus about 57,000 cells.",
    "Source: Harvard and Google mapped 1 mm³ of human cortex (journal Science, May 2024). It took 1.4 petabytes of data to store that one cube.",
  ),
});

deck.cards({
  bg: "blue",
  title: "Brain vs AI: *how big?*",
  cards: [
    { kicker: "1 MM³ BRAIN", label: "synapses", value: "150M" },
    { kicker: "WHOLE BRAIN", label: "synapses", value: "100T" },
    { kicker: "GPT-3", label: "≈ 1.2 cm³ brain", value: "175B" },
    { kicker: "DEEPSEEK-V3", label: "≈ 4.5 cm³ brain", value: "671B" },
  ],
  footer: "A big AI ≈ a sugar cube of brain",
  stress: 3,
  notes: notes(
    "In AI, the equivalent of a synapse is a parameter: one connection weight. Roughly comparable, but a real synapse is far more complex.",
    "Whole brain: about 86 billion neurons and around 100 trillion synapses (estimates range 100 to 1,000 trillion). It runs on 20 watts, like a light bulb.",
    "GPT-3: 175 billion parameters = the synapses in about 1.2 cm³ of brain (175B ÷ 150M per mm³ ≈ 1,170 mm³).",
    "DeepSeek-V3: 671 billion parameters ≈ 4.5 cm³, about a sugar cube. GPT-4, Claude and Gemini sizes are secret; estimates of 1–2 trillion would still be under 15 cm³.",
    "Message: the biggest AIs are a sugar cube of brain, and they need data centres, not 20 watts.",
  ),
});

const USE_COLORS = ["7B3FBF", "C2187A", "F0605D", "F59E0B"];
deck.columns({
  bg: "teal",
  title: "How people use *generative AI*",
  columns: [
    { title: "The Teacher", sub: "Learn", color: USE_COLORS[0], items: ["Explains", "Coaches", "Advises", "Teaches new practices", "Gives methods", "Offers an outside view", "Constructive criticism"] },
    { title: "The Partner", sub: "Brainstorm", color: USE_COLORS[1], items: ["Analyses data", "Identifies options", "Evaluates decisions", "Challenges your choices", "Asks questions", "Builds strategies"] },
    { title: "The Creative", sub: "Co-create", color: USE_COLORS[2], items: ["Watches trends", "Brainstorms", "Inspires", "Generates ideas", "Innovates", "Links ideas, analogies", "Stimulates, provokes"] },
    { title: "The Expert", sub: "Delegate", color: USE_COLORS[3], items: ["Corrects, translates, summarises", "Writes: emails, texts, speeches, files, reports, tenders, articles", "Reproduces", "Improves", "Plans"] },
  ],
  notes: notes(
    "Four roles you can give the AI. Each header lands, then its uses one by one.",
    "Teacher: you learn with it. \"Explain this concept like I'm 15\", \"Quiz me\", \"Criticise my essay\".",
    "Partner: you think with it. \"Give me 3 options and their risks\", \"Challenge my plan\".",
    "Creative: you create with it. \"Give me 20 ideas\", \"Find an analogy from sport\".",
    "Expert: you hand work over. \"Summarise\", \"Translate\", \"Draft the email\", \"Plan my week\".",
    "Ask: which role do you use most? Most students only use the Expert. The best results come from the Teacher and the Partner.",
  ),
});

deck.columns({
  bg: "purple",
  title: "Four families of *use*",
  columns: [
    { title: "Content", sub: "Make", color: "4F46E5", items: ["Text", "Image", "Video", "Sound", "Formulas", "Code"] },
    { title: "Documents", sub: "Understand", color: "0EA5E9", items: ["Summaries", "Analysis", "Translation", "Classification"] },
    { title: "Conversation", sub: "Real time", color: "10B981", items: ["Chatbots and callbots", "Talking to your documents"] },
    { title: "Action", sub: "Automate · new", color: "F59E0B", items: ["Agents that do tasks", "Workflows (n8n, Make)", "Using a computer", "Scheduled tasks"] },
  ],
  notes: notes(
    "Content production: text, images, video, sound, Excel formulas, code.",
    "Document intelligence: summarise a 50-page report, analyse a contract, translate, sort emails by topic.",
    "Real-time interaction: chatbots and callbots (phone), and chatting with your own documents (NotebookLM, Day 4).",
    "The 4th family is new and growing: action. Agents that do tasks for you: browse, fill forms, send emails, run on a schedule. We build one on Day 5.",
    "My original slides had three families; I added Action because agents became mainstream in 2025.",
  ),
});

deck.gallery({
  bg: "teal",
  title: "AI before ChatGPT: *everyday tasks*",
  items: [
    { image: img("sentiment.png"), label: "Sentiment", note: "is this review happy or angry?" },
    { image: img("translate.png"), label: "Translation" },
    { image: img("chatbot.png"), label: "Chatbots" },
    { image: img("textclass.png"), label: "Sorting texts", note: "sport, tech, fashion…" },
  ],
  notes: notes(
    "These tasks existed before ChatGPT, with smaller specialised models.",
    "Sentiment: brands read thousands of reviews and tweets automatically. Translation: Google Translate since 2006, neural since 2016. Chatbots: the bank or airline bot. Sorting: news by topic, emails into folders.",
    "Today one model like ChatGPT does all four.",
  ),
});

deck.points({
  bg: "amber",
  title: "Exercise: *sort* the examples",
  items: [
    { label: "Work in groups of three", note: "one writes, one speaks, one checks" },
    { label: "Read the 12 examples", note: "on the next slide" },
    { label: "Place each one in a circle", note: "rules-based AI, machine learning, deep learning or generative AI" },
    { label: "Name its family of use", note: "content, documents, conversation or action" },
    { label: "Defend one choice", note: "then we reveal the answers together" },
  ],
  notes: notes(
    "15 minutes. Leave the next slide (the 12 examples) on screen while they work.",
    "Circles = slide \"Technologies inside each other\". Families = slide \"Four families of use\".",
    "Debrief: each group defends one example. Then click to reveal the answers.",
  ),
});

const A = { ml: ["Machine learning", "74C0FC"], dl: ["Deep learning", "B197FC"], gen: ["Generative AI", "F783AC"], rules: ["Rules-based AI", "FFE066"] };
const ex = (label, k) => ({ label, answer: A[k][0], answerColor: A[k][1] });
deck.grid({
  bg: "blue",
  title: "12 examples: *which circle?*",
  by: "row",
  items: [
    ex("Gmail spam filter", "ml"),
    ex("Netflix suggestions", "ml"),
    ex("Face ID unlocks your phone", "dl"),
    ex("Google Translate", "dl"),
    ex("ChatGPT writes an essay", "gen"),
    ex("Siri understands your voice", "dl"),
    ex("Google Maps arrival time", "ml"),
    ex("Bank fraud alert by SMS", "ml"),
    ex("Midjourney draws a poster", "gen"),
    ex("Website bot with a fixed menu", "rules"),
    ex("Your Instagram feed", "ml"),
    ex("Reading an X-ray scan", "dl"),
  ],
  reveal: "answers",
  notes: notes(
    "Three clicks show the examples, row by row. Leave them up during the exercise. The last click reveals the answers.",
    "Machine learning (learns from data, predicts or recommends): spam filter, Netflix, Maps arrival time, fraud alert, Instagram feed.",
    "Deep learning (images, sound, language): Face ID, Google Translate (neural since 2016), Siri, X-ray reading.",
    "Generative AI (creates something new): ChatGPT essay, Midjourney poster.",
    "Rules-based AI: the website bot with a fixed menu. A person wrote every rule.",
    "Accept good arguments: the circles are nested, so deep learning is also machine learning, and Netflix uses deep learning too. The point is to reason, not to memorise.",
  ),
});

// ── How machines learn ────────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 3", lines: ["How machines *learn*"], notes: notes("Two basic jobs a machine learns: predict a number, or pick a group.") });

deck.gallery({
  bg: "blue",
  title: "Two ways to *predict*",
  items: [
    { image: img("stock.png"), kicker: "REGRESSION", label: "A number", note: "tomorrow's stock price" },
    { image: img("house.png"), kicker: "REGRESSION", label: "A number", note: "the price of a house" },
    { image: img("bank.png"), kicker: "CLASSIFICATION", label: "A group", note: "loan: yes or no?" },
    { image: img("catdog.png"), kicker: "CLASSIFICATION", label: "A group", note: "cat or dog?" },
  ],
  footer: "Regression predicts a number, classification a group",
  notes: notes(
    "Regression = the answer is a number on a scale: a price, a temperature, a time.",
    "Classification = the answer is one box among a fixed list: yes/no, cat/dog, spam/not spam.",
    "House price: the model learned from thousands of past sales (size, area, rooms → price).",
    "Loan: learned from past clients who did or did not repay.",
  ),
});

deck.gallery({
  bg: "coral",
  title: "Quiz: regression or *classification*?",
  items: [
    { image: img("grade.png"), label: "Exam grade", note: "number or group?", answer: "Regression", answerColor: "74C0FC" },
    { image: img("diploma.png"), label: "Diploma: yes or no", note: "number or group?", answer: "Classification", answerColor: "FFC93C" },
    { image: img("thermo.png"), label: "Room temperature", note: "number or group?", answer: "Regression", answerColor: "74C0FC" },
    { image: img("nextword.png"), label: "The next word", note: "number or group?", answer: "Classification", answerColor: "FFC93C" },
  ],
  reveal: "answers",
  stress: 3,
  footer: "ChatGPT picks the next word from a list",
  notes: notes(
    "Show each picture and ask the room: classification or regression? Let them vote with hands. Don't confirm yet.",
    "Once all four are answered, one click reveals all the answers.",
    "Exam grade: a number (12/20) → regression. Diploma: pass or fail → classification. Temperature: a number → regression.",
    "The surprise: the next word is classification. ChatGPT chooses one word out of its whole vocabulary (about 100,000 tokens), like picking one box among 100,000.",
  ),
});

deck.checklist({
  bg: "amber",
  title: "How a machine *learns*",
  items: ["Training: examples", "It finds the pattern", "Prediction: new cases"],
  side: { big: "Garbage in, garbage out." },
  notes: notes(
    "Training: we show it thousands of examples with the right answer (photos labelled cat or dog).",
    "It adjusts its weights until it finds the pattern that links examples to answers.",
    "Prediction: we show it something new; it applies the pattern.",
    "Garbage in, garbage out: bad or biased examples give bad or biased predictions. Example: a hiring AI trained on past CVs that were mostly men learned to prefer men (Amazon, 2018).",
  ),
});

deck.picture({
  bg: "teal",
  title: "Exercise: *Teachable Machine*",
  image: img("teachable.png"),
  points: ["Train an image classifier", "Test it on new images", "Break it with bad data"],
  notes: notes(
    "teachablemachine.withgoogle.com (free, no account). 20 minutes.",
    "Two classes, e.g. \"thumbs up\" and \"thumbs down\", 30 webcam photos each. Train, then test.",
    "Then break it: train one class only in dark light, or with a hat. Watch it fail. That's \"garbage in, garbage out\" live.",
  ),
});

// ── Computer vision and case studies ──────────────────────────────────────
deck.statement({ bg: "blue", tag: "Part 4", lines: ["AI that *sees*"], notes: notes("Computer vision: the same classification, applied to images.") });

deck.gallery({
  bg: "purple",
  title: "What AI *vision* does",
  items: [
    { image: img("v_class.png"), label: "Classify", note: "what is in the image?" },
    { image: img("v_detect.png"), label: "Detect", note: "where is each object?" },
    { image: img("v_ident.png"), label: "Identify", note: "who or which one?" },
    { image: img("v_segment.png"), label: "Segment", note: "outline every pixel" },
  ],
  notes: notes(
    "Classify: one label for the whole image (\"a dog\").",
    "Detect: a box around each object (\"3 dogs, 1 ball, here\").",
    "Identify: which one exactly (this face is Marie; this car plate is AB-123).",
    "Segment: the exact outline, pixel by pixel. Used by self-driving cars and photo apps (remove background).",
  ),
});

deck.gallery({
  bg: "teal",
  title: "AI vision *at work*",
  items: [
    { image: img("sorting.png"), label: "Recycling", note: "sorting waste on a belt" },
    { image: img("phonedrive.png"), label: "Road safety", note: "phone at the wheel" },
    { image: img("fish.png"), label: "Nature", note: "counting fish species" },
    { image: img("medical.png"), label: "Health", note: "reading medical scans" },
  ],
  notes: notes(
    "Recycling: cameras spot plastic, metal and paper; robot arms sort them.",
    "Road safety: cameras detect drivers holding a phone (used in Australia).",
    "Nature: counting fish species from underwater video, instead of divers counting by hand.",
    "Health: spotting tumours on scans. It helps the doctor; it doesn't replace them.",
  ),
});

deck.gallery({
  bg: "coral",
  title: "Case studies: AI for *good*",
  items: [
    { image: img("ocean.png"), label: "Plastic in the ocean", note: "Surfrider maps waste from photos" },
    { image: img("waste.png"), label: "Waste sorting", note: "recognises materials" },
    { image: img("wheat.png"), label: "Crop yield", note: "predicted from satellite images" },
    { image: img("plant.png"), label: "Plant ID", note: "name a plant from a photo" },
  ],
  notes: notes(
    "Surfrider: volunteers photograph beach waste; AI recognises and counts it to map pollution.",
    "Crop yield: satellite images + weather → predicted harvest (regression!).",
    "Plant ID: apps like PlantNet (French, from Montpellier) identify a plant from one photo (classification).",
  ),
});

deck.gallery({
  bg: "blue",
  title: "Case studies: AI at *work*",
  items: [
    { image: img("factory.png"), label: "Factories", note: "spotting defects" },
    { image: img("maintenance.png"), label: "Maintenance", note: "fix before it breaks" },
    { image: img("security.png"), label: "Safety", note: "detecting danger on site" },
    { image: img("coffee.png"), label: "Farming", note: "counting coffee cherries" },
  ],
  notes: notes(
    "Factories: cameras check every product on the line and reject defects.",
    "Predictive maintenance: sensors predict when a machine will break, so it's repaired before.",
    "Safety: detect workers without a helmet, or someone entering a danger zone.",
    "Farming: counting ripe coffee cherries from photos to plan the harvest.",
  ),
});

deck.grid({
  bg: "amber",
  title: "Exercise: pick *one case*",
  by: "row",
  items: [
    { image: img("ocean.png"), label: "Plastic in the ocean" },
    { image: img("waste.png"), label: "Waste sorting" },
    { image: img("wheat.png"), label: "Crop yield" },
    { image: img("plant.png"), label: "Plant ID" },
    { image: img("factory.png"), label: "Factory defects" },
    { image: img("maintenance.png"), label: "Maintenance" },
    { image: img("security.png"), label: "Site safety" },
    { image: img("coffee.png"), label: "Coffee harvest" },
  ],
  notes: notes(
    "The 8 cases they can pick from. Each pair picks one; no two pairs on the same case if possible.",
    "Leave this slide up while they choose, then show the questions on the next slide.",
  ),
});

deck.points({
  bg: "coral",
  title: "Dissect your *case*",
  items: [
    { label: "What problem does it solve?", note: "for whom?" },
    { label: "What data does it learn from?", note: "photos, numbers, sensors, text…" },
    { label: "Classification, regression, or vision?" },
    { label: "What could go wrong?", note: "bad data, bias, privacy" },
  ],
  notes: notes(
    "15 minutes in pairs, then 1 minute per pair to present.",
    "This is the seed of Day 2's ODS framework: Objective (the problem), Data (what it learns from), Skill (what it does).",
  ),
});

// ── Tokens and prediction ─────────────────────────────────────────────────
deck.statement({ bg: "purple", tag: "Part 5", lines: ["Tokens and *prediction*"], notes: notes("How a chatbot reads your text, and what it really does with it.") });

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
    "Lesson for prompting: the more context you give, the better it guesses what you mean.",
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
  title: "The main *chat tools*",
  items: [
    { image: img("l_chatgpt.png"), label: "ChatGPT", note: "OpenAI" },
    { image: img("l_claude.png"), label: "Claude", note: "Anthropic" },
    { image: img("l_gemini.png"), label: "Gemini", note: "Google" },
    { image: img("l_copilot.png"), label: "Copilot", note: "Microsoft" },
  ],
  footer: "All have a free version",
  notes: notes(
    "ChatGPT: the most used, good all-rounder. Claude: strong at writing, long documents and code. Gemini: built into Google (Docs, Gmail, Drive). Copilot: built into Microsoft (Word, Excel, Teams); students often have it free with their university account.",
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
    "Le Chat by Mistral AI: the French champion, based in Paris, fast and GDPR-friendly.",
    "Grok by xAI (Elon Musk): built into X, with access to live posts. A major player; also the most controversial on content moderation.",
    "Perplexity: an AI search engine that cites its sources. Good for research.",
    "DeepSeek and Qwen: Chinese models, very strong and open (anyone can download them). Data from their apps is stored in China.",
    "Footer: never paste personal or confidential data (yours, your employer's, your classmates') into a free tool. GDPR applies.",
  ),
});

// ── A first look at prompting ─────────────────────────────────────────────
deck.statement({ bg: "teal", tag: "Part 6", lines: ["First steps in", "*prompting*"], notes: notes("Prompt engineering = the art of writing instructions for an AI. It's the skill we build all week.") });

deck.contrast({
  bg: "coral",
  title: "Good prompt, *bad prompt*",
  tile: { big: "?", small: "Which one works?" },
  wrong: { kicker: "Bad prompt", text: "Write a post about our *tapenade.*" },
  right: { kicker: "Good prompt", text: "Food marketer: 3 Instagram posts launching our organic tapenade. 100 words, friendly." },
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

const PROMPT = [
  { tag: "Role", text: "You are an expert in marketing and communication.", color: "FFE066" },
  { tag: "Context", text: "You work for a company that makes gourmet products, including a wide range of tapenades.", color: "8CE99A" },
  { tag: "Objective", text: "Write one post for each social network to launch our new organic green olive and almond tapenade.", color: "FFA94D" },
  { tag: "Expected result", text: "The goal is to turn readers into customers.", color: "74C0FC" },
  { tag: "Constraints", text: "Each post must mention the ingredients, their Provençal origin and the artisanal process.", color: "F783AC" },
  { tag: "Format", text: "100 to 150 words per post, in a friendly tone.", color: "B197FC" },
];

deck.decompose({
  bg: "teal",
  title: "A good prompt, *piece by piece*",
  parts: PROMPT,
  notes: notes(
    "Read each part aloud as it appears. After each, ask: what would the answer look like without this part?",
    "Role: sets the expertise and vocabulary. Context: who we are. Objective: the task. Expected result: why we do it. Constraints: what must be in it. Format: length and tone.",
  ),
});

deck.colorText({
  bg: "blue",
  title: "The same prompt, *assembled*",
  parts: PROMPT,
  notes: notes(
    "The same six parts written as one normal paragraph. A good prompt reads like a clear brief to a colleague.",
    "The colours are a checklist: before you send a prompt, can you find each colour in it?",
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
    { label: "Tell us what changed", note: "in the answer, and in how it reasoned" },
  ],
  notes: notes(
    "20 minutes, alone, then share in pairs.",
    "No old prompt? Use: \"Help me prepare for a job interview.\"",
    "New chat matters: the AI remembers the conversation, so a fresh chat gives a fair comparison.",
    "Debrief: 3 volunteers read before and after. Ask: what changed in the output? In the reasoning (did it ask questions, plan, check)?",
  ),
});

deck.points({
  bg: "blue",
  title: "Exercise: *prompt generators*",
  items: [
    { label: "Try an online generator", note: "feedough.com/ai-prompt-generator", url: "https://www.feedough.com/ai-prompt-generator/" },
    { label: "Or ask the chatbot to write the prompt", note: "\"Write me the best prompt to…\"" },
    { label: "Compare with your improved prompt", note: "which answer is better, and why?" },
  ],
  notes: notes(
    "15 minutes. The link is clickable in slide show.",
    "Second option: ask ChatGPT \"Ask me questions, then write the best prompt to…\". The AI is good at writing prompts for itself.",
    "Compare: generator vs their own improved prompt. Usually the best is a mix: the generator's structure plus their own context.",
  ),
});

deck.cards({
  bg: "purple",
  title: "Tomorrow: the *prompting funnel*",
  cards: [
    { kicker: "1 · WHO", label: "Find the best", note: "at what I need to do" },
    { kicker: "2 · HOW", label: "Their method", note: "ask the AI to describe it" },
    { kicker: "3 · SPLIT", label: "Break it down", note: "step by step" },
    { kicker: "4 · USE", label: "Apply it to me", note: "\"Do the same for…\"" },
  ],
  footer: "Example: pitch like Steve Jobs",
  notes: notes(
    "A teaser for Day 2: my funnel technique. Instead of asking the AI directly, you borrow the method of the best.",
    "Example: you need a 2-minute pitch for an internship.",
    "1. \"Who is the best at product presentations?\" → Steve Jobs. 2. \"What was his method?\" → one big idea, rule of three, a demo, \"one more thing\".",
    "3. \"Break it into steps I can follow.\" 4. \"Use this method to write my 2-minute internship pitch. Here is my CV.\"",
    "Tomorrow we do it properly, then turn it into a master prompt.",
  ),
});

deck.decompose({
  bg: "teal",
  title: "Inside a *mega prompt*",
  parts: [
    { tag: "Expert role", text: "You are a recruitment and ATS expert (Taleez, Flatchr, Recruitee…) who knows their keyword logic.", color: "FFE066" },
    { tag: "Mission", text: "Optimise the Experience section of a CV for one job ad, so it passes ATS filters.", color: "8CE99A" },
    { tag: "Inputs first", text: "First ask for the current CV and the full job ad.", color: "FFA94D" },
    { tag: "Numbered steps", text: "Find the ad's 30 key words, find the CV's gaps, then rewrite.", color: "74C0FC" },
    { tag: "Measurable rules", text: "6 lines per job, 85–90 characters each, one keyword per line, 40 lines max.", color: "F783AC" },
    { tag: "Deliverables", text: "The new section, the 30 keywords and a 5-line explanation.", color: "B197FC" },
  ],
  notes: notes(
    "This is the recruiting mega prompt (the ATS CV prompt from the Simplon job-search course), summarised in English.",
    "ATS = Applicant Tracking System: software that filters CVs by keywords before a human reads them.",
    "What makes it \"mega\": an expert role with precise knowledge, inputs requested first, numbered steps, rules you can measure (characters, lines, numbers) and a clear list of deliverables.",
    "Reverse engineering: if we keep the shape and remove the CV topic, we get a recipe for any mega prompt. Next slide.",
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
    "The full text is in the file master_prompt_generator.md; share it with the students at the end of the day.",
    "We use it on Day 2 to build everyone's personal master prompt.",
  ),
});

// ── Close ─────────────────────────────────────────────────────────────────
deck.close({
  bg: "green",
  title: "Today: AI *predicts*.",
  lead: "Remember",
  chips: ["Data decides", "Context steers", "Prompts guide"],
  badge: "Next: the funnel",
  notes: notes(
    "Data decides: an AI is only as good as what it learned from.",
    "Context steers: the same question with more context gets a better answer.",
    "Prompts guide: structure your prompts with the six colours.",
    "Tomorrow: personalising your AI, the ODS framework (Objective, Data, Skill), the funnel and the master prompt.",
    "Homework: write down 3 tasks in your studies or job search you'd like AI to help with.",
  ),
});

deck.build();
