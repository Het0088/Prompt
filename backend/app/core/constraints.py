from typing import List, Dict
from ..models.schemas import (
    StudentProfile,
    Project,
    ConstraintEvaluationResult,
    COMPUTE_TIER_RANK,
)


def evaluate_constraints(student: StudentProfile, project: Project) -> ConstraintEvaluationResult:
    """
    Deterministic constraint evaluation.
    Evaluates hard boundaries: Budget, Timeline, Compute, Hardware, Critical Skills.
    Returns explicit PASS / FAIL status and granular violations.
    Zero hallucination, pure deterministic logic.
    """
    violations: List[str] = []
    details: Dict[str, str] = {}

    # 1. Timeline & Available Hours Evaluation
    # Both weeks and total person-hours are checked
    weeks_ok = student.weeks_available >= project.estimated_weeks
    hours_ok = student.total_available_hours >= project.estimated_hours
    timeline_pass = weeks_ok and hours_ok

    if not weeks_ok:
        violations.append(
            f"Timeline Overrun: Project requires {project.estimated_weeks} weeks, but team only has {student.weeks_available} weeks available."
        )
    if not hours_ok:
        violations.append(
            f"Capacity Deficit: Project requires {project.estimated_hours} total hours, but team capacity is {student.total_available_hours} hours "
            f"({student.weeks_available}w x {student.team_size} members x {student.weekly_hours_per_member}h/wk)."
        )
    details["timeline"] = (
        f"Team Capacity: {student.total_available_hours} hrs / {student.weeks_available} wks | "
        f"Required: {project.estimated_hours} hrs / {project.estimated_weeks} wks -> "
        f"{'PASS' if timeline_pass else 'FAIL'}"
    )

    # 2. Budget Evaluation
    budget_pass = student.budget_limit_usd >= project.estimated_cost_usd
    if not budget_pass:
        violations.append(
            f"Budget Exceeded: Project estimated cost is ${project.estimated_cost_usd:.2f}, exceeding student budget limit of ${student.budget_limit_usd:.2f}."
        )
    details["budget"] = (
        f"Available: ${student.budget_limit_usd:.2f} | Required: ${project.estimated_cost_usd:.2f} -> "
        f"{'PASS' if budget_pass else 'FAIL'}"
    )

    # 3. Compute Tier Hierarchy Evaluation
    student_compute_rank = COMPUTE_TIER_RANK.get(student.compute_tier, 1)
    project_compute_rank = COMPUTE_TIER_RANK.get(project.compute_requirement, 1)
    compute_pass = student_compute_rank >= project_compute_rank
    if not compute_pass:
        violations.append(
            f"Compute Tier Incompatible: Project requires '{project.compute_requirement.value}' (rank {project_compute_rank}), "
            f"but student only has '{student.compute_tier.value}' (rank {student_compute_rank})."
        )
    details["compute"] = (
        f"Student Tier: {student.compute_tier.value} (Rank {student_compute_rank}) | "
        f"Required: {project.compute_requirement.value} (Rank {project_compute_rank}) -> "
        f"{'PASS' if compute_pass else 'FAIL'}"
    )

    # 4. Hardware Availability Evaluation
    student_hw_normalized = {hw.strip().lower() for hw in student.hardware_available if hw.strip()}
    missing_hw = []
    for req_hw in project.required_hardware:
        clean_req = req_hw.strip().lower()
        if clean_req and clean_req not in student_hw_normalized:
            missing_hw.append(req_hw)

    hardware_pass = len(missing_hw) == 0
    if not hardware_pass:
        violations.append(
            f"Missing Required Hardware: Project requires physical hardware [{', '.join(missing_hw)}] not available in student inventory."
        )
    details["hardware"] = (
        f"Required: {project.required_hardware if project.required_hardware else 'None'} | "
        f"Missing: {missing_hw if missing_hw else 'None'} -> "
        f"{'PASS' if hardware_pass else 'FAIL'}"
    )

    # 5. Critical Prerequisite Skills Evaluation
    missing_critical = []
    for crit_skill in project.critical_skills:
        clean_crit = crit_skill.strip().lower()
        student_level = student.skills.get(clean_crit, 0)
        # Critical skills require at least level 1 (student must possess foundational familiarity)
        if student_level < 1:
            missing_critical.append(crit_skill)

    critical_skills_pass = len(missing_critical) == 0
    if not critical_skills_pass:
        violations.append(
            f"Critical Prerequisite Missing: Zero familiarity in critical foundation skill(s): [{', '.join(missing_critical)}]."
        )
    details["critical_skills"] = (
        f"Critical Skills Checked: {project.critical_skills if project.critical_skills else 'None'} | "
        f"Missing Foundation: {missing_critical if missing_critical else 'None'} -> "
        f"{'PASS' if critical_skills_pass else 'FAIL'}"
    )

    overall_pass = (
        timeline_pass
        and budget_pass
        and compute_pass
        and hardware_pass
        and critical_skills_pass
    )

    return ConstraintEvaluationResult(
        overall_pass=overall_pass,
        timeline_pass=timeline_pass,
        budget_pass=budget_pass,
        compute_pass=compute_pass,
        hardware_pass=hardware_pass,
        critical_skills_pass=critical_skills_pass,
        details=details,
        violations=violations,
    )
