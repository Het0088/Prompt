"""
Gemini Intelligence Service for ForgeGrad AI.
Provides structured AI Reality Audit, Project Reforging with Unfair Twist,
and Natural Language Project Refinement.

Security & Architectural Guarantees:
- Never exposes API keys to browser or client.
- Loads API key strictly from environment variables or .env.
- Passes API key in x-goog-api-key header to prevent URL leaks.
- Treats user inputs as untrusted data.
- Enforces strict Pydantic schema validation on all LLM responses.
- Deterministic math remains authoritative: scores are always recalculated.
- Falls back to deterministic analysis when Gemini is unavailable.
"""

import os
import json
import re
import logging
from typing import Optional, Dict, Any, Tuple
import httpx
from pydantic import ValidationError

from .schemas import (
    GeminiRealityAudit,
    GeminiProjectReforge,
    ReforgeResponse,
    RefinementResponse,
    VisualDiff,
    ChangeReason,
    ReforgedProjectSpec,
)
from .prompts import (
    AUDIT_AND_REFORGE_SYSTEM_INSTRUCTION,
    build_audit_and_reforge_prompt,
    REFINEMENT_SYSTEM_INSTRUCTION,
    build_refinement_prompt,
)
from ..models.schemas import (
    StudentProfile,
    Project,
    ComputeTier,
    DifficultyLevel,
    RealityCheckRequest,
    RealityCheckResponse,
    ProjectEvaluationScorecard,
)
from ..core.reality_check import perform_deterministic_reality_check
from ..core.scoring import evaluate_project

logger = logging.getLogger("forgegrad.gemini")

# Try to load .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"


class GeminiService:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY", "").strip()
        self.model = model or os.environ.get("GEMINI_MODEL", DEFAULT_GEMINI_MODEL).strip()
        self.is_configured = bool(self.api_key and len(self.api_key) > 5)

    def get_status(self) -> Dict[str, Any]:
        """Returns the current operational status of the Gemini service without exposing keys."""
        return {
            "configured": self.is_configured,
            "model": self.model if self.is_configured else None,
            "status": "ready" if self.is_configured else "offline_fallback",
            "message": (
                f"Gemini AI intelligence active ({self.model})"
                if self.is_configured
                else "Gemini API key not configured. Using deterministic fallback engine."
            ),
        }

    async def _call_gemini_structured(
        self,
        system_instruction: str,
        user_prompt: str,
        temperature: float = 0.3,
    ) -> Optional[Dict[str, Any]]:
        """
        Makes a secure, server-side HTTP POST request to Google Gemini API.
        Requests responseMimeType: "application/json".
        API key is passed via header to prevent URL leaks.
        """
        if not self.is_configured:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key,
        }
        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_prompt}]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": temperature,
                "maxOutputTokens": 4096,
            }
        }

        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code != 200:
                    logger.warning(f"Gemini API returned status {response.status_code}: {response.text[:200]}")
                    return None

                data = response.json()
                candidates = data.get("candidates", [])
                if not candidates:
                    return None

                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts:
                    return None

                raw_text = parts[0].get("text", "").strip()

                # Clean any occasional markdown fence wrapping
                if raw_text.startswith("```"):
                    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
                    raw_text = re.sub(r"\s*```$", "", raw_text)

                return json.loads(raw_text)

        except Exception as e:
            logger.error(f"Gemini call exception: {type(e).__name__}")
            return None

    def _build_deterministic_fallback(
        self,
        student: StudentProfile,
        raw_idea: str,
        rc_res: RealityCheckResponse,
    ) -> Tuple[GeminiRealityAudit, GeminiProjectReforge]:
        """
        High-fidelity deterministic fallback when Gemini API is offline or unreachable.
        Adheres to student boundaries and synthesizes an authentic Unfair Twist.
        """
        risk_list = [r.get("detail", "") if isinstance(r, dict) else getattr(r, "detail", "") for r in rc_res.critical_risks]
        title = raw_idea[:40].strip() or "Undergraduate Capstone Project"
        total_hours = student.total_available_hours

        audit = GeminiRealityAudit(
            hidden_assumptions=[
                "Assumes high-quality, pre-labeled ground-truth datasets are freely downloadable without institutional IRB or clinical approval.",
                "Assumes real-time throughput can be achieved on consumer hardware without quantization or pruning.",
                "Assumes full team members will maintain peak velocity without final-year exam or placement interruptions."
            ],
            technical_risks=risk_list or [
                "Unbounded memory usage and high inference latency on target deployment hardware.",
                "Overfitting on small, non-representative test distributions.",
                "Absence of rigorous baseline models to prove non-trivial performance gains."
            ],
            unrealistic_scope_aspects=[
                f"Timeline and resource mismatch: {'; '.join(rc_res.timeline_issues or ['Scope exceeds undergraduate milestone bandwidth'])}",
                f"Infrastructure barrier: {'; '.join(rc_res.resource_issues or ['Requires compute hardware beyond student profile'])}"
            ],
            data_dependency_risks=[
                "High dependency on external API availability or uncurated open-source repositories.",
                "No data augmentation or synthetic dataset generation pipeline planned."
            ],
            compute_dependency_risks=[
                f"Student hardware is '{student.compute_tier.value}', which cannot support heavy uncompressed models."
            ],
            skill_gap_analysis=(
                f"The team needs to bridge foundational gaps in deployment, benchmarking, and error analysis "
                f"to make this proposal viable within {student.weeks_available} weeks."
            ),
            academic_defense_weaknesses=[
                "Examiner: 'What is the novel scientific contribution beyond following a public GitHub tutorial or HuggingFace pipeline?'",
                "Examiner: 'How did you benchmark statistical significance versus a naive heuristic baseline?'",
                "Examiner: 'What happens when input data suffers from domain shift or adversarial noise?'"
            ]
        )

        # Build Unfair Twist depending on keyword context
        raw_lower = raw_idea.lower()
        if "face" in raw_lower or "attendance" in raw_lower:
            unfair_twist = "Adversarial Anti-Spoofing & Quantized Edge Liveness Verification"
            twist_why = (
                "Standard attendance apps are trivially bypassed using printed photos or phone replays. "
                "Adding light reflection analysis and frequency-domain spoof detection makes this a defense-grade security project."
            )
            reforged_title = "EdgeGuard: Anti-Spoofing Facial Biometrics with Pareto-Optimal Edge Quantization"
        elif "medical" in raw_lower or "cancer" in raw_lower or "disease" in raw_lower:
            unfair_twist = "Uncertainty-Calibrated 2D Patch Ensembling with Explainable Grad-CAM Discrepancy"
            twist_why = (
                "External examiners fail unverified medical diagnostic claims. Grounding the system in expected calibration error (ECE) "
                "and visual saliency consensus transforms an unfeasible claim into a rigorous decision-support research study."
            )
            reforged_title = "MediSense: Calibrated Uncertainty & Explainable Diagnostic Decision Support"
        else:
            unfair_twist = "Pareto Latency-Accuracy Optimization with Fault-Tolerant Edge Fallback"
            twist_why = (
                "Moves project from a generic demonstration to a rigorous engineering trade-off analysis that impresses academic examiners."
            )
            reforged_title = f"OptiSys: Resource-Constrained Optimization of {title}"

        # Bound reforged spec strictly to student boundaries
        safe_weeks = min(student.weeks_available, 12)
        safe_hours = max(40, int(total_hours * 0.70))  # 70% utilization to leave margin
        safe_cost = min(student.budget_limit_usd, 25.0)

        # Ensure required skills match what student has or can reasonably acquire
        safe_skills = {}
        for s_name, s_level in student.skills.items():
            safe_skills[s_name] = s_level
        if not safe_skills:
            safe_skills = {"python": 3}

        reforged_spec = ReforgedProjectSpec(
            estimated_weeks=safe_weeks,
            estimated_hours=safe_hours,
            estimated_cost_usd=safe_cost,
            compute_requirement=student.compute_tier,
            required_hardware=[],
            required_skills=safe_skills,
            critical_skills=[list(safe_skills.keys())[0]],
            risk_factors=[
                "Maintaining model calibration under data distribution shift",
                "Validation latency on target hardware"
            ]
        )

        reforge = GeminiProjectReforge(
            transformed_title=reforged_title,
            concise_problem_statement=(
                f"Undergraduate proposals for '{title}' typically suffer from intractable compute bottlenecks, "
                f"unrealistic data pipelines, and a lack of defensible scientific novelty."
            ),
            proposed_solution=(
                f"A scoped, resource-constrained architecture utilizing {unfair_twist.lower()} "
                f"that runs reliably on {student.compute_tier.value} within {safe_weeks} weeks."
            ),
            unfair_twist=unfair_twist,
            why_unfair_twist_is_defensible=twist_why,
            what_changed_summary=(
                "Removed full-scale end-to-end training and proprietary data dependencies; "
                "modified the core engine to use lightweight quantized backbones; added systematic Pareto benchmarks."
            ),
            visual_diff=VisualDiff(
                removed=[
                    "End-to-end training of multi-gigabyte models from scratch",
                    "Unvetted third-party cloud deployment dependencies",
                    "Over-ambitious multi-platform mobile integrations"
                ],
                modified=[
                    f"Architecture scaled down to run deterministically on {student.compute_tier.value}",
                    "Scope bounded from open-world deployment to standardized benchmark dataset evaluation",
                    f"Timeline compressed from unbounded weeks to {safe_weeks} structured milestone weeks"
                ],
                added=[
                    f"Novel differentiator: {unfair_twist}",
                    "Rigorous baseline comparison (Random Forest / ResNet-18 vs Optimized Model)",
                    "Examiner defense kit: statistical significance testing (t-test / McNemar's test)"
                ]
            ),
            why_each_change_was_necessary=[
                ChangeReason(
                    change="Replaced heavy training with pre-trained feature extraction",
                    reason=f"Student hardware is {student.compute_tier.value}, which cannot converge deep models in {safe_weeks} weeks."
                ),
                ChangeReason(
                    change="Added Pareto Latency vs Accuracy evaluation",
                    reason="Provides empirical graphs for the dissertation that examiners grade highest."
                )
            ],
            core_features=[
                "Lightweight inference engine running on local CPU/Edge",
                "Standardized dataset ingestion and automated preprocessing pipeline",
                "Quantitative ablation study comparing baseline vs proposed twist",
                "Interactive evaluation dashboard showing confidence metrics"
            ],
            removed_features=[
                "Real-time video streaming cloud ingestion",
                "Complex distributed multi-GPU training scripts",
                "Unvalidated proprietary user database"
            ],
            stretch_features=[
                "ONNX Runtime INT8 quantization for 2.5x CPU speedup",
                "Dockerized container for single-command evaluation by viva examiners"
            ],
            research_angle="Empirical benchmarking of trade-offs between model quantization, latency, and predictive reliability in resource-constrained environments.",
            evaluation_strategy="Ablation study over standard public benchmarks measuring Accuracy, F1, Expected Calibration Error (ECE), and P95 Inference Latency (ms).",
            implementation_strategy="Phase 1: Dataset & Baseline setup (W1-3); Phase 2: Core implementation & Unfair Twist integration (W4-7); Phase 3: Benchmarking & Defense preparation (W8-12).",
            defense_strategy="Pivot viva examiner questions away from raw model accuracy toward rigorous ablation experiments, error bounds, and deployment feasibility.",
            reforged_project_spec=reforged_spec
        )

        return audit, reforge

    async def audit_and_reforge(
        self,
        student: StudentProfile,
        raw_idea: str,
    ) -> ReforgeResponse:
        """
        Main intelligence pipeline:
        1. Run deterministic Reality Check first (Hard Facts).
        2. Prompt Gemini for deep audit + reforging + unfair twist.
        3. If Gemini fails or key is missing, invoke high-fidelity fallback.
        4. Validate schema with Pydantic.
        5. Recalculate deterministic feasibility for the reforged project!
        """
        # Step 1: Deterministic Reality Check (Authoritative Baseline)
        rc_request = RealityCheckRequest(student_profile=student, raw_project_idea=raw_idea)
        rc_res = perform_deterministic_reality_check(rc_request)
        feasibility_before = rc_res.overall_feasibility

        # Prepare Gemini prompt
        det_summary = {
            "feasibility_pass": rc_res.constraints_assessment.overall_pass,
            "violated_constraints": rc_res.constraints_assessment.violations,
            "scorecard": {
                "feasibility_score": rc_res.overall_feasibility,
                "scope_risk_level": rc_res.scope_risk_level,
                "skill_match_score": rc_res.skill_gap_summary.skill_match_score,
            },
            "risk_factors": [
                r.get("detail", "") if isinstance(r, dict) else getattr(r, "detail", "")
                for r in rc_res.critical_risks
            ],
        }
        user_prompt = build_audit_and_reforge_prompt(raw_idea, student.model_dump(), det_summary)

        gemini_data = None
        gemini_status = "offline_fallback"
        model_used = None

        if self.is_configured:
            gemini_data = await self._call_gemini_structured(
                system_instruction=AUDIT_AND_REFORGE_SYSTEM_INSTRUCTION,
                user_prompt=user_prompt,
                temperature=0.3,
            )
            if gemini_data and "audit" in gemini_data and "reforge" in gemini_data:
                gemini_status = "active"
                model_used = self.model

        audit: GeminiRealityAudit
        reforge: GeminiProjectReforge
        explanation: str

        if gemini_status == "active" and gemini_data:
            try:
                audit = GeminiRealityAudit(**gemini_data["audit"])
                reforge = GeminiProjectReforge(**gemini_data["reforge"])
                explanation = gemini_data.get("explanation", "Successfully reforged via Gemini intelligence.")
            except (ValidationError, Exception) as e:
                logger.warning(f"Failed to validate Gemini JSON with Pydantic: {e}. Falling back to deterministic.")
                audit, reforge = self._build_deterministic_fallback(student, raw_idea, rc_res)
                gemini_status = "offline_fallback"
                model_used = None
                explanation = "[Deterministic Fallback] Output validated through deterministic architecture."
        else:
            audit, reforge = self._build_deterministic_fallback(student, raw_idea, rc_res)
            explanation = (
                "[Deterministic Engine] Reforged using deterministic constraint boundaries. "
                "Set GEMINI_API_KEY to enable live Gemini Flash analysis."
            )

        # Step 5: Recalculate deterministic scores for the reforged project
        reforged_proj = Project(
            id="reforged_project",
            title=reforge.transformed_title,
            domain="AI & Machine Learning",
            difficulty=DifficultyLevel.INTERMEDIATE,
            estimated_weeks=reforge.reforged_project_spec.estimated_weeks,
            estimated_hours=reforge.reforged_project_spec.estimated_hours,
            estimated_cost_usd=reforge.reforged_project_spec.estimated_cost_usd,
            compute_requirement=reforge.reforged_project_spec.compute_requirement,
            required_hardware=reforge.reforged_project_spec.required_hardware,
            required_skills=reforge.reforged_project_spec.required_skills,
            critical_skills=reforge.reforged_project_spec.critical_skills,
            target_outcomes=[student.target_outcome],
            risk_factors=reforge.reforged_project_spec.risk_factors,
            description=reforge.proposed_solution,
        )

        recalculated_scorecard = evaluate_project(student, reforged_proj)

        return ReforgeResponse(
            gemini_status=gemini_status,
            model_used=model_used,
            audit=audit,
            reforge=reforge,
            deterministic_feasibility_before=feasibility_before,
            deterministic_feasibility_after=recalculated_scorecard.feasibility_score,
            recalculated_scorecard=recalculated_scorecard,
            explanation=explanation,
        )

    async def refine_project(
        self,
        student: StudentProfile,
        current_reforge: GeminiProjectReforge,
        instruction: str,
    ) -> RefinementResponse:
        """
        Applies a natural language refinement instruction (e.g. "We only have 8 weeks", "No GPU").
        Returns updated reforge + recalculated deterministic scorecard.
        """
        user_prompt = build_refinement_prompt(
            student_profile=student.model_dump(),
            current_reforge=current_reforge.model_dump(),
            refinement_instruction=instruction,
        )

        gemini_data = None
        gemini_status = "offline_fallback"

        if self.is_configured:
            gemini_data = await self._call_gemini_structured(
                system_instruction=REFINEMENT_SYSTEM_INSTRUCTION,
                user_prompt=user_prompt,
                temperature=0.3,
            )
            if gemini_data and "updated_reforge" in gemini_data:
                gemini_status = "active"

        updated_reforge: GeminiProjectReforge
        explanation: str

        if gemini_status == "active" and gemini_data:
            try:
                updated_reforge = GeminiProjectReforge(**gemini_data["updated_reforge"])
                explanation = gemini_data.get("explanation", f"Refined with instruction: '{instruction}'")
            except Exception as e:
                logger.warning(f"Pydantic validation failed for refinement: {e}")
                gemini_status = "offline_fallback"
                updated_reforge, explanation = self._apply_deterministic_refinement(
                    student, current_reforge, instruction
                )
        else:
            updated_reforge, explanation = self._apply_deterministic_refinement(
                student, current_reforge, instruction
            )

        # Recalculate deterministic feasibility for the refined project
        refined_proj = Project(
            id="refined_project",
            title=updated_reforge.transformed_title,
            domain="AI & Machine Learning",
            difficulty=DifficultyLevel.INTERMEDIATE,
            estimated_weeks=updated_reforge.reforged_project_spec.estimated_weeks,
            estimated_hours=updated_reforge.reforged_project_spec.estimated_hours,
            estimated_cost_usd=updated_reforge.reforged_project_spec.estimated_cost_usd,
            compute_requirement=updated_reforge.reforged_project_spec.compute_requirement,
            required_hardware=updated_reforge.reforged_project_spec.required_hardware,
            required_skills=updated_reforge.reforged_project_spec.required_skills,
            critical_skills=updated_reforge.reforged_project_spec.critical_skills,
            target_outcomes=[student.target_outcome],
            risk_factors=updated_reforge.reforged_project_spec.risk_factors,
            description=updated_reforge.proposed_solution,
        )

        recalculated_scorecard = evaluate_project(student, refined_proj)

        return RefinementResponse(
            gemini_status=gemini_status,
            refinement_instruction_applied=instruction,
            updated_reforge=updated_reforge,
            recalculated_scorecard=recalculated_scorecard,
            explanation=explanation,
        )

    def _apply_deterministic_refinement(
        self,
        student: StudentProfile,
        current_reforge: GeminiProjectReforge,
        instruction: str,
    ) -> Tuple[GeminiProjectReforge, str]:
        """
        Rule-based modifier for offline mode when Gemini is not available.
        Handles common prompts like '8 weeks', 'no gpu', 'make this easier', 'research'.
        """
        inst_lower = instruction.lower()
        curr_dict = current_reforge.model_dump()
        spec = curr_dict["reforged_project_spec"]
        visual_diff = curr_dict["visual_diff"]

        explanation_points = []

        # Check for week modifications
        week_match = re.search(r"(\d+)\s*weeks?", inst_lower)
        if week_match:
            new_weeks = int(week_match.group(1))
            spec["estimated_weeks"] = new_weeks
            spec["estimated_hours"] = max(30, int(new_weeks * student.weekly_hours_per_member * student.team_size * 0.7))
            visual_diff["modified"].append(f"Compressed timeline strictly to {new_weeks} weeks")
            explanation_points.append(f"Rescaled execution timeline to {new_weeks} weeks.")

        # Check for GPU removal
        if "no gpu" in inst_lower or "cpu" in inst_lower:
            spec["compute_requirement"] = ComputeTier.CPU_ONLY.value
            visual_diff["removed"].append("GPU-dependent model training")
            visual_diff["added"].append("ONNX Runtime CPU INT8 quantization")
            explanation_points.append("Constrained compute tier to CPU_ONLY with INT8 quantization.")

        # Check for 'easier' / 'reduce complexity'
        if "easier" in inst_lower or "reduce" in inst_lower or "simple" in inst_lower:
            spec["estimated_hours"] = max(30, int(spec["estimated_hours"] * 0.7))
            visual_diff["removed"].append("Complex custom loss functions")
            visual_diff["added"].append("Well-documented Scikit-Learn / HuggingFace pipelines")
            explanation_points.append("Reduced architectural complexity to standard reliable libraries.")

        # Check for 'research'
        if "research" in inst_lower or "academic" in inst_lower:
            curr_dict["research_angle"] = "Formal comparative evaluation with Wilcoxon signed-rank tests and ablation analysis."
            visual_diff["added"].append("Formal statistical significance hypothesis testing")
            explanation_points.append("Upgraded evaluation to peer-review research standards.")

        if not explanation_points:
            explanation_points.append(f"Applied refinement constraints: '{instruction}'")

        curr_dict["reforged_project_spec"] = spec
        curr_dict["visual_diff"] = visual_diff

        return GeminiProjectReforge(**curr_dict), " ".join(explanation_points)


# Global singleton instance
gemini_service = GeminiService()
