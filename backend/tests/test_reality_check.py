from backend.app.models.schemas import (
    StudentProfile,
    Project,
    ComputeTier,
    TargetOutcome,
    RealityCheckRequest,
)
from backend.app.core.reality_check import perform_deterministic_reality_check
from backend.app.data.seed_projects import get_seed_project_by_id


def make_student(
    weeks: int = 14,
    weekly_hours: int = 15,
    team_size: int = 3,
    budget: float = 0.0,
    compute: ComputeTier = ComputeTier.COLAB_FREE,
    skills: dict = None,
) -> StudentProfile:
    return StudentProfile(
        major="Computer Science",
        team_size=team_size,
        weeks_available=weeks,
        weekly_hours_per_member=weekly_hours,
        budget_limit_usd=budget,
        compute_tier=compute,
        skills=skills or {"python": 4, "pytorch": 3, "machine_learning": 3},
        target_outcome=TargetOutcome.IEEE_PAPER,
    )


def test_reality_check_on_feasible_project():
    # Sepsis ICU project fits 14 weeks, Colab Free, $0 budget, student skills
    student = make_student()
    candidate = get_seed_project_by_id("proj-aiml-01")
    req = RealityCheckRequest(
        student_profile=student,
        raw_project_idea="Build an ICU patient sepsis shock prediction model using PhysioNet vitals",
        candidate_project_id="proj-aiml-01",
    )
    res = perform_deterministic_reality_check(req, candidate)

    assert res.verdict == "FEASIBLE"
    assert res.overall_feasibility >= 70.0
    assert res.constraints_assessment.overall_pass is True
    assert res.scope_risk_level in ("LOW", "MEDIUM")
    assert res.transformed_project_preview is not None


def test_reality_check_on_extreme_unrealistic_project():
    # Student has $0 budget and Colab Free, but Brain Tumor MRI project needs $1200 Cloud GPU and 24 weeks
    student = make_student(weeks=12, budget=0.0, compute=ComputeTier.CPU_ONLY)
    candidate = get_seed_project_by_id("proj-aiml-02-extreme")
    req = RealityCheckRequest(
        student_profile=student,
        raw_project_idea="Real-time 3D volumetric MRI segmentation with vision transformers",
        candidate_project_id="proj-aiml-02-extreme",
    )
    res = perform_deterministic_reality_check(req, candidate)

    assert res.verdict in ("UNREALISTIC_REJECT", "HIGH_RISK_NEEDS_PIVOT")
    assert res.overall_feasibility < 50.0
    assert res.constraints_assessment.overall_pass is False
    assert len(res.critical_risks) >= 2
    # Verify compute and budget risks flagged
    dimensions = [r["dimension"] for r in res.critical_risks]
    assert "Compute Infrastructure" in dimensions
    assert "Financial Budget" in dimensions
    assert len(res.timeline_issues) > 0


def test_reality_check_missing_hardware():
    # Project requires Raspberry Pi, student has none
    student = make_student(weeks=16)
    candidate = get_seed_project_by_id("proj-cyber-02-hardware")
    req = RealityCheckRequest(
        student_profile=student,
        raw_project_idea="Post-Quantum SCADA VPN on Raspberry Pi",
        candidate_project_id="proj-cyber-02-hardware",
    )
    res = perform_deterministic_reality_check(req, candidate)

    assert any(r["dimension"] == "Physical Hardware" for r in res.critical_risks)
    assert any("Raspberry Pi" in r["detail"] or "raspberry_pi" in r["detail"] for r in res.critical_risks)


def test_reality_check_ad_hoc_raw_idea():
    # Student types an idea without pre-selecting a catalog project
    student = make_student()
    req = RealityCheckRequest(
        student_profile=student,
        raw_project_idea="A novel smart decentralized ledger for campus parking",
    )
    res = perform_deterministic_reality_check(req, project=None)

    assert res.verdict in ("FEASIBLE", "HIGH_RISK_NEEDS_PIVOT")
    assert res.transformed_project_preview["original_proposal"] == req.raw_project_idea
    assert len(res.recommended_actions) > 0
