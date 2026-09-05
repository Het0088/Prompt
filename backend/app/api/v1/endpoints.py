from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from ...models.schemas import (
    StudentProfile,
    Project,
    ScoreWeights,
    ProjectEvaluationScorecard,
    RealityCheckRequest,
    RealityCheckResponse,
)
from ...gemini.schemas import ReforgeResponse, RefinementRequest, RefinementResponse
from ...gemini.service import gemini_service
from ...core.scoring import evaluate_project
from ...core.reality_check import perform_deterministic_reality_check
from ...data.seed_projects import get_all_seed_projects, get_seed_project_by_id

router = APIRouter(prefix="/v1", tags=["Deterministic Engine & Gemini AI"])


class EvaluateProjectRequest(BaseModel):
    student_profile: StudentProfile
    project: Optional[Project] = None
    project_id: Optional[str] = None
    weights: Optional[ScoreWeights] = None


class RankProjectsRequest(BaseModel):
    student_profile: StudentProfile
    candidate_projects: Optional[List[Project]] = None
    weights: Optional[ScoreWeights] = None
    filter_hard_failures: bool = Field(
        default=False,
        description="If True, projects that violate hard constraints are excluded from the output",
    )


class RankProjectsResponse(BaseModel):
    total_evaluated: int
    passed_constraints_count: int
    ranked_scorecards: List[ProjectEvaluationScorecard]


@router.get("/projects", response_model=List[Project])
def list_projects(
    domain: Optional[str] = Query(None, description="Filter projects by domain substring"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level"),
):
    """
    Returns curated seed projects used for engine validation and demonstration.
    """
    projects = get_all_seed_projects()
    if domain:
        clean_d = domain.strip().lower()
        projects = [p for p in projects if clean_d in p.domain.lower()]
    if difficulty:
        clean_diff = difficulty.strip().lower()
        projects = [p for p in projects if p.difficulty.value == clean_diff]
    return projects


@router.get("/projects/{project_id}", response_model=Project)
def get_project(project_id: str):
    """
    Returns a single project by ID.
    """
    proj = get_seed_project_by_id(project_id)
    if not proj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found in registry.",
        )
    return proj


@router.post("/evaluate-project", response_model=ProjectEvaluationScorecard)
def api_evaluate_project(payload: EvaluateProjectRequest):
    """
    Evaluates a single project against student constraints and skill profile.
    Returns a complete deterministic scorecard with Feasibility, Skill Match, Risk, and Composite Rank.
    """
    target_project = payload.project
    if target_project is None and payload.project_id:
        target_project = get_seed_project_by_id(payload.project_id)
        if not target_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project ID '{payload.project_id}' not found in registry.",
            )

    if target_project is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'project' object or valid 'project_id' must be provided in request payload.",
        )

    scorecard = evaluate_project(
        student=payload.student_profile,
        project=target_project,
        weights=payload.weights,
    )
    return scorecard


@router.post("/rank-projects", response_model=RankProjectsResponse)
def api_rank_projects(payload: RankProjectsRequest):
    """
    Ranks multiple candidate projects against a student profile.
    Applies deterministic scoring and sorts by Composite Rank Score descending.
    """
    pool = payload.candidate_projects if payload.candidate_projects is not None else get_all_seed_projects()
    if not pool:
        return RankProjectsResponse(
            total_evaluated=0,
            passed_constraints_count=0,
            ranked_scorecards=[],
        )

    scorecards: List[ProjectEvaluationScorecard] = []
    passed_count = 0

    for proj in pool:
        card = evaluate_project(
            student=payload.student_profile,
            project=proj,
            weights=payload.weights,
        )
        if card.constraints.overall_pass:
            passed_count += 1

        if payload.filter_hard_failures and not card.constraints.overall_pass:
            continue

        scorecards.append(card)

    # Sort descending by composite_rank_score
    scorecards.sort(key=lambda c: c.composite_rank_score, reverse=True)

    return RankProjectsResponse(
        total_evaluated=len(pool),
        passed_constraints_count=passed_count,
        ranked_scorecards=scorecards,
    )


@router.post("/reality-check", response_model=RealityCheckResponse)
def api_reality_check(payload: RealityCheckRequest):
    """
    Executes the Project Reality Check on a student's proposal.
    Audits constraints, detects critical risks (compute, timeline, skills, budget),
    and delivers deterministic verdicts and actionable scope pivots.
    """
    candidate_proj: Optional[Project] = None
    if payload.candidate_project_id:
        candidate_proj = get_seed_project_by_id(payload.candidate_project_id)

    response = perform_deterministic_reality_check(
        request=payload,
        project=candidate_proj,
    )
    return response


class GeminiReforgeRequest(BaseModel):
    student_profile: StudentProfile
    raw_idea: str = Field(..., min_length=3, description="Student raw project idea or proposal")


@router.get("/gemini/status")
def api_gemini_status():
    """
    Returns the operational status of the Google Gemini AI layer.
    """
    return gemini_service.get_status()


@router.post("/gemini/reforge", response_model=ReforgeResponse)
async def api_gemini_reforge(payload: GeminiReforgeRequest):
    """
    Executes Gemini Reality Audit, Unfair Twist synthesis, and project reforging.
    Falls back gracefully to deterministic constraint analysis if Gemini is unavailable.
    Authoritative deterministic scoring is recalculated for the reforged project.
    """
    return await gemini_service.audit_and_reforge(
        student=payload.student_profile,
        raw_idea=payload.raw_idea,
    )


@router.post("/gemini/refine", response_model=RefinementResponse)
async def api_gemini_refine(payload: RefinementRequest):
    """
    Applies a natural language constraint or enhancement modifier to an existing reforged project.
    Recalculates deterministic scores and returns updated project specification.
    """
    return await gemini_service.refine_project(
        student=payload.student_profile,
        current_reforge=payload.current_reforge,
        instruction=payload.refinement_instruction,
    )
