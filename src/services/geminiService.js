/**
 * ForgeGrad AI - Legacy Browser Gemini Service (RETIRED)
 *
 * ARCHITECTURAL NOTICE:
 * Direct browser-side Gemini API execution has been permanently retired.
 *
 * The application enforces a strict, zero-exposure production architecture:
 * Browser Client -> FastAPI Backend (/api/v1/gemini/*) -> Google Gemini API.
 *
 * No Google API keys are stored in browser localStorage or transmitted in browser headers.
 * All live production Gemini interactions (Reality Check, Reforging, Unfair Twist, Refinement)
 * are handled exclusively by `src/services/apiService.js`.
 */

import { CURATED_PROJECTS } from '../data/curatedProjects';

/**
 * Safe compatibility stubs: zero localStorage usage, zero client key retention.
 */
export function getStoredApiKey() {
  return '';
}

export function setStoredApiKey(_key) {
  // No-op: browser-side key persistence is retired.
}

export function getStoredModel() {
  return 'gemini-flash-lite-latest';
}

export function setStoredModel(_model) {
  // No-op: backend controls model configuration via GEMINI_MODEL.
}

/**
 * Legacy Idea Generator helper (offline/curated catalog fallback).
 * Production idea analysis is routed through `/api/v1/reality-check` and `/api/v1/gemini/reforge`.
 */
export async function generateProjectIdeas({ branch, targetOutcome, resourceTier, studentIdeaOrInterest, teamSize }) {
  await new Promise(res => setTimeout(res, 300));

  const filtered = CURATED_PROJECTS.filter(p => 
    p.branch.toLowerCase().includes(branch.split(' ')[0].toLowerCase()) ||
    p.domain.toLowerCase().includes(branch.split(' ')[0].toLowerCase())
  );

  let selection = filtered.length >= 2 ? filtered : CURATED_PROJECTS.slice(0, 3);

  if (studentIdeaOrInterest && studentIdeaOrInterest.trim().length > 3) {
    const raw = studentIdeaOrInterest.trim();
    const customProject = {
      id: `proj-custom-${Date.now()}`,
      title: `Augmented-${raw.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}: Edge-Quantized Architecture`,
      domain: `${branch} & Emerging Tech`,
      branch: branch,
      targetType: targetOutcome,
      noveltyScore: 89,
      clicheWarning: `Direct implementations of "${raw}" are typically generic undergraduate assignments with hundreds of identical GitHub forks.`,
      unfairTwist: `Elevates "${raw}" by adding Edge-quantized ONNX inference (<50ms latency), Differential Privacy (ε=1.5), and automated baseline benchmark comparisons.`,
      summary: `An industry-defendable engineering system based on "${raw}", hardened with automated edge-quantization and privacy-preserving protocols for final year defense.`,
      difficulty: "Advanced",
      estimatedWeeks: 16,
      techStack: {
        frontend: "React 19, Recharts telemetry, WebSockets",
        backend: "Python FastAPI / Go microservices, Redis caching",
        mlModels: "PyTorch, ONNX INT8 Quantization, Scikit-learn Baselines",
        database: "PostgreSQL with Vector Embeddings (pgvector)",
        devops: "Docker, GitHub Actions CI/CD with automated benchmark tests"
      },
      architecture: {
        client: "Responsive Web/Edge Client streaming telemetry via WebSockets",
        gateway: "FastAPI Async Gateway with rate limiting & JWT verification",
        orchestration: "Quantized Inference Pipeline with fallback to cloud endpoints",
        storage: "PostgreSQL + pgvector for semantic retrieval & metric logging"
      },
      datasets: [
        {
          name: `Curated Domain Benchmark for ${raw.slice(0, 25)}`,
          size: "15,000+ validated samples with train/val/test splits",
          url: "https://paperswithcode.com/datasets",
          type: "Open Academic",
          license: "MIT / CC-BY 4.0"
        }
      ],
      roadmap: [
        { week: "Weeks 1-3", phase: "Literature Review & Problem Formulation", task: `Survey 12 IEEE papers on ${raw}; establish formal mathematical problem formulation.` },
        { week: "Weeks 4-6", phase: "Data Pipeline & Baseline Models", task: "Build clean ingestion pipeline and establish linear baseline metrics." },
        { week: "Weeks 7-9", phase: "Novel Algorithmic Core", task: "Implement core algorithmic innovation; tune hyperparameters with Optuna." },
        { week: "Weeks 10-12", phase: "Full-Stack Integration & Edge Quantization", task: "Integrate FastAPI backend with React dashboard; quantize weights to INT8." },
        { week: "Weeks 13-14", phase: "Security Hardening & Stress Testing", task: "Perform ablation studies and latency profiling under simulated traffic." },
        { week: "Weeks 15-16", phase: "IEEE Synopsis & Thesis Defense Prep", task: "Generate comprehensive final report, benchmark charts, and defense slides." }
      ],
      defenseQA: [
        {
          q: `Why did you select this specific architecture for "${raw}" over traditional cloud-based APIs?`,
          a: "Traditional cloud APIs introduce round-trip network latency (200-400ms), recurring token costs, and privacy vulnerabilities when transmitting raw user telemetry. Our edge-quantized model operates locally under 45ms with zero data transmission overhead, preserving privacy while satisfying real-time constraints.",
          examinerTrap: "Examiners will press on why you didn't just use an off-the-shelf OpenAI or pre-built API. Defend your local control, latency, and privacy."
        },
        {
          q: "What is your baseline benchmark, and how do you prove your system is statistically better?",
          a: "We benchmarked our proposed method against standard baselines (Logistic Regression and vanilla ResNet/BERT). Using 5-fold cross-validation and paired Student's t-tests (p < 0.01), our architecture achieved an 11.4% improvement in F1-score with a 4x reduction in parameter size.",
          examinerTrap: "Always provide concrete p-values and statistical significance, not just a raw accuracy number."
        }
      ]
    };
    return [customProject, ...selection.slice(0, 2)];
  }

  return selection;
}

/**
 * Legacy Viva Interrogation helper.
 */
export async function conductVivaInterrogation({ project, conversationHistory, studentResponse, persona = "sharma" }) {
  await new Promise(res => setTimeout(res, 400));

  const questions = project?.defenseQA || [];
  const currentIdx = Math.min(conversationHistory.length, questions.length - 1);
  const qObj = questions[currentIdx] || {
    q: "How does your architecture handle edge degradation under high-noise distributions?",
    a: "We apply test-time augmentation and uncertainty thresholding to flag out-of-distribution inputs.",
    examinerTrap: "Checking whether you understand distribution shift."
  };

  return {
    examinerFeedback: `Under evaluation for "${project?.title || 'Capstone'}". You argued: "${studentResponse.slice(0, 60)}...". Let us test your theoretical rigor.`,
    rigorScore: 8,
    confidenceScore: 8,
    coachTips: "Cite explicit ablation metrics and dataset baseline benchmarks (e.g. p < 0.01) to substantiate claims.",
    nextQuestion: qObj.q
  };
}

/**
 * Legacy IEEE Synopsis generator helper.
 */
export async function generateIEEESynopsis(project) {
  await new Promise(res => setTimeout(res, 300));
  return `# ${project.title}
## Abstract
This project proposes a novel engineering methodology in ${project.domain} addressing undergraduate feasibility constraints.
## Unfair Twist
${project.unfairTwist}
## Methodology
Quantized local inference with reproducible cross-validation benchmarks.`;
}
