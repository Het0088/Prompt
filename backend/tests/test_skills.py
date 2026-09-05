from backend.app.models.schemas import (
    StudentProfile,
    Project,
    ComputeTier,
    TargetOutcome,
)
from backend.app.core.skills import evaluate_skill_matching


def make_student(skills: dict) -> StudentProfile:
    return StudentProfile(
        major="Computer Science",
        team_size=3,
        weeks_available=16,
        weekly_hours_per_member=15,
        budget_limit_usd=100.0,
        compute_tier=ComputeTier.LOCAL_GPU,
        skills=skills,
        target_outcome=TargetOutcome.INDUSTRY_GRADE,
    )


def make_project(required_skills: dict) -> Project:
    return Project(
        id="test-skill-proj",
        title="Skill Test",
        domain="AI",
        estimated_weeks=12,
        estimated_hours=250,
        required_skills=required_skills,
    )


def test_complete_skill_match():
    student = make_student(skills={"python": 4, "pytorch": 3, "docker": 3})
    project = make_project(required_skills={"python": 3, "pytorch": 3})
    result = evaluate_skill_matching(student, project)

    assert result.skill_match_score == 100.0
    assert "python" in result.satisfied_skills
    assert "pytorch" in result.satisfied_skills
    assert len(result.partial_matches) == 0
    assert len(result.missing_skills) == 0
    assert result.total_skill_gap == 0
    assert result.learning_burden == "None"


def test_partial_skill_match():
    # Student has PyTorch at level 1, but project requires level 3
    # Student has Python at level 3, project requires 3
    student = make_student(skills={"python": 3, "pytorch": 1})
    project = make_project(required_skills={"python": 3, "pytorch": 3})
    result = evaluate_skill_matching(student, project)

    # Contributions: python = 100%, pytorch = (1/3)*100 = 33.33% -> avg = 66.67%
    assert 66.0 <= result.skill_match_score <= 67.0
    assert "python" in result.satisfied_skills
    assert "pytorch" in result.partial_matches
    assert result.partial_matches["pytorch"]["have"] == 1
    assert result.partial_matches["pytorch"]["need"] == 3
    assert result.partial_matches["pytorch"]["gap"] == 2
    assert result.total_skill_gap == 2
    assert result.learning_burden == "Low"


def test_severe_skill_gap():
    # Student only knows HTML/CSS, project requires advanced C++, CUDA, Linux, OS
    student = make_student(skills={"html": 4, "css": 4})
    project = make_project(required_skills={
        "c": 4,
        "cuda": 4,
        "linux": 3,
        "operating_systems": 3,
    })
    result = evaluate_skill_matching(student, project)

    assert result.skill_match_score == 0.0
    assert len(result.satisfied_skills) == 0
    assert len(result.missing_skills) == 4
    assert result.total_skill_gap == (4 + 4 + 3 + 3) # 14
    assert result.learning_burden == "Critical"


def test_empty_required_skills():
    student = make_student(skills={"python": 3})
    project = make_project(required_skills={})
    result = evaluate_skill_matching(student, project)

    assert result.skill_match_score == 100.0
    assert result.learning_burden == "None"
    assert result.total_skill_gap == 0


def test_skill_case_insensitivity():
    # Student entered "PyTorch" and "REACT", project has "pytorch" and "react"
    student = make_student(skills={"PyTorch": 4, "REACT": 3})
    project = make_project(required_skills={"pytorch": 3, "react": 3})
    result = evaluate_skill_matching(student, project)

    assert result.skill_match_score == 100.0
    assert "pytorch" in result.satisfied_skills
    assert "react" in result.satisfied_skills
