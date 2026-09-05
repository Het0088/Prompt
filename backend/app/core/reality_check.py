from typing import List, Dict, Optional, Any, Protocol
from ..models.schemas import (
    StudentProfile,
    Project,
    RealityCheckRequest,
    RealityCheckResponse,
    ConstraintEvaluationResult,
    SkillMatchResult,
    ComputeTier,
    COMPUTE_TIER_RANK,
)
from .constraints import evaluate_constraints
from .skills import evaluate_skill_matching
from .scoring import (
    calculate_time_fit,
    calculate_resource_fit,
    calculate_feasibility,
    calculate_risk,
)


class RealityCheckAIProvider(Protocol):
    """
    Interface/Protocol for future Gemini LLM qualitative reasoning integration (Milestone 2/3).
    Allows AI to enhance qualitative explanations and synthesize the 'Transformed Project'
    while deterministic code continues to govern all mathematical metrics.
    """
    async def enhance_reality_check(
        self,
        request: RealityCheckRequest,
        deterministic_summary: Dict[str, Any],
    ) -> Dict[str, Any]:
        ...


def infer_project_requirements_from_raw_idea(raw_idea: str, student: StudentProfile) -> Project:
    """
    Deterministic domain heuristic: Analyzes raw student proposal text to detect
    unrealistic technical assumptions, hardware needs, compute barriers, and data constraints.
    Prevents students from getting false 100% feasibility on impossible project ideas.
    """
    text = raw_idea.lower()

    # Default baseline
    domain = student.major
    weeks = student.weeks_available
    hours = student.total_available_hours
    cost = student.budget_limit_usd
    compute = student.compute_tier
    hardware = []
    required_skills = {}
    critical_skills = []
    risk_factors = []
    custom_transformed_title = None
    custom_pivot = None
    custom_hook = None

    # Pattern 1: Medical / 3D Imaging / Clinical Diagnostics
    if any(k in text for k in ["3d", "mri", "ct scan", "radiology", "tumor", "cancer", "medical diagnosis", "patient vitals"]):
        domain = "AI / Medical Diagnostics"
        weeks = max(22, student.weeks_available + 6)
        hours = max(680, int(student.total_available_hours * 1.4))
        cost = max(600.0, student.budget_limit_usd + 300.0)
        compute = ComputeTier.CLOUD_GPU
        required_skills = {
            "python": 4,
            "pytorch": 4,
            "machine_learning": 3,
            "computer_vision": 3 if any(v in text for v in ["3d", "image", "mri", "scan"]) else 2,
        }
        critical_skills = ["python", "pytorch"]
        risk_factors = [
            "Severe clinical dataset access barrier (HIPAA / IRB regulatory compliance prevents hospital telemetry export)",
            "Volumetric 3D image patch processing requires multi-GPU VRAM exceeding student compute tier",
            "Clinical evaluation metric trap: raw accuracy is rejected by medical boards in imbalanced cohorts",
        ]
        custom_transformed_title = "Privacy-Preserving Clinical Decision-Support Prototype using Public 2D Benchmarks"
        custom_pivot = (
            "Pivot from unconstrained real-time whole-body 3D diagnostic claims to an edge-quantized "
            "decision-support prototype trained on open-access benchmark slices (e.g. CAMELYON17 / PhysioNet)."
        )
        custom_hook = (
            "Defend using verified open benchmarks, ROC-AUC / F1 metrics, and latency profiling "
            "rather than claiming unvalidated clinical trial readiness."
        )

    # Pattern 2: Autonomous Robotics / Drones / Self-Driving
    elif any(k in text for k in ["drone", "autonomous vehicle", "self driving", "lidar", "quadcopter", "uav"]):
        domain = "Robotics / Embedded Systems"
        weeks = max(18, student.weeks_available + 4)
        hours = max(520, int(student.total_available_hours * 1.3))
        cost = max(500.0, student.budget_limit_usd + 250.0)
        compute = ComputeTier.LOCAL_GPU
        hardware = ["drone_platform", "embedded_controller", "sensors"]
        required_skills = {"python": 3, "embedded_c": 3, "computer_vision": 3}
        critical_skills = ["embedded_c"]
        risk_factors = [
            "High hardware procurement expense and potential physical collision damage during test flights",
            "Real-time aerodynamic flight control latency constraints under varying weather conditions",
        ]
        custom_transformed_title = "Gazebo/SITL-Simulated Autonomous Aerial Perception & Path Planning Agent"
        custom_pivot = "Replace expensive physical UAV procurement with hardware-in-the-loop Gazebo simulation coupled with real sensor telemetry."

    # Pattern 3: Large Language Models / Training from Scratch
    elif any(k in text for k in ["train llm", "pre-train", "pretraining", "foundation model from scratch", "70b"]):
        domain = "AI / Natural Language Processing"
        weeks = max(24, student.weeks_available + 8)
        hours = max(750, int(student.total_available_hours * 1.5))
        cost = max(1500.0, student.budget_limit_usd + 800.0)
        compute = ComputeTier.CLOUD_GPU
        required_skills = {"python": 5, "pytorch": 5, "cuda": 4}
        critical_skills = ["python", "pytorch"]
        risk_factors = [
            "Pre-training from scratch exceeds undergraduate compute grants by 100x",
            "Multi-node GPU communication bottlenecks and gradient divergence",
        ]
        custom_transformed_title = "Parameter-Efficient Low-Rank Adaptation (LoRA) Domain Adapter on Distilled LLM"
        custom_pivot = "Replace training-from-scratch with QLoRA 4-bit fine-tuning of a compact 3B/7B open model on consumer hardware."

    # Pattern 4: Cliché Attendance / Basic Facial Recognition
    elif any(k in text for k in ["attendance", "face recognition", "facial recognition", "student attendance"]):
        domain = "Computer Vision / Systems"
        weeks = min(student.weeks_available, 12)
        hours = min(student.total_available_hours, 240)
        compute = ComputeTier.CPU_ONLY
        required_skills = {"python": 3, "computer_vision": 2}
        risk_factors = [
            "Extreme undergraduate saturation: thousands of identical OpenCV Haar-cascade GitHub repos exist",
            "Vulnerable to 2D photo/screen replay spoofing during viva review",
        ]
        custom_transformed_title = "BioProof: Edge-Based rPPG Liveness-Aware Verification with Zero Video Uploads"
        custom_pivot = "Upgrade basic Haar-cascade attendance to sub-dermal pulse liveness detection with privacy-preserving verification."

    # Pattern 5: Post-Quantum / Hardware Crypto
    elif any(k in text for k in ["post-quantum", "pqc", "quantum safe", "scada vpn", "kyber"]):
        domain = "Cybersecurity / Cryptography"
        weeks = max(16, student.weeks_available)
        hours = max(400, student.total_available_hours)
        cost = 120.0
        hardware = ["raspberry_pi"]
        required_skills = {"c": 3, "cryptography": 3, "networking": 3}
        critical_skills = ["c"]
        risk_factors = ["Lattice cryptography key size fragmentation over standard MTU frames"]

    return Project(
        id="ad-hoc-idea",
        title=custom_transformed_title or raw_idea[:60],
        domain=domain,
        estimated_weeks=weeks,
        estimated_hours=hours,
        estimated_cost_usd=cost,
        compute_requirement=compute,
        required_hardware=hardware,
        required_skills=required_skills,
        critical_skills=critical_skills,
        risk_factors=risk_factors,
        description=raw_idea,
    )


def perform_deterministic_reality_check(
    request: RealityCheckRequest,
    project: Optional[Project] = None,
    ai_provider: Optional[RealityCheckAIProvider] = None,
) -> RealityCheckResponse:
    """
    Executes the deterministic core of the Project Reality Check.
    Audits student capacity, resource boundaries, and skill readiness against the project.
    Determines verdict, critical risks, resource/timeline issues, and concrete action recommendations.
    """
    student = request.student_profile

    # If no explicit candidate project is passed, infer realistic technical requirements from the raw text
    if project is None:
        project = infer_project_requirements_from_raw_idea(request.raw_project_idea, student)

    # 1. Deterministic Constraint & Skill Evaluation
    constraints = evaluate_constraints(student, project)
    skills = evaluate_skill_matching(student, project)

    time_fit = calculate_time_fit(student, project)
    resource_fit = calculate_resource_fit(student, project)
    feasibility = calculate_feasibility(constraints, time_fit, resource_fit, skills.skill_match_score)
    risk = calculate_risk(project, skills.skill_match_score, time_fit, resource_fit, constraints)

    # 2. Extract Specific Critical Risks & Bottlenecks
    critical_risks: List[Dict[str, str]] = []
    resource_issues: List[str] = []
    timeline_issues: List[str] = []

    # Compute risk
    student_c = COMPUTE_TIER_RANK.get(student.compute_tier, 1)
    project_c = COMPUTE_TIER_RANK.get(project.compute_requirement, 1)
    if student_c < project_c:
        issue = f"Requires '{project.compute_requirement.value}', but team is limited to '{student.compute_tier.value}'."
        resource_issues.append(issue)
        critical_risks.append({
            "dimension": "Compute Infrastructure",
            "severity": "HIGH",
            "detail": issue,
            "mitigation": "Quantize models (INT8/ONNX), utilize smaller distilled baselines, or shift to Google Colab T4."
        })

    # Budget risk
    if student.budget_limit_usd < project.estimated_cost_usd:
        issue = f"Estimated project cost (${project.estimated_cost_usd:.2f}) exceeds student budget (${student.budget_limit_usd:.2f})."
        resource_issues.append(issue)
        critical_risks.append({
            "dimension": "Financial Budget",
            "severity": "HIGH" if student.budget_limit_usd == 0 else "MEDIUM",
            "detail": issue,
            "mitigation": "Substitute proprietary paid APIs with open-source Hugging Face models or local microservices."
        })

    # Hardware risk
    if not constraints.hardware_pass:
        issue = f"Physical hardware dependencies not present in student inventory: {project.required_hardware}."
        resource_issues.append(issue)
        critical_risks.append({
            "dimension": "Physical Hardware",
            "severity": "HIGH",
            "detail": issue,
            "mitigation": "Simulate hardware telemetry in software, use Gazebo/Wokwi emulators, or acquire low-cost ESP32 chips."
        })

    # Timeline & capacity risk
    if not constraints.timeline_pass:
        if student.weeks_available < project.estimated_weeks:
            issue = f"Schedule compression: project demands {project.estimated_weeks} weeks; only {student.weeks_available} available."
            timeline_issues.append(issue)
            critical_risks.append({
                "dimension": "Semester Timeline",
                "severity": "CRITICAL" if (project.estimated_weeks - student.weeks_available) >= 4 else "HIGH",
                "detail": issue,
                "mitigation": "Drop stretch features immediately; lock core SDLC to literature review + single baseline."
            })
        if student.total_available_hours < project.estimated_hours:
            issue = f"Team capacity deficit: requires {project.estimated_hours} hrs; team can deliver {student.total_available_hours} hrs."
            timeline_issues.append(issue)

    # Skill gap risk
    if skills.total_skill_gap > 5 or skills.learning_burden in ("High", "Critical"):
        critical_risks.append({
            "dimension": "Prerequisite Technical Skills",
            "severity": "HIGH",
            "detail": f"Large prerequisite skill deficit ({skills.total_skill_gap} total gap across missing skills: {skills.missing_skills}).",
            "mitigation": "Adopt higher-level frameworks (e.g. Scikit-learn/FastAPI) before tackling low-level PyTorch CUDA kernels."
        })

    # Inherent risk factors from project definition
    for rf in project.risk_factors:
        critical_risks.append({
            "dimension": "Domain Risk",
            "severity": "MEDIUM",
            "detail": rf,
            "mitigation": "Establish clear synthetic fallback datasets and verify licensing in Week 1."
        })

    # 3. Scope Risk Level
    if len(constraints.violations) >= 2 or feasibility < 35.0:
        scope_risk = "CRITICAL"
    elif len(constraints.violations) == 1 or feasibility < 55.0:
        scope_risk = "HIGH"
    elif feasibility < 75.0:
        scope_risk = "MEDIUM"
    else:
        scope_risk = "LOW"

    # 4. Deterministic Verdict
    if scope_risk == "CRITICAL" or not constraints.overall_pass and feasibility < 40.0:
        verdict = "UNREALISTIC_REJECT"
    elif scope_risk in ("HIGH", "MEDIUM") or not constraints.overall_pass:
        verdict = "HIGH_RISK_NEEDS_PIVOT"
    else:
        verdict = "FEASIBLE"

    # 5. Concrete Recommended Actions
    recommended_actions: List[str] = []
    if timeline_issues:
        recommended_actions.append(f"De-scope deliverables: restrict phase 1 to a verifiable MVP runnable in {student.weeks_available} weeks.")
    if resource_issues:
        recommended_actions.append("Replace heavy cloud dependencies with edge-quantized open-source alternatives.")
    if skills.missing_skills:
        recommended_actions.append(f"Dedicate the first 2 weeks to targeted upskilling in [{', '.join(skills.missing_skills[:3])}].")
    if not recommended_actions:
        recommended_actions.append("Proceed to full architectural blueprint and milestone phase-gating.")

    # 6. Structured Transformed Project Preview
    transformed_preview = {
        "original_proposal": request.raw_project_idea,
        "adapted_title": f"Scoped & Feasible {project.title}",
        "scoped_duration_weeks": min(student.weeks_available, project.estimated_weeks),
        "scoped_hours": min(student.total_available_hours, project.estimated_hours),
        "recommended_compute": student.compute_tier.value,
        "architectural_pivot": (
            "Shift from unconstrained cloud architecture to a modular prototype tailored to your "
            f"{student.weeks_available}-week timeline and {student.compute_tier.value} environment."
        ),
        "defense_survival_hook": (
            f"Preempt examiner challenges by demonstrating empirical baseline comparisons within your "
            f"{student.total_available_hours}-hour capacity rather than claiming an incomplete enterprise system."
        ),
    }

    # 7. Comprehensive Explanation
    explanation = (
        f"Reality Check Verdict: {verdict}. Overall feasibility calculated at {feasibility:.1f}/100. "
        f"The proposed project requires {project.estimated_hours} person-hours across {project.estimated_weeks} weeks, "
        f"against your team capacity of {student.total_available_hours} hours over {student.weeks_available} weeks. "
        f"Hard constraint status: {'PASSED' if constraints.overall_pass else 'FAILED (' + str(len(constraints.violations)) + ' violation(s))'}. "
        f"Skill readiness is at {skills.skill_match_score:.1f}% with learning burden classified as '{skills.learning_burden}'."
    )

    return RealityCheckResponse(
        verdict=verdict,
        overall_feasibility=feasibility,
        constraints_assessment=constraints,
        skill_gap_summary=skills,
        critical_risks=critical_risks,
        resource_issues=resource_issues,
        timeline_issues=timeline_issues,
        scope_risk_level=scope_risk,
        recommended_actions=recommended_actions,
        transformed_project_preview=transformed_preview,
        explanation=explanation,
    )
