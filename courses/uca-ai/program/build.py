from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

F = "Arial"
HEAD_FILL = PatternFill("solid", fgColor="1F2A44")
DAY_FILLS = ["FFE8E1", "E3E8FF", "EFE6FF", "FFF1DB", "DFF5EA", "DDF0F4"]
THIN = Side(style="thin", color="C9CDD6")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")

DAYS = [
    ("Day 1", "Where AI comes from and how it \"thinks\"",
     "Explain what an LLM really does (tokens, prediction, reasoning) and pick the right chat tool."),
    ("Day 2", "Personalise and communicate: from prompts to the master prompt",
     "Set up a personalised LLM and project, and write a first master prompt."),
    ("Day 3", "Reuse and reliability: bots, skills, scheduled tasks and RAG",
     "Turn a master prompt into a reusable expert, schedule it, and ground it in sources."),
    ("Day 4", "AI inside your tools, and media production",
     "Use Copilot and Gemini in everyday tools and produce images, video, audio and slides."),
    ("Day 5", "Branding, free tools, agents and building",
     "See how skills, media and connectors combine into agents, and vibe-code a pitch page."),
    ("Day 6", "Capstone project and pitch",
     "Build and pitch a working AI workflow for a real need."),
]

# (day, half, hours, module, content, exercise, tools, notes)
S = [
    # ── Day 1
    (1, "am", 0.5, "Welcome and framing",
     "Course goals, ground rules, who is in the room. Initial positioning quiz.",
     "Positioning quiz (repeated on Day 6 to measure progress).", "Wooclap or Google Forms", ""),
    (1, "am", 1.0, "AI was already in your life",
     "Spam filters, recommendations (YouTube, Netflix, Spotify), GPS, face unlock, autocorrect, bank fraud alerts. "
     "A short history: Turing (1950), Dartmouth (1956), AI winters, machine learning, deep learning (2012), "
     "transformers (2017), ChatGPT (2022), reasoning models and agents.",
     "\"AI hunt\": list every AI you used before 10 a.m. today, then compare in pairs.", "", ""),
    (1, "am", 1.0, "AI families and what they are used for",
     "Rule-based AI, machine learning (supervised, unsupervised, reinforcement), deep learning; "
     "predictive vs generative AI. Uses: classify, predict, recommend, detect, generate.",
     "Sort 12 everyday examples into the right family.", "", ""),
    (1, "am", 1.0, "Pattern recognition",
     "How machines learn from examples; why the data you give decides the result (\"garbage in, garbage out\").",
     "Train an image classifier in a few minutes, then break it with bad data.", "Teachable Machine (Google, free)",
     "From your Simplon methodology notes."),
    (1, "pm", 1.25, "Tokens and the predictive brain",
     "What a token is; text becomes numbers (embeddings); the model predicts the most likely next token, one at a time; "
     "probabilities and temperature; the context window.",
     "Count tokens for the same sentence in English and French; play \"predict the next word\" against the model.",
     "A free online tokenizer", ""),
    (1, "pm", 1.0, "How the model picks the right path",
     "Attention (what the model looks at in your context) and mixture of experts (routing a request to specialised "
     "parts of the network): the \"ensemble\" idea of narrowing down to the right process. Why context steers the answer.",
     "Ask the same question with three different contexts and compare the answers.", "",
     "Technical names: attention and mixture of experts (MoE)."),
    (1, "pm", 0.75, "Not intelligence: prediction (plus reflection)",
     "LLMs predict; they don't understand. Reasoning (\"thinking\") models add a reflection step that checks, "
     "decomposes and verifies before answering, which is why they seem intelligent. Their limits.",
     "Give a logic puzzle to a fast mode and a reasoning mode; compare the steps and the errors.",
     "ChatGPT, Claude, Gemini", ""),
    (1, "pm", 0.5, "The major chat tools, and Day 1 recap",
     "ChatGPT, Claude, Gemini, Microsoft Copilot, Mistral Le Chat (French), DeepSeek: strengths, free tiers, "
     "when to use which.",
     "Fill a \"which model for which task\" table.", "", ""),
    # ── Day 2
    (2, "am", 0.25, "Recap quiz", "Five questions on Day 1.", "Quick quiz.", "Wooclap or Google Forms", ""),
    (2, "am", 1.0, "Personalising your LLM, level by level",
     "Account level: custom instructions and memory. Project level: Projects (ChatGPT, Claude), Gems (Gemini), "
     "custom GPTs, each with its own instructions and files.",
     "Write your custom instructions, then create one project for a real course you are taking.",
     "ChatGPT, Claude, Gemini", ""),
    (2, "am", 0.75, "Connecting AI to your world: API and MCP",
     "API: how one program asks another for something (the waiter analogy). MCP: a standard plug that lets an LLM "
     "read from and act on other tools (Google Drive, Gmail, Calendar, Notion). Connectors in practice.",
     "Connect one tool (e.g. Google Drive) and ask the LLM a question about one of your files.",
     "Claude connectors, ChatGPT apps, Gemini apps", "Comes back on Day 5 (agents)."),
    (2, "am", 0.5, "The ODS framework: Objective, Data, Skill",
     "Fadi's framework for every AI task. Objective: what you want out and what \"good\" looks like. "
     "Data: what you feed in (references, templates, sources). Skill: the reusable way to get there "
     "(master prompt, bot, skill, scheduled task, agent). The rest of the course follows this frame.",
     "Write the O, D and S for one task from your studies.", "", "Your framework; the thread for Days 2 to 6."),
    (2, "am", 1.0, "The funnel method",
     "Communicating from broad to precise: start wide, let the AI ask you questions, narrow down, iterate.",
     "Turn a vague request (\"help me with my internship report\") into a precise brief using the funnel.", "",
     "Your funnel system; it sharpens the Objective."),
    (2, "pm", 1.0, "Prompt structures",
     "Role, task, context, format; examples (few-shot); step-by-step reasoning; common frameworks. Good vs bad prompts.",
     "Rewrite three weak prompts with three different structures and compare the results.", "", ""),
    (2, "pm", 0.5, "The prompt generator",
     "Your prompt generator, which applies the known formats automatically.",
     "Test it on a task of their own and compare with their handwritten prompt.", "Fadi's prompt generator", ""),
    (2, "pm", 0.5, "References and templates",
     "Why a reference (an example, a template, a format) beats adjectives: the model analyses it and matches it.",
     "Give the model a reference document and have it reproduce the format with new content.", "", "The Data in ODS."),
    (2, "pm", 1.0, "The master prompt",
     "Whatever the method (funnel, generator, structures), the goal is a master prompt that predictably produces "
     "the output you like. Testing, versioning, storing it.",
     "Build your first master prompt (e.g. a weekly study summary) and run it three times to check it is stable.",
     "", "Core concept of the course; the first Skill in ODS."),
    (2, "pm", 0.5, "Responsible and ecological use",
     "Compute, energy and water footprint; data you should never paste (personal, confidential); GDPR; academic "
     "integrity and citing AI use. Share master prompts in a team instead of everyone rediscovering them.",
     "Start a shared class library of master prompts.", "Shared doc or Notion", ""),
    # ── Day 3
    (3, "am", 0.25, "Recap quiz", "Five questions on Day 2.", "Quick quiz.", "Wooclap or Google Forms", ""),
    (3, "am", 1.0, "From master prompt to bots and skills",
     "Bots (custom GPTs, Gems, Claude Projects) and skills: packaged instructions an AI calls to do a task the same "
     "way every time, with a precise output.",
     "Turn your Day 2 master prompt into a bot or a skill.", "ChatGPT, Gemini, Claude", ""),
    (3, "am", 1.25, "Build your own \"PhD expert\"",
     "An expert assistant for the exact task you need: master prompt + reference documents + rules. "
     "Book-to-skill and course-to-skill: turning a book or a course into a skill (tools found on GitHub).",
     "Build an expert in one subject of your degree and test it with real questions.", "GitHub, Claude, ChatGPT",
     "Show your book-to-skill and course-to-skill tools."),
    (3, "am", 1.0, "Scheduled tasks",
     "Once a master prompt works, run it automatically: daily, weekly, on a trigger.",
     "Schedule your master prompt (e.g. a Monday-morning study plan).",
     "ChatGPT tasks, Gemini scheduled actions, Claude scheduled tasks", ""),
    (3, "pm", 0.75, "Why AI makes mistakes",
     "Hallucinations, outdated knowledge, missing context. Why references and sources are the cure.",
     "Catch the AI inventing a source; then fix it by giving the source.", "", ""),
    (3, "pm", 0.75, "RAG explained",
     "Retrieval-augmented generation: the AI answers from your documents instead of from memory. Chunking, indexing, citations.",
     "Draw the RAG pipeline on paper.", "", ""),
    (3, "pm", 1.5, "NotebookLM hands-on",
     "Add sources; chat with citations; generate audio and video overviews, mind maps, study guides and quizzes.",
     "Load one course's material and produce a study guide and an audio overview.", "NotebookLM (Google, free)",
     "Check the product name on the day: reports say it is being folded into Gemini."),
    (3, "pm", 0.5, "RAG vs plain chat",
     "Compare answers with and without sources.", "Same five questions in a plain chat and in NotebookLM; score accuracy.",
     "NotebookLM, any chat", ""),
    # ── Day 4
    (4, "am", 0.25, "Recap quiz", "Five questions on Day 3.", "Quick quiz.", "Wooclap or Google Forms", ""),
    (4, "am", 1.0, "Copilot in Microsoft 365",
     "Copilot in Excel (analyse, formulas, charts), Word (draft, summarise), PowerPoint (deck from a document), Outlook.",
     "Analyse a dataset in Excel with Copilot and turn it into three slides.", "Microsoft 365 Copilot",
     "Check which licence UCA students have."),
    (4, "am", 1.0, "Gemini in Google Workspace",
     "Gemini across Gmail, Calendar, Docs, Sheets and Slides, so it can see your emails, agenda and files. "
     "NotebookLM with Google Docs.",
     "Plan a group project from your inbox and calendar; draft the plan in Docs.", "Gemini in Workspace, NotebookLM",
     "Depends on the account type (personal vs university)."),
    (4, "am", 1.25, "From research to pitch deck",
     "Turning sources into a presentation: AI slide tools and design assistants.",
     "Build a 5-slide pitch from your NotebookLM notebook.", "Gemini in Slides, Gamma, Claude Design", ""),
    (4, "pm", 0.25, "The media map",
     "AI can produce audio, video, images, presentations and communication content: who does what.", "", "", ""),
    (4, "pm", 1.0, "Images: generation and editing",
     "Generating images; editing existing images (inpainting, style, background), including ChatGPT's image "
     "editing and slash commands.",
     "Create a visual, then edit it three times without starting over.",
     "ChatGPT images, Gemini (Nano Banana), Google Flow", ""),
    (4, "pm", 0.75, "Video",
     "Text-to-video, image-to-video, avatars.", "Produce a 5-second clip for your pitch.",
     "Google Flow (Veo), Runway, HeyGen", ""),
    (4, "pm", 0.75, "Audio and voice",
     "Text-to-speech, voice cloning, transcription, music. Consent and deepfake ethics.",
     "Record a 30-second pitch, then generate it in another language.",
     "ElevenLabs, Microsoft VibeVoice (open source), Flow Music", "Show your own voice-clone setup."),
    (4, "pm", 0.75, "Mini campaign",
     "Combine image, video, audio and text into one message.", "Produce a mini campaign for a fictional or real project.",
     "Day 4 tools", ""),
    # ── Day 5
    (5, "am", 0.25, "Recap quiz", "Five questions on Day 4.", "Quick quiz.", "Wooclap or Google Forms", ""),
    (5, "am", 1.0, "Teaching AI your brand",
     "Getting an LLM to grasp a brand you like (colours, fonts, tone) from references; design systems; "
     "brand profiles generated from a website.",
     "Feed a brand you admire to the AI and extract its identity guide.", "Claude Design, Google Pomelli", ""),
    (5, "am", 0.75, "Vision boards and UI ideas",
     "AI mood boards and vision boards; from sketch or prompt to interface design.",
     "Create a vision board for your personal brand or project.", "Google Mixboard, Google Stitch", ""),
    (5, "am", 0.75, "Free tools for your future job",
     "A tour of free tools that do the trick: dictation, mini-app builders, AI studios, learning tools.",
     "Each student picks one tool and demos it in 2 minutes.",
     "Wispr Flow, Google Opal, Google AI Studio, Learn Your Way", ""),
    (5, "am", 0.75, "Agentic AI: how it all fits",
     "Skills + master prompts + RAG + media + connectors = an agent that can plan, decide and act.",
     "Map your own agent on paper: goal, tools, skills, memory.", "", ""),
    (5, "pm", 1.0, "Agents with real tools",
     "Claude and Codex as agents; connectors; API and MCP in action (read Google Drive, act on other tools); "
     "editing and motion graphics.", "Live demo, then students give an agent one real task.",
     "Claude (Code, Cowork), Codex", "Revisits Day 2's API/MCP intro."),
    (5, "pm", 0.75, "Motion graphics and video by code",
     "Video made from code and edited by an AI: describe the change, the agent edits.",
     "Generate a short animated title for your pitch.", "Remotion, HeyGen HyperFrames", "Show the motion-graphics skills."),
    (5, "pm", 0.5, "GitHub skills and memory",
     "Finding skills and add-ons on GitHub; giving agents memory so they forget less (Obsidian vault).",
     "Install one skill from GitHub.", "GitHub, Obsidian", ""),
    (5, "pm", 0.25, "Introduction to Hermes",
     "An open-source agent with skills, profiles and connections.", "", "Hermes Agent", ""),
    (5, "pm", 1.0, "Vibe-coding a pitch page",
     "Building an app, website or page by describing it.",
     "Build a one-page site that supports your Day 6 pitch.", "Claude, Google AI Studio, Lovable, Bolt", ""),
    # ── Day 6
    (6, "am", 0.25, "Recap and brief", "Rules and evaluation grid for the capstone.", "", "", ""),
    (6, "am", 0.25, "Teams and project choice", "Choose a real need (studies, internship, association, startup idea).",
     "Fill an ODS canvas per team: Objective, Data, Skill.", "", ""),
    (6, "am", 3.0, "Build sprint 1",
     "Combine a master prompt, a skill or bot, a RAG source, media and a page into one workflow.",
     "Coached build.", "All course tools", ""),
    (6, "pm", 1.0, "Build sprint 2", "Finish and test.", "Prototype ready to demo.", "All course tools", ""),
    (6, "pm", 0.5, "Pitch preparation", "Presenting an AI solution clearly and honestly (what it does, its limits).",
     "Rehearse in teams.", "", ""),
    (6, "pm", 1.25, "Pitches", "10-minute pitch plus questions in front of the group.",
     "Evaluation grid scored on ODS: clear Objective, right Data, reusable Skill.", "", ""),
    (6, "pm", 0.75, "Feedback, final quiz and certificates",
     "Individual feedback; the Day 1 quiz again to measure progress; closing.", "Final quiz.", "", ""),
]

TOOLS = [
    ("ChatGPT", "Chat assistant", "1–4", "Free tier; paid plans", "Image editing on Day 4."),
    ("Claude", "Chat assistant and agent", "1–5", "Free tier; paid plans", "Projects, skills, connectors, Claude Code."),
    ("Gemini", "Chat assistant", "1–4", "Free tier", "Gems; also inside Google Workspace."),
    ("Microsoft Copilot", "Chat assistant / Office", "1, 4", "Free chat; Copilot in Office needs a licence", "Check UCA's Microsoft licence."),
    ("Mistral Le Chat", "Chat assistant (French)", "1", "Free tier", "European alternative."),
    ("DeepSeek", "Chat assistant", "1", "Free", "Discuss data location."),
    ("Teachable Machine", "Pattern recognition", "1", "Free", "teachablemachine.withgoogle.com"),
    ("NotebookLM", "RAG / research", "3–4", "Free with daily limits", "Reportedly being renamed or folded into Gemini; check on the day."),
    ("Google AI Studio", "Model playground / app building", "5", "Free tier", ""),
    ("Google Pomelli", "Branding from a website (\"Business DNA\")", "5", "Free public beta", "Regional availability varies; Europe reported."),
    ("Google Mixboard", "AI mood / vision boards", "5", "Free Labs experiment", "Availability reported as limited in some regions; check before class."),
    ("Google Stitch", "Prompt or sketch to UI design and code", "5", "Free beta with daily credits", ""),
    ("Google Opal", "No-code AI mini-apps", "5", "Free Labs experiment", ""),
    ("Google Flow", "Image and video generation (Veo)", "4", "Limited free use", "Reportedly absorbed Whisk and ImageFX."),
    ("Flow Music", "Music generation", "4", "Check", "Formerly ProducerAI."),
    ("Learn Your Way", "AI learning tool", "5", "Free", "learnyourway.withgoogle.com (from your notes)."),
    ("Wispr Flow", "Voice dictation", "5", "Free tier", "wisprflow.ai"),
    ("Gamma", "AI presentations", "4", "Free tier", ""),
    ("Claude Design", "Visual design with brand systems", "4–5", "Paid Claude plans (Pro and up)", "Research preview, launched April 2026."),
    ("Runway", "Video generation", "4", "Free trial credits", ""),
    ("HeyGen", "Avatar video", "4", "Free tier", ""),
    ("ElevenLabs", "Voice and audio", "4", "Free tier", ""),
    ("Microsoft VibeVoice", "Open-source text-to-speech / voice cloning", "4", "Free (MIT licence)", "Reports say Microsoft pulled the TTS code from the main repo; check before demoing."),
    ("Remotion", "Video from code", "5", "Free for individuals and small teams", ""),
    ("HeyGen HyperFrames", "HTML-to-video, edited by AI agents", "5", "Free, open source (Apache 2.0)", "github.com/heygen-com/hyperframes"),
    ("Codex", "Coding agent", "5", "Included with ChatGPT plans", ""),
    ("GitHub", "Skills and add-ons", "5", "Free", ""),
    ("Obsidian", "Memory / knowledge vault", "5", "Free", ""),
    ("Hermes Agent", "Open-source agent", "5", "Free, open source", "Nous Research."),
    ("Lovable / Bolt", "Vibe-coding websites and apps", "5", "Free tiers", ""),
    ("Wooclap or Google Forms", "Quizzes", "1–6", "Free tier", ""),
]

CHECKS = [
    "Group size, level of study and degree programme of the Cannes students (changes the examples and exercises).",
    "Which accounts students have: UCA Microsoft 365 (Copilot) and/or Google Workspace (Gemini). Personal accounts may be needed.",
    "Teaching language: all-English, or English with French support?",
    "Total hours: this plan is 42 h (6 × 7 h, 9:00–17:00 with a lunch break 12:30–13:30). Adjust if UCA's format differs.",
    "Tool availability changes fast: re-check Mixboard, Pomelli, NotebookLM's name and VibeVoice a week before.",
    "ChatGPT image-editing slash commands: confirm the exact commands on the day; they change between versions.",
    "Day 1 \"ensemble\": the technical terms are attention and mixture of experts; use them on slides so students can look them up.",
    "Students' data: remind them not to paste personal or confidential data into free tools (GDPR).",
    "ODS framework: check the one-line definitions of Objective, Data and Skill in the Day 2 session match how you teach it.",
    "Certificate: confirm what UCA awards (the earlier Simplon plan wrongly said \"SSIAP-IA\").",
]


def header(ws, cols, widths):
    for i, (c, w) in enumerate(zip(cols, widths), start=1):
        cell = ws.cell(row=1, column=i, value=c)
        cell.font = Font(name=F, bold=True, color="FFFFFF", size=11)
        cell.fill = HEAD_FILL
        cell.alignment = Alignment(wrap_text=True, vertical="center")
        cell.border = BOX
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = "A2"


def body(cell, fill=None, bold=False):
    cell.font = Font(name=F, size=10, bold=bold)
    cell.alignment = WRAP
    cell.border = BOX
    if fill:
        cell.fill = PatternFill("solid", fgColor=fill)


def hhmm(h):
    m = round(h * 60)
    return f"{m // 60:02d}:{m % 60:02d}"


wb = Workbook()

# ── Overview
ov = wb.active
ov.title = "Overview"
ov["A1"] = "AI in Practice: From Prompts to Agents"
ov["A1"].font = Font(name=F, bold=True, size=16)
ov["A2"] = "6-day intensive · Université Côte d'Azur, Cannes campus · Students · English · Thread: the ODS framework (Objective, Data, Skill)"
ov["A2"].font = Font(name=F, size=11, color="555555")
cols = ["Day", "Theme", "By the end of the day, students can…", "Sessions", "Hours"]
for i, (c, w) in enumerate(zip(cols, [8, 46, 62, 10, 8]), start=1):
    cell = ov.cell(row=4, column=i, value=c)
    cell.font = Font(name=F, bold=True, color="FFFFFF")
    cell.fill = HEAD_FILL
    cell.border = BOX
    cell.alignment = Alignment(wrap_text=True, vertical="center")
    ov.column_dimensions[get_column_letter(i)].width = w
for r, (d, theme, goal) in enumerate(DAYS, start=5):
    fill = DAY_FILLS[r - 5]
    for c, v in enumerate([d, theme, goal], start=1):
        body(ov.cell(row=r, column=c, value=v), fill, bold=(c == 1))
    body(ov.cell(row=r, column=4, value=f"=COUNTIF('Detailed program'!$A:$A,A{r})"), fill)
    body(ov.cell(row=r, column=5, value=f"=SUMIF('Detailed program'!$A:$A,A{r},'Detailed program'!$C:$C)"), fill)
    ov.row_dimensions[r].height = 34
tr = 5 + len(DAYS)
body(ov.cell(row=tr, column=1, value="Total"), bold=True)
for c in (2, 3):
    body(ov.cell(row=tr, column=c, value=""))
body(ov.cell(row=tr, column=4, value=f"=SUM(D5:D{tr - 1})"), bold=True)
body(ov.cell(row=tr, column=5, value=f"=SUM(E5:E{tr - 1})"), bold=True)
ov.cell(row=tr + 2, column=1, value="Schedule: 9:00–12:30 and 13:30–17:00 (7 h per day). Sessions and hours are counted from the 'Detailed program' tab.").font = Font(name=F, size=9, italic=True, color="555555")
ov.cell(row=tr + 3, column=1, value="Built from Fadi Fouladgar's Simplon AI Jump 6-day programme (OneDrive › Cosens › Simplon formation IA) and his course outline for UCA.").font = Font(name=F, size=9, italic=True, color="555555")

# ── Detailed program
dp = wb.create_sheet("Detailed program")
header(dp, ["Day", "Time", "Hours", "Module", "What students learn", "Hands-on exercise", "Tools", "Notes for Fadi"],
       [7, 13, 7, 30, 62, 46, 30, 34])
row = 2
clock = {}
for d, half, hrs, mod, content, ex, tools, notes in S:
    start = clock.get((d, half), 9.0 if half == "am" else 13.5)
    end = start + hrs
    clock[(d, half)] = end
    fill = DAY_FILLS[d - 1]
    vals = [f"Day {d}", f"{hhmm(start)}–{hhmm(end)}", hrs, mod, content, ex, tools, notes]
    for c, v in enumerate(vals, start=1):
        body(dp.cell(row=row, column=c, value=v), fill, bold=(c == 4))
    dp.cell(row=row, column=3).number_format = "0.00"
    row += 1
# sanity: each half-day is exactly 3.5 h and never runs past lunch or 17:00
for (d, half), end in clock.items():
    assert abs(end - (12.5 if half == "am" else 17.0)) < 1e-9, (d, half, end)
dp.auto_filter.ref = f"A1:H{row - 1}"

# ── Tools
tl = wb.create_sheet("Tools")
header(tl, ["Tool", "What it is for", "Day(s)", "Cost for students", "Notes"], [24, 40, 9, 34, 56])
for r, t in enumerate(TOOLS, start=2):
    for c, v in enumerate(t, start=1):
        body(tl.cell(row=r, column=c, value=v), bold=(c == 1))
tl.cell(row=len(TOOLS) + 3, column=1, value="Cost and availability as reported in October 2026 (mostly third-party sources); free tiers and betas change often, so check each before class.").font = Font(name=F, size=9, italic=True, color="555555")

# ── To check
ck = wb.create_sheet("To check")
header(ck, ["#", "Check before sending or teaching"], [5, 110])
for r, t in enumerate(CHECKS, start=2):
    body(ck.cell(row=r, column=1, value=r - 1))
    body(ck.cell(row=r, column=2, value=t))

wb.save("uca_ai_6days.xlsx")
print("sessions:", len(S), "hours:", sum(s[2] for s in S))
