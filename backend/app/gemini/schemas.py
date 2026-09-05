from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from ..models.schemas import ComputeTier, StudentProfile, ConstraintEvaluationResult, ProjectEvaluationScorecard


class GeminiRealityAudit(BaseModel):
    """
    Structured Gemini analysis of technical risks, hidden assumptions, and defense weaknesses.
    """
    hidden_assumptions: List[str] = Field(
        default_factory=list,
        description="Assumptions student is making that rarely hold in university capstones (e.g. data access, timelines)"
    )
    technical_risks: List[str] = Field(
        default_factory=list,
        description="Core algorithmic, memory, or architectural failure points"
    )
    unrealistic_scope_aspects: List[str] = Field(
        default_factory=list,
        description="Components that exceed the available weeks or team capacity"
    )
    data_dependency_risks: List[str] = Field(
        default_factory=list,
        description="Bottlenecks related to clinical, proprietary, or unlabelled datasets"
    )
    compute_dependency_risks: List[str] = Field(
        default_factory=list,
        description="VRAM, training epoch time, or GPU architecture mismatches"
    )
    skill_gap_analysis: str = Field(
        ...,
        description="Concise evaluation of the team's prerequisite skills vs project difficulty"
    )
    academic_defense_weaknesses: List[str] = Field(
        default_factory=list,
        description="Specific grilling questions external examiners will exploit to fail this proposal"
    )


class VisualDiff(BaseModel):
    removed: List[str] = Field(default_factory=list, description="Impractical components completely removed")
    modified: List[str] = Field(default_factory=list, description="Heavy architectures scaled down to viable equivalents")
    added: List[str] = Field(default_factory=list, description="Novel twists, open benchmarks, or defensive mechanisms added")


class ChangeReason(BaseModel):
    change: str
    reason: str


class ReforgedProjectSpec(BaseModel):
    estimated_weeks: int = Field(..., ge=1, le=52)
    estimated_hours: int = Field(..., ge=1)
    estimated_cost_usd: float = Field(0.0, ge=0.0)
    compute_requirement: ComputeTier = ComputeTier.CPU_ONLY
    required_hardware: List[str] = Field(default_factory=list)
    required_skills: Dict[str, int] = Field(default_factory=dict)
    critical_skills: List[str] = Field(default_factory=list)
    risk_factors: List[str] = Field(default_factory=list)


class GeminiProjectReforge(BaseModel):
    """
    Structured Gemini Reforging output transforming an unrealistic/cliché idea into a viable capstone.
    """
    transformed_title: str = Field(..., min_length=5)
    concise_problem_statement: str
    proposed_solution: str
    unfair_twist: str = Field(..., description="The technically meaningful differentiator that wins marks")
    why_unfair_twist_is_defensible: str
    what_changed_summary: str
    visual_diff: VisualDiff
    why_each_change_was_necessary: List[ChangeReason] = Field(default_factory=list)
    core_features: List[str] = Field(default_factory=list)
    removed_features: List[str] = Field(default_factory=list)
    stretch_features: List[str] = Field(default_factory=list)
    research_angle: str
    evaluation_strategy: str
    implementation_strategy: str
    defense_strategy: str
    reforged_project_spec: ReforgedProjectSpec


class ReforgeResponse(BaseModel):
    gemini_status: str # "active" | "offline_fallback"
    model_used: Optional[str] = None
    audit: GeminiRealityAudit
    reforge: GeminiProjectReforge
    deterministic_feasibility_before: float
    deterministic_feasibility_after: float
    recalculated_scorecard: ProjectEvaluationScorecard
    explanation: str


class RefinementRequest(BaseModel):
    student_profile: StudentProfile
    current_reforge: GeminiProjectReforge
    refinement_instruction: str = Field(..., min_length=2, description="Natural language modifier (e.g. 'Make this easier', 'We only have 8 weeks')")


class RefinementResponse(BaseModel):
    gemini_status: str
    refinement_instruction_applied: str
    updated_reforge: GeminiProjectReforge
    recalculated_scorecard: ProjectEvaluationScorecard
    explanation: str
