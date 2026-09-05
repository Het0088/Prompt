from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

SAMPLE_STUDENT = {
    "major": "Computer Science",
    "team_size": 3,
    "weeks_available": 14,
    "weekly_hours_per_member": 15,
    "budget_limit_usd": 50.0,
    "compute_tier": "local_gpu",
    "hardware_available": ["esp32"],
    "skills": {
        "python": 4,
        "pytorch": 3,
        "machine_learning": 3,
        "react": 3,
        "javascript": 3,
    },
    "target_outcome": "ieee_paper",
}


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["seed_projects_count"] >= 10


def test_list_projects_and_filters():
    # Unfiltered
    res_all = client.get("/api/v1/projects")
    assert res_all.status_code == 200
    all_projects = res_all.json()
    assert len(all_projects) >= 10

    # Domain filter
    res_ai = client.get("/api/v1/projects?domain=AI")
    assert res_ai.status_code == 200
    ai_projects = res_ai.json()
    assert len(ai_projects) >= 1
    assert all("ai" in p["domain"].lower() for p in ai_projects)

    # Difficulty filter
    res_adv = client.get("/api/v1/projects?difficulty=advanced")
    assert res_adv.status_code == 200
    adv_projects = res_adv.json()
    assert len(adv_projects) >= 1
    assert all(p["difficulty"] == "advanced" for p in adv_projects)


def test_get_project_by_id():
    res = client.get("/api/v1/projects/proj-aiml-01")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "proj-aiml-01"

    # Nonexistent
    res_404 = client.get("/api/v1/projects/nonexistent-xyz")
    assert res_404.status_code == 404


def test_evaluate_project_endpoint():
    payload = {
        "student_profile": SAMPLE_STUDENT,
        "project_id": "proj-aiml-01",
    }
    response = client.post("/api/v1/evaluate-project", json=payload)
    assert response.status_code == 200
    scorecard = response.json()

    assert scorecard["project_id"] == "proj-aiml-01"
    assert "feasibility_score" in scorecard
    assert "composite_rank_score" in scorecard
    assert "score_breakdown_explanation" in scorecard
    assert scorecard["constraints"]["overall_pass"] is True


def test_rank_projects_endpoint():
    payload = {
        "student_profile": SAMPLE_STUDENT,
        "filter_hard_failures": False,
    }
    response = client.post("/api/v1/rank-projects", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["total_evaluated"] >= 10
    assert len(data["ranked_scorecards"]) >= 10

    # Verify descending sort order by composite_rank_score
    scores = [c["composite_rank_score"] for c in data["ranked_scorecards"]]
    assert scores == sorted(scores, reverse=True)


def test_rank_projects_with_filter_hard_failures():
    payload = {
        "student_profile": SAMPLE_STUDENT,
        "filter_hard_failures": True,
    }
    response = client.post("/api/v1/rank-projects", json=payload)
    assert response.status_code == 200
    data = response.json()

    # All returned cards must pass constraints
    for card in data["ranked_scorecards"]:
        assert card["constraints"]["overall_pass"] is True


def test_reality_check_endpoint():
    payload = {
        "student_profile": SAMPLE_STUDENT,
        "raw_project_idea": "I want to build an ICU patient vital signs predictor with federated learning",
        "candidate_project_id": "proj-aiml-01",
    }
    response = client.post("/api/v1/reality-check", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["verdict"] in ("FEASIBLE", "HIGH_RISK_NEEDS_PIVOT", "UNREALISTIC_REJECT")
    assert "overall_feasibility" in data
    assert "critical_risks" in data
    assert "transformed_project_preview" in data
    assert "explanation" in data


def test_validation_error_on_invalid_student():
    bad_payload = {
        "student_profile": {
            "major": "", # invalid min length
            "team_size": 0, # invalid ge=1
            "weeks_available": -5, # invalid
            "weekly_hours_per_member": 0,
        },
        "project_id": "proj-aiml-01",
    }
    response = client.post("/api/v1/evaluate-project", json=bad_payload)
    assert response.status_code == 422
