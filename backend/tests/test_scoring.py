import pytest
from pydantic import ValidationError
from backend.app.models.schemas import (
    StudentProfile,
    Project,
    ComputeTier,
    DifficultyLevel,
    TargetOutcome,
    ScoreWeights,
    ConstraintEvaluationResult,
)
from backend.app.core.scoring import (
    calculate_time_fit,
    calculate_resource_fit,
    calculate_feasibility,
    calculate_composite_rank,
    evaluate_project,
)


def make_student(
    weeks: int = 16,
    weekly_hours: int = 15,
    team_size: int = 3,
    budget: float = 100.0,
    compute: ComputeTier = ComputeTier.LOCAL_GPU,
    skills: dict = None,
    outcome: TargetOutcome = TargetOutcome.INDUSTRY_GRADE,
) -> StudentProfile:
    return StudentProfile(
        major="Computer Science",
        team_size=team_size,
        weeks_available=weeks,
        weekly_hours_per_member=weekly_hours,
        budget_limit_usd=budget,
        compute_tier=compute,
        skills=skills or {"python": 4, "pytorch": 3},
        target_outcome=outcome,
    )


def make_project(
    weeks: int = 12,
    hours: int = 300,
    cost: float = 50.0,
    compute: ComputeTier = ComputeTier.COLAB_FREE,
    required_skills: dict = None,
    risk_factors: list = None,
    target_outcomes: list = None,
    novelty: float = 85.0,
) -> Project:
    return Project(
        id="test-score-proj",
        title="Score Test Project",
        domain="AI",
        difficulty=DifficultyLevel.INTERMEDIATE,
        estimated_weeks=weeks,
        estimated_hours=hours,
        estimated_cost_usd=cost,
        compute_requirement=compute,
        required_skills=required_skills or {"python": 3, "pytorch": 3},
        critical_skills=["python"],
        target_outcomes=target_outcomes or [TargetOutcome.INDUSTRY_GRADE],
        novelty_baseline=novelty,
        risk_factors=risk_factors or ["General edge case"],
    )


def test_time_fit_calculation():
    # Student capacity: 16w * 3m * 15h = 720h, Project: 12w, 300h
    student = make_student()
    project = make_project()
    time_fit = calculate_time_fit(student, project)
    assert 75.0 <= time_fit <= 100.0


def test_time_fit_under_capacity():
    # Student capacity: 6w * 1m * 10h = 60h, Project: 12w, 300h
    student = make_student(weeks=6, weekly_hours=10, team_size=1)
    project = make_project(weeks=12, hours=300)
    time_fit = calculate_time_fit(student, project)
    assert time_fit < 50.0


def test_resource_fit_calculation():
    student = make_student(budget=100.0, compute=ComputeTier.LOCAL_GPU)
    project = make_project(cost=50.0, compute=ComputeTier.COLAB_FREE)
    res_fit = calculate_resource_fit(student, project)
    assert res_fit == 100.0


def test_resource_fit_budget_deficit():
    student = make_student(budget=25.0, compute=ComputeTier.LOCAL_GPU)
    project = make_project(cost=100.0, compute=ComputeTier.LOCAL_GPU)
    res_fit = calculate_resource_fit(student, project)
    # Budget component is 25%, compute is 100%, hardware is 100%
    # 0.35 * 25 + 0.40 * 100 + 0.25 * 100 = 8.75 + 40 + 25 = 73.75
    assert 73.0 <= res_fit <= 74.5


def test_feasibility_passing_vs_failing_constraints():
    pass_constraints = ConstraintEvaluationResult(
        overall_pass=True,
        timeline_pass=True,
        budget_pass=True,
        compute_pass=True,
        hardware_pass=True,
        critical_skills_pass=True,
    )
    fail_constraints = ConstraintEvaluationResult(
        overall_pass=False,
        timeline_pass=False,
        budget_pass=True,
        compute_pass=False,
        hardware_pass=True,
        critical_skills_pass=True,
        violations=["Timeline overrun", "Compute mismatch"],
    )

    feas_pass = calculate_feasibility(pass_constraints, time_fit=90.0, resource_fit=90.0, skill_match=90.0)
    feas_fail = calculate_feasibility(fail_constraints, time_fit=90.0, resource_fit=90.0, skill_match=90.0)

    assert feas_pass == 90.0
    assert feas_fail <= 45.0  # Hard constraints cap feasibility to max 45


def test_composite_rank_calculation():
    score = calculate_composite_rank(
        feasibility=80.0,
        skill_match=90.0,
        novelty=85.0,
        time_fit=70.0,
        target_outcome_fit=100.0,
    )
    # 0.30*80 (24) + 0.25*90 (22.5) + 0.20*85 (17) + 0.15*70 (10.5) + 0.10*100 (10) = 84.0
    assert score == 84.0


def test_custom_score_weights():
    custom_weights = ScoreWeights(
        feasibility=0.50,
        skill_match=0.20,
        novelty=0.10,
        time_fit=0.10,
        target_outcome_fit=0.10,
    )
    score = calculate_composite_rank(
        feasibility=100.0,
        skill_match=50.0,
        novelty=50.0,
        time_fit=50.0,
        target_outcome_fit=50.0,
        weights=custom_weights,
    )
    # 0.50*100 (50) + 0.20*50 (10) + 0.10*50 (5) + 0.10*50 (5) + 0.10*50 (5) = 75.0
    assert score == 75.0


def test_score_weights_validation_must_sum_to_one():
    with pytest.raises(ValidationError):
        ScoreWeights(
            feasibility=0.50,
            skill_match=0.50,
            novelty=0.50, # sum > 1.0
            time_fit=0.0,
            target_outcome_fit=0.0,
        )


def test_full_evaluate_project_scorecard():
    student = make_student()
    project = make_project()
    card = evaluate_project(student, project)

    assert card.project_id == project.id
    assert 0.0 <= card.feasibility_score <= 100.0
    assert 0.0 <= card.time_fit_score <= 100.0
    assert 0.0 <= card.resource_fit_score <= 100.0
    assert 0.0 <= card.risk_score <= 100.0
    assert 0.0 <= card.composite_rank_score <= 100.0
    assert len(card.score_breakdown_explanation) >= 6
