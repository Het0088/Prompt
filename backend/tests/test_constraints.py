import pytest
from pydantic import ValidationError
from backend.app.models.schemas import (
    StudentProfile,
    Project,
    ComputeTier,
    DifficultyLevel,
    TargetOutcome,
)
from backend.app.core.constraints import evaluate_constraints


def make_base_student(
    weeks: int = 16,
    weekly_hours: int = 15,
    team_size: int = 3,
    budget: float = 100.0,
    compute: ComputeTier = ComputeTier.LOCAL_GPU,
    hardware: list = None,
    skills: dict = None,
) -> StudentProfile:
    return StudentProfile(
        major="Computer Science",
        team_size=team_size,
        weeks_available=weeks,
        weekly_hours_per_member=weekly_hours,
        budget_limit_usd=budget,
        compute_tier=compute,
        hardware_available=hardware or [],
        skills=skills or {"python": 4, "pytorch": 3},
        target_outcome=TargetOutcome.INDUSTRY_GRADE,
    )


def make_base_project(
    weeks: int = 12,
    hours: int = 250,
    cost: float = 50.0,
    compute: ComputeTier = ComputeTier.COLAB_FREE,
    hardware: list = None,
    critical_skills: list = None,
) -> Project:
    return Project(
        id="test-p1",
        title="Test Project",
        domain="AI",
        difficulty=DifficultyLevel.INTERMEDIATE,
        estimated_weeks=weeks,
        estimated_hours=hours,
        estimated_cost_usd=cost,
        compute_requirement=compute,
        required_hardware=hardware or [],
        required_skills={"python": 3},
        critical_skills=critical_skills or ["python"],
        target_outcomes=[TargetOutcome.INDUSTRY_GRADE],
    )


def test_project_within_budget():
    student = make_base_student(budget=100.0)
    project = make_base_project(cost=50.0)
    result = evaluate_constraints(student, project)
    assert result.budget_pass is True
    assert result.overall_pass is True
    assert len(result.violations) == 0


def test_project_over_budget():
    student = make_base_student(budget=40.0)
    project = make_base_project(cost=100.0)
    result = evaluate_constraints(student, project)
    assert result.budget_pass is False
    assert result.overall_pass is False
    assert any("Budget Exceeded" in v for v in result.violations)


def test_project_exact_budget_boundary():
    student = make_base_student(budget=50.0)
    project = make_base_project(cost=50.0)
    result = evaluate_constraints(student, project)
    assert result.budget_pass is True


def test_project_within_timeline():
    # Student has 16 weeks, 3 members * 15 hrs = 45 hrs/wk -> 720 total hours
    student = make_base_student(weeks=16, weekly_hours=15, team_size=3)
    project = make_base_project(weeks=12, hours=300)
    result = evaluate_constraints(student, project)
    assert result.timeline_pass is True
    assert result.overall_pass is True


def test_project_over_timeline_weeks():
    # Project requires 20 weeks, student only has 12 weeks
    student = make_base_student(weeks=12)
    project = make_base_project(weeks=20, hours=200)
    result = evaluate_constraints(student, project)
    assert result.timeline_pass is False
    assert result.overall_pass is False
    assert any("Timeline Overrun" in v for v in result.violations)


def test_project_over_timeline_hours():
    # Weeks are fine (16 >= 10), but hours capacity is 1 * 1 * 10 = 100 hrs, project requires 300 hrs
    student = make_base_student(weeks=16, weekly_hours=10, team_size=1)
    project = make_base_project(weeks=10, hours=300)
    result = evaluate_constraints(student, project)
    assert result.timeline_pass is False
    assert any("Capacity Deficit" in v for v in result.violations)


def test_hardware_mismatch():
    student = make_base_student(hardware=["esp32"])
    project = make_base_project(hardware=["esp32", "raspberry_pi", "lora_module"])
    result = evaluate_constraints(student, project)
    assert result.hardware_pass is False
    assert result.overall_pass is False
    assert any("Missing Required Hardware" in v for v in result.violations)


def test_hardware_match():
    student = make_base_student(hardware=["ESP32", "Raspberry_Pi"])
    project = make_base_project(hardware=["esp32", "raspberry_pi"])
    result = evaluate_constraints(student, project)
    assert result.hardware_pass is True


def test_cpu_only_vs_gpu_required():
    student = make_base_student(compute=ComputeTier.CPU_ONLY)
    project = make_base_project(compute=ComputeTier.LOCAL_GPU)
    result = evaluate_constraints(student, project)
    assert result.compute_pass is False
    assert result.overall_pass is False
    assert any("Compute Tier Incompatible" in v for v in result.violations)


def test_gpu_student_meets_colab_requirement():
    student = make_base_student(compute=ComputeTier.LOCAL_GPU)
    project = make_base_project(compute=ComputeTier.COLAB_FREE)
    result = evaluate_constraints(student, project)
    assert result.compute_pass is True


def test_critical_skill_missing_causes_fail():
    # Student lacks 'c' which is marked as a critical prerequisite
    student = make_base_student(skills={"python": 4})
    project = make_base_project(critical_skills=["c"])
    result = evaluate_constraints(student, project)
    assert result.critical_skills_pass is False
    assert result.overall_pass is False
    assert any("Critical Prerequisite Missing" in v for v in result.violations)


def test_invalid_student_inputs_raise_validation_error():
    # Zero weeks
    with pytest.raises(ValidationError):
        make_base_student(weeks=0)

    # Zero team size
    with pytest.raises(ValidationError):
        make_base_student(team_size=0)

    # Negative budget
    with pytest.raises(ValidationError):
        make_base_student(budget=-10.0)

    # Invalid skill proficiency out of 1-5 range
    with pytest.raises(ValidationError):
        make_base_student(skills={"python": 6})

    with pytest.raises(ValidationError):
        make_base_student(skills={"python": 0})
