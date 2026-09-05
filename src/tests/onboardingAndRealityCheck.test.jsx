import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingWizard from '../components/OnboardingWizard';
import RealityCheckView from '../components/RealityCheckView';
import { DEMO_STUDENT_PROFILE, DEMO_RAW_IDEA } from '../data/demoScenario';

// Mock apiService to prevent actual network calls during vitest runs
vi.mock('../services/apiService', async () => {
  const actual = await vi.importActual('../services/apiService');
  return {
    ...actual,
    reforgeWithGemini: vi.fn().mockResolvedValue({
      success: true,
      data: {
        gemini_status: "active",
        model_used: "gemini-flash-lite-latest",
        audit: {
          hidden_assumptions: ["Assumes clinical ground-truth datasets are readily available."],
          technical_risks: ["Intractable 3D convolution memory scaling."],
          unrealistic_scope_aspects: ["Open-world multi-organ segmentation exceeds 12 weeks."],
          data_dependency_risks: ["Strict patient privacy & IRB approvals needed."],
          compute_dependency_risks: ["Demands 24GB VRAM GPU, student has CPU."],
          skill_gap_analysis: "Team has foundational Python but needs transfer learning guidance.",
          academic_defense_weaknesses: ["Examiner: 'What is the novel contribution beyond public tutorials?'"],
        },
        reforge: {
          transformed_title: "MediSense: Calibrated Uncertainty & Explainable Diagnostic Decision Support",
          concise_problem_statement: "Undergraduate proposals suffer from compute bottlenecks.",
          proposed_solution: "A scoped 2D benchmark prototype with explainable Grad-CAM.",
          unfair_twist: "Uncertainty-Calibrated 2D Patch Ensembling with Explainable Grad-CAM Discrepancy",
          why_unfair_twist_is_defensible: "Grounds predictions in expected calibration error (ECE).",
          what_changed_summary: "Replaced 3D training with 2D calibrated ensembling.",
          visual_diff: {
            removed: ["End-to-end 3D CNN training from scratch"],
            modified: ["Architecture scaled down to CPU_ONLY"],
            added: ["Unfair Twist: Calibrated Uncertainty & ECE metric"],
          },
          why_each_change_was_necessary: [
            { change: "2D baseline", reason: "Fits CPU" },
          ],
          core_features: ["Local inference on CPU", "Grad-CAM visual attribution"],
          removed_features: ["3D volumetric reconstruction"],
          stretch_features: ["ONNX INT8 export"],
          research_angle: "Empirical trade-offs in quantization and calibration error.",
          evaluation_strategy: "Pareto curve on NIH Chest X-ray benchmark.",
          implementation_strategy: "3 phases across 12 weeks.",
          defense_strategy: "Focus viva on calibration error bounds.",
          reforged_project_spec: {
            estimated_weeks: 12,
            estimated_hours: 120,
            estimated_cost_usd: 0.0,
            compute_requirement: "cpu_only",
            required_hardware: [],
            required_skills: { python: 3 },
            critical_skills: ["python"],
            risk_factors: ["Validation latency"],
          },
        },
        deterministic_feasibility_before: 13.0,
        deterministic_feasibility_after: 84.0,
        recalculated_scorecard: {
          project_id: "reforged_project",
          project_title: "MediSense",
          constraints: { overall_pass: true },
          skills: { skill_match_score: 80.0 },
          feasibility_score: 84.0,
          time_fit_score: 85.0,
          resource_fit_score: 90.0,
          risk_score: 15.0,
          novelty_score: 88.0,
          target_outcome_fit_score: 90.0,
          composite_rank_score: 85.5,
          score_breakdown_explanation: {},
        },
        explanation: "Reforged via Gemini Flash intelligence.",
      },
    }),
    refineReforgedProject: vi.fn().mockResolvedValue({
      success: true,
      data: {
        gemini_status: "active",
        refinement_instruction_applied: "We only have 8 weeks",
        updated_reforge: {
          transformed_title: "MediSense-Rapid: 8-Week Calibrated Benchmark",
          concise_problem_statement: "Compressed for 8-week delivery.",
          proposed_solution: "Pre-trained feature extraction on local CPU.",
          unfair_twist: "Quantized Liveness with ECE Error Bounds",
          why_unfair_twist_is_defensible: "Directly defensible in fast viva.",
          what_changed_summary: "Compressed to 8 weeks.",
          visual_diff: {
            removed: ["Multi-dataset training"],
            modified: ["Timeline compressed to 8 weeks"],
            added: ["Rapid benchmarking suite"],
          },
          why_each_change_was_necessary: [],
          core_features: ["8-week sprint"],
          removed_features: [],
          stretch_features: [],
          research_angle: "Rapid benchmark",
          evaluation_strategy: "Single-fold validation",
          implementation_strategy: "8 weeks sprint",
          defense_strategy: "Examiner defense",
          reforged_project_spec: {
            estimated_weeks: 8,
            estimated_hours: 80,
            estimated_cost_usd: 0.0,
            compute_requirement: "cpu_only",
            required_hardware: [],
            required_skills: { python: 3 },
            critical_skills: ["python"],
            risk_factors: [],
          },
        },
        recalculated_scorecard: {
          project_id: "refined_project",
          project_title: "MediSense-Rapid",
          constraints: { overall_pass: true, timeline_pass: true },
          skills: { skill_match_score: 80.0 },
          feasibility_score: 88.0,
          time_fit_score: 90.0,
          resource_fit_score: 90.0,
          risk_score: 12.0,
          novelty_score: 85.0,
          target_outcome_fit_score: 90.0,
          composite_rank_score: 87.0,
          score_breakdown_explanation: {},
        },
        explanation: "Refined with instruction: 'We only have 8 weeks'",
      },
    }),
  };
});

describe('Milestone 2 & 3 - Frontend Test Suite', () => {
  
  // 1. Onboarding navigation
  it('navigates through onboarding steps correctly', () => {
    let profile = { ...DEMO_STUDENT_PROFILE };
    const setProfile = (fn) => { profile = typeof fn === 'function' ? fn(profile) : fn; };
    const setRawIdea = vi.fn();

    render(
      <OnboardingWizard 
        profile={profile}
        setProfile={setProfile}
        rawIdea=""
        setRawIdea={setRawIdea}
        onSubmitRealityCheck={vi.fn()}
        isLoading={false}
      />
    );

    // Initial step is step 1
    expect(screen.getByText(/About Your Academic Background/i)).toBeDefined();

    // Click Continue
    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn);

    // Now in step 2
    expect(screen.getByText(/Rate Your Core Technical Skills/i)).toBeDefined();
  });

  // 2. Skill selection & proficiency
  it('renders skill sliders and reflects proficiency adjustments', () => {
    let profile = { ...DEMO_STUDENT_PROFILE, skills: { python: 3, pytorch: 1 } };
    const setProfile = vi.fn();

    render(
      <OnboardingWizard 
        profile={profile}
        setProfile={setProfile}
        rawIdea=""
        setRawIdea={vi.fn()}
        onSubmitRealityCheck={vi.fn()}
        isLoading={false}
      />
    );

    // Navigate to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/PyTorch \/ Deep Learning/i)).toBeDefined();
  });

  // 3. Constraint input & 4. Validation
  it('validates timeline constraints and blocks invalid progression', () => {
    let profile = { ...DEMO_STUDENT_PROFILE, weeksAvailable: 0 };
    const setProfile = vi.fn();

    render(
      <OnboardingWizard 
        profile={profile}
        setProfile={setProfile}
        rawIdea=""
        setRawIdea={vi.fn()}
        onSubmitRealityCheck={vi.fn()}
        isLoading={false}
      />
    );

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(screen.getByText(/Hard Semester Constraints/i)).toBeDefined();

    // Attempt to proceed with weeksAvailable = 0
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/All timeline parameters must be at least 1/i)).toBeDefined();
  });

  // 5. Demo profile loading
  it('loads demo scenario upon clicking Load Demo Scenario', () => {
    const setProfile = vi.fn();
    const setRawIdea = vi.fn();

    render(
      <OnboardingWizard 
        profile={DEMO_STUDENT_PROFILE}
        setProfile={setProfile}
        rawIdea=""
        setRawIdea={setRawIdea}
        onSubmitRealityCheck={vi.fn()}
        isLoading={false}
      />
    );

    const demoBtn = screen.getByRole('button', { name: /Load Demo Scenario/i });
    fireEvent.click(demoBtn);

    expect(setProfile).toHaveBeenCalledWith(DEMO_STUDENT_PROFILE);
    expect(setRawIdea).toHaveBeenCalledWith(DEMO_RAW_IDEA);
  });

  // 6. API submission trigger
  it('calls onSubmitRealityCheck when submitting valid idea on Step 5', () => {
    const handleSubmit = vi.fn();

    render(
      <OnboardingWizard 
        profile={DEMO_STUDENT_PROFILE}
        setProfile={vi.fn()}
        rawIdea="Real-time AI medical diagnosis using large 3D medical images"
        setRawIdea={vi.fn()}
        onSubmitRealityCheck={handleSubmit}
        isLoading={false}
      />
    );

    // Click demo scenario to jump straight to step 5
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Scenario/i }));

    const submitBtn = screen.getByRole('button', { name: /Run Project Reality Check/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalled();
  });

  // 7. Milestone 3: Reality Check & Gemini Reforge rendering
  it('renders Reality Check verdict, Feasibility Dial, Gemini Audit, Unfair Twist, and Visual Diff', async () => {
    const mockResult = {
      verdict: "UNREALISTIC_REJECT",
      overall_feasibility: 13.0,
      constraints_assessment: {
        overall_pass: false,
        timeline_pass: false,
        budget_pass: false,
        compute_pass: false,
        hardware_pass: true,
        critical_skills_pass: false,
        details: {
          compute: "Student Tier: cpu_only | Required: cloud_gpu -> FAIL",
        },
        violations: ["Compute mismatch", "Timeline overrun"],
      },
      skill_gap_summary: {
        skill_match_score: 41.7,
        satisfied_skills: ["python"],
        partial_matches: { pytorch: { have: 1, need: 4, gap: 3 } },
        missing_skills: ["computer_vision"],
        total_skill_gap: 8,
        learning_burden: "High",
      },
      critical_risks: [
        {
          dimension: "Compute Infrastructure",
          severity: "HIGH",
          detail: "Requires cloud_gpu, but team is limited to cpu_only.",
          mitigation: "Quantize models to INT8.",
        },
      ],
      resource_issues: ["Requires cloud_gpu"],
      timeline_issues: ["Schedule compression: demands 22 weeks"],
      scope_risk_level: "CRITICAL",
      recommended_actions: [
        "De-scope deliverables: restrict phase 1 to 12 weeks.",
      ],
      explanation: "Reality Check Verdict: UNREALISTIC_REJECT. Feasibility 13.0/100.",
    };

    render(
      <RealityCheckView 
        result={mockResult}
        rawIdea={DEMO_RAW_IDEA}
        studentProfile={DEMO_STUDENT_PROFILE}
        onReset={vi.fn()}
        onEditConstraints={vi.fn()}
      />
    );

    // Verify Verdict and Dial
    expect(screen.getByText(/UNREALISTIC \/ HIGH REJECTION RISK/i)).toBeDefined();
    expect(screen.getByText("13")).toBeDefined();

    // Verify Dimensions
    expect(screen.getByText(/Semester Timeline/i)).toBeDefined();
    expect(screen.getByText(/Capacity Met|Overrun Risk/i)).toBeDefined();

    // Wait for Gemini Reforge mock to resolve
    await waitFor(() => {
      expect(screen.getByText(/Stage 2: Gemini Deep Reality Audit/i)).toBeDefined();
      expect(screen.getByText(/THE UNFAIR TWIST/i)).toBeDefined();
      expect(screen.getByText(/Architectural Transformation Diff/i)).toBeDefined();
      expect(screen.getByText(/REMOVED \(Impractical Scope\)/i)).toBeDefined();
      expect(screen.getByText(/MODIFIED \(Scaled to Fit\)/i)).toBeDefined();
      expect(screen.getByText(/ADDED \(Novelty & Defensibility\)/i)).toBeDefined();
      expect(screen.getByText(/Natural Language Refinement/i)).toBeDefined();
    });
  });

  // 8. Natural Language Refinement interaction
  it('applies quick action preset chip refinement', async () => {
    const mockResult = {
      verdict: "UNREALISTIC_REJECT",
      overall_feasibility: 13.0,
      constraints_assessment: {
        overall_pass: false,
        timeline_pass: false,
        budget_pass: false,
        compute_pass: false,
        hardware_pass: true,
        critical_skills_pass: false,
        details: {},
        violations: [],
      },
      skill_gap_summary: {
        skill_match_score: 50.0,
        satisfied_skills: [],
        partial_matches: {},
        missing_skills: [],
        total_skill_gap: 0,
        learning_burden: "Low",
      },
      critical_risks: [],
      resource_issues: [],
      timeline_issues: [],
      scope_risk_level: "HIGH",
      recommended_actions: [],
      explanation: "Analysis complete.",
    };

    render(
      <RealityCheckView 
        result={mockResult}
        rawIdea={DEMO_RAW_IDEA}
        studentProfile={DEMO_STUDENT_PROFILE}
        onReset={vi.fn()}
        onEditConstraints={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/⚡ We only have 8 weeks/i)).toBeDefined();
    });

    const chip = screen.getByText(/⚡ We only have 8 weeks/i);
    fireEvent.click(chip);

    await waitFor(() => {
      expect(screen.getByText(/Refinement applied: "⚡ We only have 8 weeks"/i)).toBeDefined();
    });
  });

});
