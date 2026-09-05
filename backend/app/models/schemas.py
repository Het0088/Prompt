from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, field_validator, model_validator


class ComputeTier(str, Enum):
    CPU_ONLY = "cpu_only"
    COLAB_FREE = "colab_free"
    LOCAL_GPU = "local_gpu"
    CLOUD_GPU = "cloud_gpu"


# Numerical rank for hierarchy comparison (higher is more capable)
COMPUTE_TIER_RANK: Dict[ComputeTier, int] = {
    ComputeTier.CPU_ONLY: 1,
    ComputeTier.COLAB_FREE: 2,
    ComputeTier.LOCAL_GPU: 3,
    ComputeTier.CLOUD_GPU: 4,
}


class TargetOutcome(str, Enum):
    IEEE_PAPER = "ieee_paper"
    STARTUP_MVP = "startup_mvp"
    INDUSTRY_GRADE = "industry_grade"
    SOCIAL_GOOD = "social_good"


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class StudentProfile(BaseModel):
    major: str = Field(..., min_length=2, description="Major/Branch of study")
    team_size: int = Field(..., ge=1, le=10, description="Number of team members")
    weeks_available: int = Field(..., ge=1, le=52, description="Total academic weeks available")
    weekly_hours_per_member: int = Field(..., ge=1, le=80, description="Estimated weekly hours per person")
    budget_limit_usd: float = Field(0.0, ge=0.0, description="Available financial budget in USD")
    compute_tier: ComputeTier = Field(ComputeTier.CPU_ONLY, description="Available compute infrastructure")
    hardware_available: List[str] = Field(default_factory=list, description="List of physical hardware/chips available")
    skills: Dict[str, int] = Field(default_factory=dict, description="Skill name to self-rated proficiency (1-5)")
    target_outcome: TargetOutcome = Field(TargetOutcome.INDUSTRY_GRADE, description="Target capstone outcome")

    @field_validator("skills")
    @classmethod
    def validate_skill_levels(cls, v: Dict[str, int]) -> Dict[str, int]:
        sanitized = {}
        for skill_name, level in v.items():
            clean_name = skill_name.strip().lower()
            if not clean_name:
                continue
            if not (1 <= level <= 5):
                raise ValueError(f"Skill proficiency for '{skill_name}' must be between 1 and 5, got {level}")
            sanitized[clean_name] = level
        return sanitized

    @property
    def total_available_hours(self) -> int:
        """Deterministic calculation of total team hours available across the timeline."""
        return self.weeks_available * self.team_size * self.weekly_hours_per_member


class Project(BaseModel):
    id: str = Field(..., min_length=1)
    title: str = Field(..., min_length=2)
    domain: str
    difficulty: DifficultyLevel = DifficultyLevel.INTERMEDIATE
    estimated_weeks: int = Field(..., ge=1)
    estimated_hours: int = Field(..., ge=1)
    estimated_cost_usd: float = Field(0.0, ge=0.0)
    compute_requirement: ComputeTier = ComputeTier.CPU_ONLY
    required_hardware: List[str] = Field(default_factory=list)
    required_skills: Dict[str, int] = Field(default_factory=dict, description="Required skills and proficiency (1-5)")
    critical_skills: List[str] = Field(default_factory=list, description="Skills that trigger hard FAIL if missing")
    target_outcomes: List[TargetOutcome] = Field(default_factory=list)
    novelty_baseline: float = Field(70.0, ge=0.0, le=100.0, description="Baseline novelty index (0-100)")
    risk_factors: List[str] = Field(default_factory=list)
    description: str = ""

    @field_validator("required_skills")
    @classmethod
    def sanitize_required_skills(cls, v: Dict[str, int]) -> Dict[str, int]:
        sanitized = {}
        for skill_name, level in v.items():
            clean_name = skill_name.strip().lower()
            if not clean_name:
                continue
            if level <= 0:
                continue
            sanitized[clean_name] = min(5, max(1, int(level)))
        return sanitized

    @field_validator("critical_skills")
    @classmethod
    def sanitize_critical_skills(cls, v: List[str]) -> List[str]:
        return [s.strip().lower() for s in v if s.strip()]


class ConstraintEvaluationResult(BaseModel):
    overall_pass: bool
    timeline_pass: bool
    budget_pass: bool
    compute_pass: bool
    hardware_pass: bool
    critical_skills_pass: bool
    details: Dict[str, str] = Field(default_factory=dict)
    violations: List[str] = Field(default_factory=list)


class SkillMatchResult(BaseModel):
    skill_match_score: float = Field(..., ge=0.0, le=100.0)
    satisfied_skills: List[str] = Field(default_factory=list)
    partial_matches: Dict[str, Dict[str, int]] = Field(default_factory=dict) # skill -> {'have': x, 'need': y}
    missing_skills: List[str] = Field(default_factory=list)
    total_skill_gap: int = Field(0, ge=0)
    learning_burden: str # "None", "Low", "Moderate", "High", "Critical"


class ScoreWeights(BaseModel):
    feasibility: float = 0.30
    skill_match: float = 0.25
    novelty: float = 0.20
    time_fit: float = 0.15
    target_outcome_fit: float = 0.10

    @model_validator(mode="after")
    def validate_weights_sum(self) -> "ScoreWeights":
        total = round(self.feasibility + self.skill_match + self.novelty + self.time_fit + self.target_outcome_fit, 4)
        if total != 1.0:
            raise ValueError(f"Score weights must sum to 1.0, got {total}")
        return self


class ProjectEvaluationScorecard(BaseModel):
    project_id: str
    project_title: str
    constraints: ConstraintEvaluationResult
    skills: SkillMatchResult
    feasibility_score: float = Field(..., ge=0.0, le=100.0)
    time_fit_score: float = Field(..., ge=0.0, le=100.0)
    resource_fit_score: float = Field(..., ge=0.0, le=100.0)
    risk_score: float = Field(..., ge=0.0, le=100.0)
    novelty_score: float = Field(..., ge=0.0, le=100.0)
    target_outcome_fit_score: float = Field(..., ge=0.0, le=100.0)
    composite_rank_score: float = Field(..., ge=0.0, le=100.0)
    score_breakdown_explanation: Dict[str, str] = Field(default_factory=dict)


class RealityCheckRequest(BaseModel):
    student_profile: StudentProfile
    raw_project_idea: str = Field(..., min_length=3, description="Student's raw idea text")
    candidate_project_id: Optional[str] = None


class RealityCheckResponse(BaseModel):
    verdict: str # "FEASIBLE", "HIGH_RISK_NEEDS_PIVOT", "UNREALISTIC_REJECT"
    overall_feasibility: float = Field(..., ge=0.0, le=100.0)
    constraints_assessment: ConstraintEvaluationResult
    skill_gap_summary: SkillMatchResult
    critical_risks: List[Dict[str, str]] = Field(default_factory=list)
    resource_issues: List[str] = Field(default_factory=list)
    timeline_issues: List[str] = Field(default_factory=list)
    scope_risk_level: str # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    recommended_actions: List[str] = Field(default_factory=list)
    transformed_project_preview: Optional[Dict[str, Any]] = None
    explanation: str
