# 🚀 Build-in-Public Narrative: How We Built ForgeGrad AI for PromptWars

**Event**: Google for Developers × Hack2Skill PromptWars Hackathon (Parul University)  
**Product**: [ForgeGrad AI](https://github.com/Het0088/Prompt.git) — AI Capstone Reality Check & Viva Defense Mentor  
**Tech Stack**: React 19 + Vite + Vanilla CSS Glassmorphism + FastAPI + Google Gemini 2.5/Flash Models  

---

## 1. The Problem: The Undergraduate Capstone Crisis
In engineering universities worldwide, students face a common failure mode:
1. **The Overambitious Trap**: A team with zero cloud budget, basic Python knowledge, and local laptops attempts to train a real-time 3D convolutional medical diagnosis model or an open-world autonomous vehicle navigation stack. Four months later, their models don't converge, their free Colab sessions time out, and they panic.
2. **The Cliché Trap**: Students default to copy-pasting standard GitHub repositories (Face Recognition Attendance, Titanic Survival, basic leaf disease classifiers). At the final viva examination, harsh external evaluators tear their work apart for zero novelty and complete vulnerability to presentation attacks (e.g. photo-replay spoofing).

---

## 2. Why Generic AI Tools Fail Here
If a student asks ChatGPT or Gemini directly: *"Give me a final year project idea for medical imaging"*, the LLM happily outputs:
> *"Build an end-to-end real-time 3D volumetric MRI segmentation network deployed on Kubernetes."*

Generic LLMs suffer from **Feasibility Blindness**. They don't check if the student has an NVIDIA A100 GPU, whether 380 hours of training exceeds the 120 hours available before submission, or whether the team knows PyTorch. Generic idea generators create doomed projects.

---

## 3. The Core Product Insight: Dual-Engine Architecture
Rather than building another idea generator, we built an **Adversarial Reality Check & Reforge Engine**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FORGEGRAD AI ARCHITECTURE                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 1. DETERMINISTIC FACT CORE       │ 2. GEMINI REASONING CORE            │
│    (Python & NumPy Equations)    │    (Google Gemini Flash Structured) │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Mathematical bounds check      │ • Hidden trap identification        │
│ • Hardware & VRAM tier matching  │ • Architectural pivot synthesis     │
│ • Student skill gap analysis     │ • The "Unfair Twist" generation     │
│ • Authoritative feasibility math │ • Viva defense counter-arguments    │
│ • Visual diff parameterization   │ • Natural language timeline pruning │
└──────────────────────────────────┴─────────────────────────────────────┘
```

**The golden rule of ForgeGrad**: Gemini never directly fabricates numerical feasibility scores. The Python deterministic engine calculates mathematical constraints *before* and *after* the AI generation. A score improves because the architecture genuinely switched from 3D to 2D slice triage on CPU, not because an LLM said so.

---

## 4. How Antigravity Was Used
Developing ForgeGrad AI under strict hackathon time constraints was an exercise in AI-native pair programming:
- **Vibe Coding & Rapid Prototyping**: Antigravity enabled instant translation of product specs into typed Pydantic contracts and synchronized React state.
- **Automated Regression Audits**: Every time constraint equations were modified, automated test suites (47 pytest cases + 7 Vitest cases) ran in seconds to verify zero regressions.
- **Browser Subagent Verifications**: Antigravity's integrated browser subagent verified the visual render, tested DOM transitions, checked score dials, and captured live video artifacts without manual test-runner setup.

---

## 5. Prompt Engineering & Token Efficiency Strategy
Hackathons with live audience demos cannot afford slow 40-second LLM waterfalls or rate-limit lockouts.
- **Single-Turn Structured Extraction**: A single structured JSON call using `response_mime_type="application/json"` extracts the Audit, Reforge, Unfair Twist, and Visual Diff simultaneously in **~2.0 seconds**.
- **XML Context Isolation**: User input proposals are partitioned inside `<project_idea>` tags to resist prompt injection and enforce schema compliance.
- **Zero Chat Context Bloating**: Interactive refinements pass only the active project state and delta instruction, keeping prompt sizes under 500 tokens.

---

## 6. The Real Bug & Iteration Journey
Our build-in-public journey had real engineering challenges:
1. **The Scoring Inflation Bug**: In Milestone 3, our initial fallback mirrored the student's skills, accidentally causing reforged projects to score an unearned `100/100`. In a hostile judge environment, a fake 100/100 ruins credibility. We refactored domain prerequisite calculation so projects score an authentic, earned **88/100 (Pass)** with an honest *Moderate Learning Burden* note.
2. **The Deprecated Model HTTP 404**: While testing live API calls, Google's endpoint returned `HTTP 404 NOT_FOUND` because `gemini-2.5-flash` had been retired for new users. We queried the live model catalog, benchmarked candidate response latencies, and transitioned to **`gemini-flash-lite-latest`** (returning in 2.03s).
3. **The Navbar Blank Screen**: Clicking the brand logo set `currentView` to `'generator'` while the router expected `'onboarding'`. We implemented a resilient view fallback ensuring the homepage wizard always renders smoothly.

---

## 7. Key Technical Decisions & Deployment
- **Stack**: React 19 + Vite + Vanilla CSS Glassmorphism + FastAPI + Google Gemini.
- **Zero-Exposure Server Architecture**: API keys are never stored in client browser storage or exposed in network traffic. All requests route server-side.
- **Dual Deployment Readiness**: Configured with `vercel.json` and `VITE_API_URL` support, enabling unified deployment on Vercel or decoupled deployment with Render/Railway.

---

## 8. Limitations & Future Roadmap
- **Real Viva Interrogation**: Currently, viva defense counter-arguments are generated as structured points. Milestone 4 will introduce an interactive, audio-capable viva examiner simulator.
- **Automated GitHub Scaffolding**: Direct generation of starter template repositories with Dockerfiles and baseline tests.

---

## 9. What We Learned
> *"A hackathon judge is not impressed by how many tokens your app consumes. They are impressed by whether your software solves a real, painful problem with precision, credibility, and zero fluff."*
