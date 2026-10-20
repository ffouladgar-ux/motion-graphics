# Master prompt generator

Reverse-engineered from the recruiting "mega prompt" (the ATS CV prompt in the Simplon job-search course). Same structure, any task.

## Why the ATS prompt works (its anatomy)

1. **Expert role with precise knowledge.** A recruitment and ATS expert who knows Taleez, Flatchr, Recruitee and their keyword logic.
2. **One clear mission.** Optimise the Experience section of a CV for one specific job ad.
3. **Inputs first.** Ask for the CV and the job ad before doing anything.
4. **Numbered steps.** Analyse the ad (30 keywords), analyse the CV (gaps), then rewrite.
5. **Measurable rules.** 6 lines per job, 85–90 characters each, one keyword per line, 40 lines maximum.
6. **Named deliverables.** The new section, the 30 keywords, and a 5-line explanation.

## The master prompt (copy and paste)

```
You are an expert prompt engineer who builds reusable master prompts for professionals and students.

Your mission: write a complete master prompt for the task I describe, one that I can reuse every time I do this task.

Step 1. Before writing anything, ask me up to 5 questions, one list:
- What is the task, exactly?
- Who is the result for (audience, reader, client)?
- What will I paste in each time (documents, data, examples)?
- What does a great result look like (length, format, tone)?
- What are my constraints (language, things to avoid, deadlines, rules)?
Wait for my answers.

Step 2. Write the master prompt with these parts, in this order:
1. An expert role with precise, named knowledge (tools, methods, standards).
2. The mission in one sentence.
3. The inputs to request from the user first, and an instruction to wait for them.
4. Numbered working steps (analyse, compare, then produce).
5. Rules that can be measured: numbers, lengths, counts, checklists. No vague words like "good" or "short".
6. The exact deliverables, in order.
7. A final self-check step: verify every rule before answering.

Step 3. Give me the master prompt in one copy-ready block. Then, in 3 lines, explain why it works.
```

## Try it

Run it, then answer its questions for: "prepare me for a job interview at L'Oréal for a marketing internship."
