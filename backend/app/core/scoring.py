from typing import Optional, Dict
from ..models.schemas import (
    StudentProfile,
    Project,
    ConstraintEvaluationResult,
    SkillMatchResult,
    ScoreWeights,
    ProjectEvaluationScorecard,
    COMPUTE_TIER_RANK,
)
from .constraints import evaluate_constraints
from .skills import evaluate_skill_matching


def calculate_time_fit(student: StudentProfile, project: Project) -> float:
    """
    Calculates Time Fit Score (0.0 to 100.0).
    Evaluates both calendar weeks and total person-hour capacity.
    Formula:
      - Week Ratio: student.weeks_available / project.estimated_weeks
      - Hour Ratio: student.total_available_hours / project.estimated_hours
      - Under-capacity is penalized severely.
      - Over-capacity is rewarded, with slight dampening for massive mismatch.
    """
    if project.estimated_weeks <= 0 or project.estimated_hours <= 0:
        return 0.0

    w_ratio = student.weeks_available / project.estimated_weeks
    h_ratio = student.total_available_hours / project.estimated_hours

    # Week score
    if w_ratio < 1.0:
        s_w = max(0.0, w_ratio * 100.0)
    else:
        # Ideal fit around 1.0-1.5x; slight degradation if team has 52 weeks for a 2-week project
        s_w = max(70.0, 100.0 - min(30.0, (w_ratio - 1.0) * 8.0))

    # Hour score
    if h_ratio < 1.0:
        s_h = max(0.0, h_ratio * 100.0)
    else:
        s_h = max(75.0, 100.0 - min(25.0, (h_ratio - 1.0) * 5.0))

    time_fit = (0.40 * s_w) + (0.60 * s_h)
    return round(max(0.0, min(100.0, time_fit)), 2)


def calculate_resource_fit(student: StudentProfile, project: Project) -> float:
    """
    Calculates Resource Fit Score (0.0 to 100.0).
    Evaluates budget adequacy, compute tier hierarchy, and physical hardware coverage.
    """
    # 1. Budget Fit
    if project.estimated_cost_usd <= 0:
        budget_score = 100.0
    elif student.budget_limit_usd >= project.estimated_cost_usd:
        budget_score = 100.0
    else:
        budget_score = (student.budget_limit_usd / project.estimated_cost_usd) * 100.0
        budget_score = max(0.0, budget_score)

    # 2. Compute Fit
    student_c = COMPUTE_TIER_RANK.get(student.compute_tier, 1)
    project_c = COMPUTE_TIER_RANK.get(project.compute_requirement, 1)
    rank_delta = student_c - project_c
    if rank_delta >= 0:
        compute_score = 100.0
    elif rank_delta == -1:
        compute_score = 50.0
    elif rank_delta == -2:
        compute_score = 20.0
    else:
        compute_score = 0.0

    # 3. Hardware Fit
    if not project.required_hardware:
        hardware_score = 100.0
    else:
        student_hw = {hw.strip().lower() for hw in student.hardware_available if hw.strip()}
        matched_hw = sum(1 for hw in project.required_hardware if hw.strip().lower() in student_hw)
        hardware_score = (matched_hw / len(project.required_hardware)) * 100.0

    resource_fit = (0.35 * budget_score) + (0.40 * compute_score) + (0.25 * hardware_score)
    return round(max(0.0, min(100.0, resource_fit)), 2)


def calculate_feasibility(
    constraints: ConstraintEvaluationResult,
    time_fit: float,
    resource_fit: float,
    skill_match: float,
) -> float:
    """
    Calculates Feasibility Score (0.0 to 100.0).
    Deterministic rule: If any hard constraint fails, feasibility is capped at 45.0 maximum
    and penalized further by the count of distinct violations.
    If hard constraints pass:
      Feasibility = (0.35 * TimeFit) + (0.35 * ResourceFit) + (0.30 * SkillMatch)
    """
    if not constraints.overall_pass:
        penalty = len(constraints.violations) * 8.0
        capped = max(5.0, 45.0 - penalty)
        return round(capped, 2)

    base = (0.35 * time_fit) + (0.35 * resource_fit) + (0.30 * skill_match)
    return round(max(0.0, min(100.0, base)), 2)


def calculate_risk(
    project: Project,
    skill_match: float,
    time_fit: float,
    resource_fit: float,
    constraints: ConstraintEvaluationResult,
) -> float:
    """
    Calculates Risk Score (0.0 to 100.0).
    Higher score indicates greater project jeopardy / risk.
    Formula:
      - Inherent risk factors: 10 pts each, capped at 30.
      - Constraint failure penalty: +30 pts if hard constraint violated.
      - Skill deficit risk: (100 - SkillMatch) * 0.25
      - Timeline pressure risk: (100 - TimeFit) * 0.25
      - Resource squeeze risk: (100 - ResourceFit) * 0.20
    """
    inherent_risk = min(30.0, len(project.risk_factors) * 10.0)
    constraint_risk = 30.0 if not constraints.overall_pass else 0.0
    skill_deficit_risk = (100.0 - skill_match) * 0.25
    timeline_pressure_risk = (100.0 - time_fit) * 0.25
    resource_squeeze_risk = (100.0 - resource_fit) * 0.20

    total_risk = (
        inherent_risk
        + constraint_risk
        + skill_deficit_risk
        + timeline_pressure_risk
        + resource_squeeze_risk
    )
    return round(max(0.0, min(100.0, total_risk)), 2)


def calculate_target_outcome_fit(student: StudentProfile, project: Project) -> float:
    """
    Calculates Target Outcome Fit (0.0 to 100.0).
    Checks alignment between student's desired output (e.g. IEEE paper, Startup MVP)
    and project intended outcomes.
    """
    if not project.target_outcomes:
        return 75.0  # neutral general fit
    if student.target_outcome in project.target_outcomes:
        return 100.0
    return 35.0


def calculate_composite_rank(
    feasibility: float,
    skill_match: float,
    novelty: float,
    time_fit: float,
    target_outcome_fit: float,
    weights: Optional[ScoreWeights] = None,
) -> float:
    """
    Calculates Normalized Composite Rank Score (0.0 to 100.0).
    Default Weights:
      Feasibility: 0.30
      SkillMatch:  0.25
      Novelty:     0.20
      TimeFit:     0.15
      OutcomeFit:  0.10
    """
    w = weights or ScoreWeights()
    composite = (
        (w.feasibility * feasibility)
        + (w.skill_match * skill_match)
        + (w.novelty * novelty)
        + (w.time_fit * time_fit)
        + (w.target_outcome_fit * target_outcome_fit)
    )
    return round(max(0.0, min(100.0, composite)), 2)


def evaluate_project(
    student: StudentProfile,
    project: Project,
    weights: Optional[ScoreWeights] = None,
    novelty_override: Optional[float] = None,
) -> ProjectEvaluationScorecard:
    """
    Full deterministic evaluation of a single project against a student profile.
    Orchestrates constraint checking, skill compatibility, multi-factor scoring,
    and returns a complete machine-readable scorecard with human explanations.
    """
    constraints = evaluate_constraints(student, project)
    skills = evaluate_skill_matching(student, project)

    time_fit = calculate_time_fit(student, project)
    resource_fit = calculate_resource_fit(student, project)
    feasibility = calculate_feasibility(constraints, time_fit, resource_fit, skills.skill_match_score)
    risk = calculate_risk(project, skills.skill_match_score, time_fit, resource_fit, constraints)

    # Novelty interface: Isolated baseline in Milestone 1, extensible for Milestone 3 embeddings/LLM
    novelty = novelty_override if novelty_override is not None else project.novelty_baseline
    novelty = max(0.0, min(100.0, novelty))

    target_outcome_fit = calculate_target_outcome_fit(student, project)

    composite_rank = calculate_composite_rank(
        feasibility=feasibility,
        skill_match=skills.skill_match_score,
        novelty=novelty,
        time_fit=time_fit,
        target_outcome_fit=target_outcome_fit,
        weights=weights,
    )

    # Detailed plain-language justification for every metric
    explanations: Dict[str, str] = {
        "feasibility": (
            f"{'Hard constraints passed.' if constraints.overall_pass else 'Hard constraints failed: ' + '; '.join(constraints.violations)} "
            f"Feasibility scored {feasibility}/100 based on time ({time_fit}/100), resources ({resource_fit}/100), and skill readiness ({skills.skill_match_score}/100)."
        ),
        "skill_match": (
            f"Match: {skills.skill_match_score}/100. Satisfied: {len(skills.satisfied_skills)}, "
            f"Partial: {len(skills.partial_matches)}, Missing: {len(skills.missing_skills)}. "
            f"Learning burden assessed as '{skills.learning_burden}' (total gap: {skills.total_skill_gap})."
        ),
        "time_fit": (
            f"Score {time_fit}/100. Team capacity {student.total_available_hours} hrs across {student.weeks_available} wks "
            f"vs project estimate of {project.estimated_hours} hrs across {project.estimated_weeks} wks."
        ),
        "resource_fit": (
            f"Score {resource_fit}/100. Budget fit evaluates ${student.budget_limit_usd:.2f} available vs ${project.estimated_cost_usd:.2f} needed. "
            f"Compute tier: {student.compute_tier.value} vs required {project.compute_requirement.value}."
        ),
        "risk": (
            f"Risk index: {risk}/100. Project carries {len(project.risk_factors)} inherent risks; "
            f"{'compounded by hard constraint failure' if not constraints.overall_pass else 'mitigated by passing hard constraints'}."
        ),
        "target_outcome_fit": (
            f"Alignment: {target_outcome_fit}/100 between student goal '{student.target_outcome.value}' "
            f"and project targets [{', '.join(t.value for t in project.target_outcomes) if project.target_outcomes else 'General'}]."
        ),
        "composite_rank": (
            f"Rank Score: {composite_rank}/100. Weighted synthesis of Feasibility (30%), Skill Match (25%), "
            f"Novelty (20%), Time Fit (15%), and Target Outcome (10%)."
        ),
    }

    return ProjectEvaluationScorecard(
        project_id=project.id,
        project_title=project.title,
        constraints=constraints,
        skills=skills,
        feasibility_score=feasibility,
        time_fit_score=time_fit,
        resource_fit_score=resource_fit,
        risk_score=risk,
        novelty_score=novelty,
        target_outcome_fit_score=target_outcome_fit,
        composite_rank_score=composite_rank,
        score_breakdown_explanation=explanations,
    )
