# CohortPilot — Build Spec & Portfolio Plan

> **Goal of this product:** demonstrate the PM/discovery muscles that 12 real Singapore product JDs demand but the current portfolio doesn't show — user research, PRD, user stories, roadmap/prioritization, metrics, and an executed experiment — while reusing the proven CompassStu stack so build risk stays near zero.
>
> **Target archetype:** B2B SaaS PM (JuzTalent, playCONNECT, Etiqa). Secondary fit: Atria, Razorpay.
>
> **Positioning of the case study:** "I built a B2B product the way a product team would — discovery to instrumented iteration — solo."

---

## 0. The product in one line

A B2B micro-tool that turns a Singapore training provider's scattered learner feedback (emails, WhatsApp, survey exports, drop-off signals) into a **prioritized, evidence-linked course-improvement backlog**, so a one-person course owner always knows the single highest-leverage fix to ship next.

**Why this product specifically closes the gap:** the artifacts a recruiter wants to see (backlog, user stories, prioritization, PRD) are literally the *output* of the tool — so your own product process and the product's value proposition are the same thing. That's the cleanest possible demonstration.

---

## 1. The user — and why your research will be REAL

**Primary persona:** "Mei" — a solo course owner / programme lead at a SkillsFuture-approved training centre.
**You have direct access to this exact population** (Spring College International + the Acuity Academy acquisition). This is the unfair advantage that makes the research section unfakeable — interview 5–8 real people you can actually reach.

**Secondary persona:** a small training-centre ops/admin who collates feedback but doesn't decide the roadmap.

---

## 2. Discovery artifacts to produce (THIS is the gap-closing core)

Produce these as real, downloadable/linkable artifacts — each becomes a case-study section.

1. **Interview guide** — 8–10 open questions on how they collect & act on learner feedback today.
2. **5–8 real interview note sets** — anonymized, with verbatim pull-quotes highlighted.
3. **Affinity / insight cluster** — raw notes → 5–7 named insights, each tagged to the quote that drove it.
4. **1 primary persona (Mei) + 1 secondary** — jobs, pains, current workarounds.
5. **Current-state journey map** — how Mei collects→reads→acts on feedback today, with the single most painful moment marked.
6. **One-page PRD** — see §4 for the fill-in template.
7. **Decision deck (5–7 slides)** — frames "how do we turn raw feedback into themes": LLM auto-cluster vs manual tagging vs hybrid → trade-off table → recommendation tied to an insight.
8. **Competitive landscape (one screen)** — feature/pricing comparison vs Productboard, Canny, Dovetail → stated wedge: *solo SME training providers, not enterprise product teams.*
9. **Now/Next/Later roadmap + RICE (or impact-effort) matrix** scoring 8–10 features, with written rationale for one **evidence-driven cut**.
10. **Metric tree** — north-star decomposed into sub-metrics (see §5).
11. **Experiment write-up** — hypothesis → variant → metric → sample → result → ship/kill (see §6).

> **The signature move:** a repeated **"quote → insight → user story → metric → shipped iteration"** trace component. Build one visual strip and reuse it. This single chain hits gaps 1–6 at once and is the thing recruiters currently can't find anywhere in your work.

---

## 3. Core features (deliberately scoped tight — one persona, one workflow)

1. **Universal feedback inbox** — paste/forward learner emails, WhatsApp snippets, or upload a survey CSV. Each item = an evidence record (source + timestamp + verbatim).
2. **LLM auto-clustering (GPT-4o)** — groups raw feedback into suggested themes the owner can confirm/rename/merge. *This is the AI-integration showpiece AND the thing you A/B test.*
3. **Evidence-linked backlog** — each backlog item auto-written as a user story ("As a learner… I want… so that…"), staying linked to the quotes that justify it.
4. **Prioritization view** — drag items onto an impact-effort matrix, or auto-score with RICE; surfaces the single "do this next" item.
5. **Now/Next/Later roadmap board** — shareable as a read-only link to a director/vendor (stakeholder-framing surface).
6. **Outcome loop** — mark an item "shipped," log the course change, watch the north-star metric update on a simple instrumented dashboard.

**Scope discipline (call this out in the case study as a deliberate cut):** v1 = one persona, one workflow, one training centre's real feedback. No multi-tenant, no billing, no integrations beyond CSV paste. Saying *why* you cut these IS the prioritization evidence.

---

## 4. PRD template (fill this in — it becomes a downloadable artifact)

```
# CohortPilot — PRD v1

## Problem
[1-2 sentences from a real interview insight. Lead with a verbatim quote.]

## Who it's for
Primary: Mei, solo course owner at a SkillsFuture training centre.
[pain, current workaround, frequency]

## Goals
- [outcome 1, tied to north-star]
- [outcome 2]

## Non-goals (v1)
- Multi-tenant / team accounts
- Billing & subscriptions
- Live integrations (Zendesk, WhatsApp API) — CSV/paste only
[Each non-goal = a prioritization decision you can defend]

## User stories (epic: Triage feedback)
- As a course owner, I want to paste 30 raw feedback items and get suggested
  themes, so that I don't read everything manually.
  AC: given >=10 items, system returns >=3 named clusters; user can rename/merge.
- [9-14 more, grouped into 2-3 epics, each with acceptance criteria]

## Success metrics
North-star: % of captured feedback items that reach a shipped course change.
Activation: user clusters their first batch within session 1.
[+ guardrail metric]

## Scope cuts & rationale
[The one cut traced back to an interview insight — the money paragraph]
```

---

## 5. Metrics (define these BEFORE building — this is gap #2)

**North-star:** % of captured feedback items that reach a shipped course change ("feedback-to-change rate").

**Metric tree:**
```
North-star: feedback-to-change rate
├── Capture: # feedback items logged / week
├── Cluster: % items assigned to a theme (activation event)
├── Prioritize: % themes scored & ranked
└── Ship: # course changes logged → linked back to source items
```

**Instrumentation:** Supabase events table + Microsoft Clarity (you already run it). Define **one target number per metric** and show target vs observed in the case study. **Replace "what I'd measure first" (conditional) with "what I measured" (actual).**

---

## 6. The experiment (executed, not proposed — gap #6)

**Hypothesis:** "LLM auto-clustering of raw learner feedback lets a solo course owner triage a 30-item batch ≥40% faster than manual tagging, without theme-agreement dropping below 80%."

**Design:** within-subject A/B — same 5 test users triage one batch manually and a comparable batch with AI-suggested clusters (order counterbalanced).

- **Primary metric:** median time-to-triage-batch (Supabase timestamps + Clarity recordings).
- **Guardrail metric:** % of AI-suggested themes accepted unedited (theme-agreement).
- **Decision rule:** ship AI-clustering as default only if time drops ≥40% AND agreement ≥80%; else keep as an opt-in "suggest themes" button and log why.

**Publish:** hypothesis → variant screenshots → n → both numbers → the actual ship/keep-as-opt-in decision. Even n=5 is fine — state it's directional, not significant. The point is showing you *closed a learn-iterate loop*, which nothing in the portfolio currently does.

---

## 7. Stack (zero new tech — every hour goes to the PM muscle)

- **Supabase** Postgres + Edge Functions + RLS — evidence/backlog data model, event logging, A/B assignment (same as CompassStu).
- **GPT-4o** via Edge Function — auto-clustering + auto-written user stories ("AI suggests, human verifies" — your existing pattern).
- **Vercel** — hosting, preview per change.
- **Microsoft Clarity** — experiment instrumentation + activation funnel.
- **Figma** — personas, journey map, decision deck, competitive map.
- **Claude Code** — primary build tool.

---

## 8. Timeline (4–6 weeks solo)

| Phase | Time | Output |
|---|---|---|
| Discovery | ~1 week | interviews, synthesis, persona, journey map, PRD, competitive map, roadmap |
| Build | ~2–3 weeks | inbox, LLM clustering, evidence-linked backlog, prioritization view, dashboard |
| Experiment + write-up | ~1 week | run n=5 A/B, instrument metrics, assemble case study |

Scope is intentionally cut to one persona/one workflow so it ships as a tight MVP, not a platform.

---

## 9. Portfolio case-study page structure

Add to `index.html` as the new lead **Case Study** card (replace the WIP "Atelier" slot — it's the freshest work and signals the AI-edtech thread is intentional alongside CompassStu).

Build the page in your existing `project-text` editorial system, but **sequence it as the PM lifecycle** so recruiters scan the missing muscles in order:

| Section | Content | Closes gap |
|---|---|---|
| 00 Context | the persona + the problem, one sharp stat from your own interviews | framing |
| 01 **Discovery** | interview guide, verbatim quote wall, affinity clusters, persona card, journey map | research ❌→✅ |
| 02 Frame | embedded one-page PRD + decision deck slide strip + competitive map → wedge | PRD ❌→✅ |
| 03 **Prioritize** | impact-effort/RICE matrix + Now/Next/Later roadmap + "what I cut & why" callouts | roadmap ❌→✅ |
| 04 Build | a few real UI screens (kept short — craft already proven); note the AI clustering arch | AI strength ✅ |
| 05 **Experiment** | hypothesis → variant cards side by side → metric → real numbers → ship/kill | experiment ❌→✅ |
| 06 Measure | metric tree + live-styled funnel dashboard (Clarity + Supabase), target vs observed | metrics ❌→✅ |

**Make every artifact a tappable thumbnail** (PDF/Notion/Figma) so a recruiter can grade the actual document in seconds.

**Also update `about.html`:** point the "Frame" and "Measure" operating-model steps at these real artifacts, so the claims become *evidenced* instead of *asserted*. Change any conditional measurement language to actual.

---

## 10. What to say in an interview (the one-liner that lands)

> "I noticed my portfolio showed I could *build* but not that I could *run discovery* — so I built a B2B tool for solo course owners, interviewed real ones from my SkillsFuture network, wrote the PRD and backlog, ran an A/B test on the AI-clustering feature, and shipped the iteration the data pointed to. The whole discovery-to-instrumented-iteration loop is on the case study."

That sentence directly answers "how do you use research / data / experimentation" — the exact questions these 12 JDs are screening for.
