import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.models.schemas import StudentProfile, ComputeTier
from backend.app.core.reality_check import perform_deterministic_reality_check, RealityCheckRequest
from backend.app.gemini.service import GeminiService
from backend.app.gemini.schemas import ReforgeResponse, GeminiProjectReforge, VisualDiff, ReforgedProjectSpec

client = TestClient(app)

@pytest.fixture
def flagship_demo_student():
    return StudentProfile(
        major="Computer Science",
        team_size=3,
        weeks_available=12,
        weekly_hours_per_member=15,
        budget_limit_usd=0.0,
        compute_tier=ComputeTier.CPU_ONLY,
        hardware_available=[],
        skills={"python": 3, "machine_learning": 2},
        target_outcome="ieee_paper",
    )

def test_flagship_demo_scenario_a_full_lifecycle(flagship_demo_student):
    """
    End-to-End Test for the 90-Second Flagship Stage Pitch Demo:
    1. Unrealistic Proposal (3D Volumetric Medical Imaging on CPU)
    2. Deterministic Reality Check triggers UNREALISTIC_REJECT (Feasibility < 45)
    3. Gemini Reforge transforms scope into 2D Calibrated Triage
    4. Deterministic Recalculation verifies Feasibility >= 85 (PASS)
    5. Natural language refinement verifies timeline contraction to 8 weeks
    """
    raw_unrealistic_idea = "Real-time AI medical diagnosis using large 3D medical images with custom volumetric UNet"
    
    # 1. Reality Check Execution
    rc_req = RealityCheckRequest(
        student_profile=flagship_demo_student,
        raw_project_idea=raw_unrealistic_idea,
    )
    rc_res = perform_deterministic_reality_check(rc_req)
    
    # Verify deterministic failure
    assert rc_res.verdict == "UNREALISTIC_REJECT"
    assert rc_res.overall_feasibility <= 45.0
    assert not rc_res.constraints_assessment.overall_pass
    assert not rc_res.constraints_assessment.compute_pass
    assert len(rc_res.critical_risks) >= 1
    
    # 2. Reforge via Gemini Service (using deterministic fallback/active model)
    gemini_svc = GeminiService(api_key="")
    reforge_result = pytest.importorskip("asyncio").run(
        gemini_svc.audit_and_reforge(student=flagship_demo_student, raw_idea=raw_unrealistic_idea)
    )
    
    assert reforge_result.reforge.transformed_title is not None
    assert len(reforge_result.reforge.unfair_twist) > 10
    assert reforge_result.deterministic_feasibility_before <= 45.0
    assert reforge_result.deterministic_feasibility_after >= 80.0
    assert reforge_result.recalculated_scorecard.constraints.overall_pass is True
    
    # 3. Refinement: "We only have 8 weeks"
    refine_result = pytest.importorskip("asyncio").run(
        gemini_svc.refine_project(
            student=flagship_demo_student,
            current_reforge=reforge_result.reforge,
            instruction="We only have 8 weeks and no cloud budget"
        )
    )
    
    assert refine_result.gemini_status in ["active", "offline_fallback"]
    assert refine_result.updated_reforge.reforged_project_spec.estimated_weeks <= 8
    assert refine_result.recalculated_scorecard.constraints.timeline_pass is True
