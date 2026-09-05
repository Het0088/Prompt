# ForgeGrad AI

> **"It doesn't just generate your capstone — it tries to prove whether you can actually finish it."**

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-646cff.svg)](https://vitejs.dev)
[![Google Gemini](https://img.shields.io/badge/Gemini-Flash-8e24aa.svg)](https://ai.google.dev/)
[![Backend Tests](https://img.shields.io/badge/Tests-47%20Passed-emerald.svg)]()
[![Frontend Tests](https://img.shields.io/badge/Vitest-7%20Passed-emerald.svg)]()

ForgeGrad AI is an adversarial capstone architect, reality-check auditor, and viva defense mentor built for the **Google for Developers × Hack2Skill PromptWars Hackathon**.

---

## 🌐 Live Production Deployment

- **Production Frontend**: [https://forgegradai.vercel.app/](https://forgegradai.vercel.app/)
- **Production Backend**: [https://prompt-l2ho.onrender.com](https://prompt-l2ho.onrender.com)
- **API Health Endpoint**: [https://prompt-l2ho.onrender.com/api/health](https://prompt-l2ho.onrender.com/api/health)
- **Gemini Engine Status**: [https://prompt-l2ho.onrender.com/api/v1/gemini/status](https://prompt-l2ho.onrender.com/api/v1/gemini/status)
- **GitHub Repository**: [https://github.com/Het0088/Prompt](https://github.com/Het0088/Prompt)

---

## 1. Problem & The Undergraduate Capstone Crisis

Every year, engineering students fail or deliver superficial final-year capstone projects due to two distinct failure modes:

1. **The Overambitious Trap**: A team with zero cloud budget, basic Python skills, and modest laptop hardware attempts an industrial-scale deep learning project (e.g., real-time 3D volumetric MRI segmentation or open-world autonomous driving). After 12 weeks, their models do not converge, Google Colab sessions time out, and the project collapses.
2. **The Cliché Trap**: Students default to copy-pasting generic GitHub tutorials (e.g., Face Recognition Attendance, Leaf Disease Classification, Titanic Survival). External examiners in the viva voce defense quickly expose the zero-novelty foundation and vulnerability to presentation attacks (e.g., photo-replay spoofing).

---

## 2. Why Existing AI Project Generators Are Insufficient

When a student asks generic LLMs (ChatGPT, Claude, or stock Gemini) for a capstone idea, the LLM happily suggests:
> *"Build an end-to-end multi-camera 3D CNN surgical robotics pipeline deployed on Kubernetes."*

Generic LLM generators suffer from **Feasibility Blindness**:
- They do not check available compute (CPU vs. GPU vs. Cloud).
- They do not verify student skill prerequisites.
- They do not enforce budget limits or deadline constraints.
- They cannot mathematically verify whether a proposed workload fits into the student's available hours.

The result is doomed project proposals that look impressive on paper but cannot be finished.

---

## 3. The Solution: Dual-Engine Architecture

ForgeGrad AI solves this with a **Dual-Engine Pipeline** that balances deterministic constraints with generative reasoning:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             FORGEGRAD AI PIPELINE                                │
├─────────────────────────────────────────┬────────────────────────────────────────┤
│ 1. DETERMINISTIC FACTS                  │ 2. GEMINI REASONING                    │
│    (FastAPI & Python Core)              │    (Google Gemini Flash Structured)    │
├─────────────────────────────────────────┼────────────────────────────────────────┤
│ • Strict constraint verification        │ • Deep Reality Audit                   │
│ • VRAM & compute tier compatibility     │ • Hidden assumption detection          │
│ • Team person-hour capacity calculation │ • Architectural right-sizing           │
│ • Skill prerequisite audit              │ • "Unfair Twist" synthesis             │
│ • Hard constraint boundary enforcement  │ • External examiner viva defense traps │
└─────────────────────────────────────────┴────────────────────────────────────────┘
```

### Core Execution Flow:
```
[Student Constraints & Raw Idea]
               │
               ▼
[DETERMINISTIC FACTS: Math Constraints Check]
               │
               ▼
[GEMINI REASONING: Deep Reality Audit + Reforge + Unfair Twist]
               │
               ▼
[VALIDATION: Pydantic Schema & Hardware Sanity Check]
               │
               ▼
[DETERMINISTIC RE-SCORE: Recalculate Score with Exact Same Equations]
               │
               ▼
[VERIFIED REFORGED CAPSTONE]
```

**Golden Rule of Integrity**: Gemini **never** calculates or fabricates numerical feasibility scores. The Python deterministic engine calculates mathematical constraints *before* and *after* AI generation. A project score improves only because the architecture was genuinely transformed (e.g., from 3D scratch training to 2D slice triage on CPU), not because an LLM claimed it is feasible.

---

## 4. Transparent Scoring Model & Methodology

> **Note on Methodology**: ForgeGrad AI does not claim fictional empirical studies. Scores are computed from authored engineering heuristics derived from explicit university capstone constraints.

### Constraint Evaluation Model:
- **Budget Fit**: Ratio of student budget to project cost (capped at 100%).
- **Compute Tier Fit**: Hierarchical rank comparison (`cpu_only` = 1, `t4_or_colab` = 2, `rtx_consumer_gpu` = 3, `cloud_multi_gpu` = 4).
- **Hardware Coverage**: Percentage match of required physical components (e.g., Raspberry Pi, ESP32, Camera).
- **Timeline Capacity**:
  - Week ratio: $\text{weeks\_available} / \text{estimated\_weeks}$
  - Hour ratio: $\text{total\_team\_hours} / \text{estimated\_hours}$
- **Skill Compatibility**: Weighted evaluation of team proficiency against required and critical domain competencies.

### The Hard Constraint Cap:
If **any** hard constraint fails (e.g., student has `cpu_only` but project requires `cloud_multi_gpu`, or a critical prerequisite skill is absent):
- Overall constraint status is set to **FAIL**.
- Feasibility is strictly **capped at 45.0 maximum**.
- Feasibility is further penalized by **8.0 points per distinct violation**:
  $$\text{Feasibility}_{\text{fail}} = \max(5.0, 45.0 - 8.0 \times |\text{violations}|)$$

### Passing Constraint Formulation:
When all hard constraints pass, the authoritative feasibility score is calculated as:
$$\text{Feasibility}_{\text{pass}} = 0.35 \times \text{TimeFit} + 0.35 \times \text{ResourceFit} + 0.30 \times \text{SkillMatch}$$

---

## 5. Gemini Intelligence Layer & The Unfair Twist

When an idea fails or scores poorly during the Reality Check, the Gemini Intelligence Layer initiates **Project Reforging**:

1. **Deep Reality Audit**:
   - Identifies hidden assumptions students make that fail in university environments.
   - Diagnoses technical, compute, and data dependency bottlenecks.
   - Formulates academic viva defense grilling questions.
2. **Project Reforging & Visual Diff**:
   - Replaces heavy, infeasible components with accessible, viable alternatives.
   - Generates a **Visual Diff** showing exactly what was **Removed**, **Modified**, and **Added**.
3. **The Unfair Twist**:
   - A technically defensible, novel differentiator that elevates the project above generic GitHub clones.
   - Examples: Adding expected calibration error (ECE) to medical classification, or remote photoplethysmography (rPPG) liveness detection to facial recognition.
4. **Natural Language Refinement**:
   - Interactive prompt refinement allows students to apply real-world adjustments (e.g., *"We only have 6 weeks"* or *"Switch to edge Raspberry Pi deployment"*).
   - Every refinement triggers automated deterministic re-scoring.

---

## 6. Security Architecture & Zero Browser Key Exposure

ForgeGrad AI enforces a strict zero-exposure security model:
- **Zero Browser Keys**: No Gemini API keys are ever entered into client browser forms or stored in `localStorage`.
- **Server-Side Orchestration**: All Gemini API calls originate strictly from the FastAPI backend using secure environment variables (`GEMINI_API_KEY`).
- **Production CORS**: Configured with an explicit whitelist (`https://forgegradai.vercel.app`) and verified regex pattern (`^https://.*\.vercel\.app$`). Wildcard `*` origins with credentials are fully prohibited.
- **Graceful Fallback**: If the Gemini API is unreachable or unconfigured, the backend automatically serves high-fidelity deterministic fallback audits without crashing.

---

## 7. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | High-performance reactive client with zero UI component libraries |
| **Styling** | Vanilla CSS Glassmorphism | Custom design tokens, dark mode palette, smooth micro-animations |
| **Backend** | Python 3.12 + FastAPI | High-throughput async REST API with Pydantic v2 data contracts |
| **Scoring Engine** | Pure Python Constraint Equations | Deterministic mathematical scoring, skill auditing, constraint gates |
| **LLM Reasoning** | Google Gemini Flash | Deep reality audit, scope right-sizing, and Unfair Twist generation |
| **Default Model** | `gemini-flash-lite-latest` | Fast (~2s latency), low cost, reliable structured JSON generation |
| **Deployment** | Vercel + Render | Decoupled serverless frontend + managed container backend |

---

## 8. Verified API Endpoints

All endpoints are live and fully verified:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check and seed project metrics |
| `GET` | `/api/v1/gemini/status` | Real-time status of Gemini model configuration |
| `POST` | `/api/v1/reality-check` | Deterministic constraint audit and feasibility evaluation |
| `POST` | `/api/v1/gemini/reforge` | Gemini reality audit + Unfair Twist project reforging |
| `POST` | `/api/v1/gemini/refine` | Natural-language refinement with deterministic re-score |
| `GET` | `/api/v1/projects` | Curated seed project catalog with filtering |
| `POST` | `/api/v1/evaluate-project` | Multi-factor scorecard generation for a single project |
| `POST` | `/api/v1/rank-projects` | Batch project ranking based on composite rank score |

---

## 9. Competition Demo Scenarios

### Scenario A: Extreme Unrealistic Proposal (The Overambitious Trap)
- **Student Inputs**: 2 members, 6 weeks, 8 hrs/week, $0 budget, CPU only, basic Python.
- **Raw Idea**: *"Autonomous multi-camera surgical robotics pipeline with custom 3D UNet fine-tuning."*
- **Reality Check Verdict**: `UNREALISTIC_REJECT` (Feasibility: 13/100, 4 Hard Failures).
- **Gemini Reality Audit**: Flags impossible 3D memory requirements on CPU, lack of clinical IRB approvals, and zero surgical robotics hardware.
- **Reforged Outcome**: *"Lightweight Surgical Instrument Edge-Localization via Classical Computer Vision"*.
- **The Unfair Twist**: Rule-based sub-millisecond edge localization with probabilistic occlusion confidence, running entirely on CPU.
- **Recalculated Score**: **88/100 (Pass)** with an honest Moderate Learning note.

### Scenario B: Cliché Proposal (The Presentation Attack Trap)
- **Student Inputs**: 3 members, 12 weeks, 15 hrs/week, $0 budget, Google Colab GPU.
- **Raw Idea**: *"AI attendance system using face recognition from laptop camera."*
- **Reality Check Verdict**: `HIGH_RISK_NEEDS_PIVOT` (Flags 0% novelty, generic copy-paste vulnerability).
- **Gemini Reality Audit**: Identifies extreme vulnerability to photo-replay spoofing during external viva defense.
- **Reforged Outcome**: *"Anti-Spoofing Attendance Verification with Remote Photoplethysmography (rPPG)"*.
- **The Unfair Twist**: Remote pulse liveness detection measuring sub-dermal micro-vascular flushing alongside facial embeddings.
- **Recalculated Score**: **88/100 (Pass)** with publication-grade academic novelty.

---

## 10. Local Setup & Testing

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Configure environment variables
cp ../.env.example ../.env
# Add your GEMINI_API_KEY in .env

# Run FastAPI server
python -m uvicorn backend.app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
# In the repository root
npm install

# Start Vite development server (proxies /api to localhost:8000)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 11. Test Suite & Validation

The codebase includes an automated test suite verifying both the deterministic mathematical equations and the Gemini integration:

### Run Backend Tests (Pytest)
```bash
python -m pytest backend/tests -v
```
**Result**: **47 passed in 23.45s** (covers constraints, scoring equations, skill evaluation, Gemini fallbacks, and API endpoints).

### Run Frontend Tests (Vitest)
```bash
npm test -- --run
```
**Result**: **7 passed in 6.78s** (covers onboarding wizard, Reality Check view, score dials, visual diffs, and refinement chips).

### Production Build Validation
```bash
npm run build
```
**Result**: Vite production bundle compiled cleanly with zero linting or packaging errors.

---

## 12. Environment Variables

| Variable | Scope | Description | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Backend | Google Gemini API key from AI Studio | `None` (triggers deterministic fallback) |
| `GEMINI_MODEL` | Backend | Configurable Gemini model identifier | `gemini-flash-lite-latest` |
| `ALLOWED_ORIGINS` | Backend | Comma-separated CORS allowed origins | `https://forgegradai.vercel.app` |
| `VITE_API_URL` | Frontend | Target backend API URL | Fallback to Render URL in production |

---

## 13. Hackathon Submission Notes

- **Built with Antigravity**: Developed using AI-native pair programming with Antigravity, including automated browser testing, test-driven development, and structured JSON contracts.
- **Model Efficiency**: Uses single-turn structured JSON requests with XML context bounding, executing complete project audits and reforges in ~2.0 seconds with minimal token consumption.
- **Zero Hallucinated Metrics**: Every project score is calculated with pure Python mathematical formulas. Gemini refactors the engineering specification; math determines the feasibility.
