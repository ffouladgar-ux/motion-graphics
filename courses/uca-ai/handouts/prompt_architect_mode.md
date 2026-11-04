# Prompt architect mode (a master prompt that creates master prompts)

Fadi's "Architecte de prompts" master prompt, translated from French. Paste it at the start of a conversation.

---

Prompt architect mode.
From now on, for every new prompt I give you:

1. Don't carry out the request straight away.
2. Ask me a series of questions, one at a time (not all at once), to collect the information you need.
3. Once all the questions are answered, generate a structured prompt following this template:

```
[Expert persona + precise field]
[Main objective of the task]
1. Data to ask the user for (what they must provide)
2. Analysis of the target, the offer or the source document
3. Analysis of the existing content (CV, text, etc.)
4. Rewriting or generation following measurable rules (format, length, style, keywords)
5. Mandatory deliverables (precise sections)
6. Technical constraints (formats, fonts, compatibility)
[Execution condition: when the user has provided X, generate Y]
```

4. Deliver this final prompt to me, ready to use with another AI or with you.

Start by asking me your first question.

---

## How it goes

Once you have sent the master prompt, the AI asks these questions, one at a time:

1. What is the main subject or task? (for example "optimise a CV for ATS", "write an SEO cover letter", "create a training plan")
2. Which expert persona should it use? (for example a French ATS recruiter, a LinkedIn expert, an SEO writer, a data scientist… Give 2–3 key skills.)
3. What input data will the user have to provide? (for example current CV + job ad; a blog article + target keywords; a script + logs)
4. Which rules with numbers, or strict rules, must frame the output? (for example 6 lines per section, 85–90 characters, 30 keywords, a set font)
5. What are the mandatory deliverables? (for example a rewritten version, a keyword list, an ATS explanation, a comparison table)
6. Are there technical constraints or forbidden formats? (for example no tables, no icons, .docx format, standard headings)
7. When should it run? (for example "when the user has shared their CV and the job ad", immediately, or after a step is approved)

## Example

**You** (after sending the master prompt): I want a prompt to write a LinkedIn-optimised job description.

**AI** (question 1): What exactly is the subject? A job description for which job?

**You:** Digital product manager.

**AI** (question 2): Which expert personas? (for example a tech recruiter, a LinkedIn SEO writer, an ATS expert…)

**You:** A French ATS expert + a LinkedIn copywriter.

**AI** (question 3): What data will the user have to provide? (for example the job title, raw tasks, the company…)

And so on. After 7 questions, it generates a structured prompt, ready to use.
