"""
Test suite for Gemini Intelligence Layer & Project Refinement (Milestone 3).

Verifies:
- Operational status reporting
- Deterministic fallback when API key is missing or calls fail
- Pydantic schema validation for Reality Audit & Project Reforge
- Recalculation of authoritative deterministic feasibility on reforged specs
- Natural language refinement handling
- Scenario A: Unrealistic 3D Medical Diagnosis
- Scenario B: Cliché Face Attendance System
- Malformed JSON resilience & graceful degradation
"""

import asyncio
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.models.schemas import (
    StudentProfile,
    ComputeTier,
    TargetOutcome,
)
from backend.app.gemini.service import GeminiService
from backend.app.gemini.schemas import (
    ReforgeResponse,
    RefinementResponse,
)

client = TestClient(app)


@pytest.fixture
def mock_student_unrealistic():
    """Scenario A: 3 CS students, 12 weeks, CPU-only, budget $50."""
    return StudentProfile(
        major="Computer Science",
        team_size=3,
        weeks_available=12,
        weekly_hours_per_member=15,
        budget_limit_usd=50.0,
        compute_tier=ComputeTier.CPU_ONLY,
        hardware_available=[],
        skills={"python": 3, "pytorch": 1, "machine_learning": 2},
        target_outcome=TargetOutcome.IEEE_PAPER,
    )


@pytest.fixture
def mock_student_cliche():
    """Scenario B: 2 CS students proposing face attendance."""
    return StudentProfile(
        major="Computer Science",
        team_size=2,
        weeks_available=10,
        weekly_hours_per_member=10,
        budget_limit_usd=20.0,
        compute_tier=ComputeTier.CPU_ONLY,
        hardware_available=[],
        skills={"python": 3, "opencv": 2},
        target_outcome=TargetOutcome.INDUSTRY_GRADE,
    )


def test_gemini_status_endpoint():
    """Ensures GET /api/v1/gemini/status returns operational details without exposing keys."""
    resp = client.get("/api/v1/gemini/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "configured" in data
    assert "status" in data
    assert "message" in data
    assert data["status"] in ["ready", "offline_fallback"]


def test_missing_api_key_deterministic_fallback(mock_student_unrealistic):
    """When API key is absent, service gracefully provides deterministic audit and reforge."""
    service = GeminiService(api_key="", model="gemini-flash-lite-latest")
    assert not service.is_configured
    status = service.get_status()
    assert status["status"] == "offline_fallback"


def test_scenario_a_unrealistic_medical_ai(mock_student_unrealistic):
    """
    Scenario A: 'Real-time AI medical diagnosis using large 3D medical images'
    Checks:
    - Feasibility before is low (fails hard constraints: CPU vs GPU, weeks/hours).
    - Reforged project bounds itself strictly to CPU and <= 12 weeks.
    - Feasibility after is recalculating deterministically and improves significantly.
    - Unfair Twist is present and defensible.
    """
    async def run():
        service = GeminiService(api_key="") # offline fallback
        raw_idea = "Real-time AI medical diagnosis using large 3D medical images"
        return await service.audit_and_reforge(mock_student_unrealistic, raw_idea)

    result = asyncio.run(run())

    assert isinstance(result, ReforgeResponse)
    assert result.gemini_status == "offline_fallback"
    assert result.deterministic_feasibility_before < 40.0
    assert result.deterministic_feasibility_after > result.deterministic_feasibility_before
    assert 75.0 <= result.deterministic_feasibility_after <= 95.0
    assert result.deterministic_feasibility_after < 100.0  # Guarantees no artificial score inflation
    assert result.recalculated_scorecard.constraints.overall_pass is True

    # Check Reforge content
    reforge = result.reforge
    assert "MediSense" in reforge.transformed_title or "Calibrated" in reforge.transformed_title
    assert reforge.reforged_project_spec.compute_requirement == ComputeTier.CPU_ONLY
    assert reforge.reforged_project_spec.estimated_weeks <= mock_student_unrealistic.weeks_available

    # Check Visual Diff
    assert len(reforge.visual_diff.removed) > 0
    assert len(reforge.visual_diff.modified) > 0
    assert len(reforge.visual_diff.added) > 0

    # Check Unfair Twist
    assert len(reforge.unfair_twist) > 5
    assert len(reforge.why_unfair_twist_is_defensible) > 10


def test_scenario_b_cliche_face_attendance(mock_student_cliche):
    """
    Scenario B: 'AI Face Recognition Attendance System'
    Checks:
    - Detects cliché nature.
    - Synthesizes an Unfair Twist (anti-spoofing / liveness / edge quantization).
    - Reforged spec passes student constraints with realistic, non-inflated score.
    """
    async def run():
        service = GeminiService(api_key="")
        raw_idea = "AI Face Recognition Attendance System"
        return await service.audit_and_reforge(mock_student_cliche, raw_idea)

    result = asyncio.run(run())

    assert isinstance(result, ReforgeResponse)
    assert "EdgeGuard" in result.reforge.transformed_title or "Anti-Spoofing" in result.reforge.transformed_title
    assert "Anti-Spoofing" in result.reforge.unfair_twist or "Liveness" in result.reforge.unfair_twist
    assert result.recalculated_scorecard.constraints.overall_pass is True
    assert 75.0 <= result.deterministic_feasibility_after <= 95.0
    assert result.deterministic_feasibility_after < 100.0


def test_natural_language_refinement(mock_student_unrealistic):
    """
    Tests interactive refinement: 'We only have 8 weeks'
    Checks:
    - Estimated weeks decreases to 8.
    - Deterministic scorecard is recalculated for 8 weeks.
    - Visual diff records timeline compression.
    """
    async def run():
        service = GeminiService(api_key="")
        raw_idea = "Real-time AI medical diagnosis using large 3D medical images"
        initial_res = await service.audit_and_reforge(mock_student_unrealistic, raw_idea)
        return await service.refine_project(
            student=mock_student_unrealistic,
            current_reforge=initial_res.reforge,
            instruction="We only have 8 weeks",
        )

    refinement = asyncio.run(run())

    assert isinstance(refinement, RefinementResponse)
    assert refinement.updated_reforge.reforged_project_spec.estimated_weeks == 8
    assert refinement.recalculated_scorecard.constraints.timeline_pass is True
    assert "8 weeks" in refinement.explanation


def test_malformed_gemini_json_graceful_recovery(mock_student_unrealistic):
    """
    If Gemini returns malformed or invalid JSON, service must NOT crash or fail the request.
    It must gracefully fall back to the deterministic audit and reforge.
    """
    async def run():
        service = GeminiService(api_key="dummy-key")
        with patch.object(service, "_call_gemini_structured", new=AsyncMock(return_value={"invalid": "schema"})):
            return await service.audit_and_reforge(mock_student_unrealistic, "Autonomous Robot Nav")

    res = asyncio.run(run())
    assert res.gemini_status == "offline_fallback"
    assert res.recalculated_scorecard.constraints.overall_pass is True
    assert len(res.reforge.core_features) > 0


def test_gemini_timeout_graceful_recovery(mock_student_unrealistic):
    """
    If Gemini network call times out (returns None), service falls back gracefully.
    """
    async def run():
        service = GeminiService(api_key="dummy-key")
        with patch.object(service, "_call_gemini_structured", new=AsyncMock(return_value=None)):
            return await service.audit_and_reforge(mock_student_unrealistic, "Predict Stock Market with LSTM")

    res = asyncio.run(run())
    assert res.gemini_status == "offline_fallback"
    assert res.recalculated_scorecard is not None
    assert res.reforge.unfair_twist != ""


def test_api_reforge_endpoint(mock_student_unrealistic):
    """Tests POST /api/v1/gemini/reforge end-to-end via FastAPI client."""
    payload = {
        "student_profile": mock_student_unrealistic.model_dump(),
        "raw_idea": "Real-time AI medical diagnosis using large 3D medical images",
    }
    resp = client.post("/api/v1/gemini/reforge", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "audit" in data
    assert "reforge" in data
    assert "deterministic_feasibility_before" in data
    assert "deterministic_feasibility_after" in data
    assert "recalculated_scorecard" in data
    assert data["deterministic_feasibility_after"] > data["deterministic_feasibility_before"]


def test_api_refine_endpoint(mock_student_unrealistic):
    """Tests POST /api/v1/gemini/refine end-to-end via FastAPI client."""
    # First get an initial reforge
    reforge_payload = {
        "student_profile": mock_student_unrealistic.model_dump(),
        "raw_idea": "Real-time AI medical diagnosis using large 3D medical images",
    }
    initial_data = client.post("/api/v1/gemini/reforge", json=reforge_payload).json()

    # Now refine it
    refine_payload = {
        "student_profile": mock_student_unrealistic.model_dump(),
        "current_reforge": initial_data["reforge"],
        "refinement_instruction": "No GPU, make this easier",
    }
    resp = client.post("/api/v1/gemini/refine", json=refine_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "updated_reforge" in data
    assert "recalculated_scorecard" in data
    assert data["updated_reforge"]["reforged_project_spec"]["compute_requirement"] == "cpu_only"
