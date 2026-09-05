from typing import Dict, List
from ..models.schemas import StudentProfile, Project, SkillMatchResult


def evaluate_skill_matching(student: StudentProfile, project: Project) -> SkillMatchResult:
    """
    Deterministic skill compatibility evaluation.
    Evaluates required project skills vs student self-rated proficiency (1-5).
    Produces satisfied skills, partial matches, missing skills, total gap, and learning burden.
    """
    if not project.required_skills:
        return SkillMatchResult(
            skill_match_score=100.0,
            satisfied_skills=[],
            partial_matches={},
            missing_skills=[],
            total_skill_gap=0,
            learning_burden="None",
        )

    satisfied_skills: List[str] = []
    partial_matches: Dict[str, Dict[str, int]] = {}
    missing_skills: List[str] = []
    total_gap: int = 0
    contributions: List[float] = []

    for skill_name, required_level in project.required_skills.items():
        clean_skill = skill_name.strip().lower()
        student_level = student.skills.get(clean_skill, 0)

        if student_level >= required_level:
            satisfied_skills.append(clean_skill)
            contributions.append(100.0)
        elif student_level > 0:
            gap = required_level - student_level
            total_gap += gap
            partial_matches[clean_skill] = {
                "have": student_level,
                "need": required_level,
                "gap": gap,
            }
            # Proportional credit for partial proficiency
            contributions.append((student_level / required_level) * 100.0)
        else:
            total_gap += required_level
            missing_skills.append(clean_skill)
            contributions.append(0.0)

    # Average percentage match across all required skills
    avg_score = sum(contributions) / len(contributions)
    skill_match_score = round(max(0.0, min(100.0, avg_score)), 2)

    # Deterministic categorization of learning burden
    if total_gap == 0:
        learning_burden = "None"
    elif total_gap <= 2:
        learning_burden = "Low"
    elif total_gap <= 5:
        learning_burden = "Moderate"
    elif total_gap <= 9:
        learning_burden = "High"
    else:
        learning_burden = "Critical"

    return SkillMatchResult(
        skill_match_score=skill_match_score,
        satisfied_skills=satisfied_skills,
        partial_matches=partial_matches,
        missing_skills=missing_skills,
        total_skill_gap=total_gap,
        learning_burden=learning_burden,
    )
