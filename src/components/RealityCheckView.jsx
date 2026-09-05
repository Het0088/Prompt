import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  DollarSign, 
  Wrench, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  FileCheck,
  ListFilter,
  MinusCircle,
  PlusCircle,
  RefreshCw,
  SlidersHorizontal,
  Zap,
  BookOpen,
  Send,
  HelpCircle,
  ShieldCheck,
  Award
} from 'lucide-react';
import { reforgeWithGemini, refineReforgedProject } from '../services/apiService';

export default function RealityCheckView({
  result,
  rawIdea,
  studentProfile,
  onReset,
  onEditConstraints,
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  
  // Gemini Reforge state
  const [reforgeData, setReforgeData] = useState(null);
  const [isReforging, setIsReforging] = useState(false);
  const [reforgeError, setReforgeError] = useState("");

  // Natural Language Refinement state
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineMessage, setRefineMessage] = useState("");

  // Auto-trigger Reforge on initial mount if not yet loaded
  useEffect(() => {
    let isMounted = true;
    const triggerReforge = async () => {
      setIsReforging(true);
      setReforgeError("");
      const res = await reforgeWithGemini(studentProfile, rawIdea);
      if (isMounted) {
        setIsReforging(false);
        if (res.success) {
          setReforgeData(res.data);
        } else {
          setReforgeError(res.error);
        }
      }
    };

    triggerReforge();
    return () => { isMounted = false; };
  }, [rawIdea, studentProfile]);

  const handleManualReforge = async () => {
    setIsReforging(true);
    setReforgeError("");
    const res = await reforgeWithGemini(studentProfile, rawIdea);
    setIsReforging(false);
    if (res.success) {
      setReforgeData(res.data);
    } else {
      setReforgeError(res.error);
    }
  };

  const handleApplyRefinement = async (instructionToUse = null) => {
    const instruction = (instructionToUse || refineInstruction).trim();
    if (!instruction || !reforgeData?.reforge) return;

    setIsRefining(true);
    setRefineMessage("");

    const res = await refineReforgedProject(studentProfile, reforgeData.reforge, instruction);
    setIsRefining(false);

    if (res.success) {
      // Update reforge state with refined version and recalculated scores
      setReforgeData(prev => ({
        ...prev,
        gemini_status: res.data.gemini_status,
        reforge: res.data.updated_reforge,
        recalculated_scorecard: res.data.recalculated_scorecard,
        deterministic_feasibility_after: res.data.recalculated_scorecard.feasibility_score,
        explanation: res.data.explanation,
      }));
      setRefineMessage(`Refinement applied: "${instruction}"`);
      setRefineInstruction("");
    } else {
      setRefineMessage(`Refinement failed: ${res.error}`);
    }
  };

  if (!result) return null;

  const {
    verdict,
    overall_feasibility,
    constraints_assessment,
    skill_gap_summary,
    critical_risks = [],
    resource_issues = [],
    timeline_issues = [],
    scope_risk_level,
    explanation,
  } = result;

  const isFeasible = verdict === "FEASIBLE";
  const isCritical = verdict === "UNREALISTIC_REJECT" || scope_risk_level === "CRITICAL";

  const getVerdictBadge = () => {
    if (isCritical) {
      return {
        label: "UNREALISTIC / HIGH REJECTION RISK",
        badgeClass: "badge-rose",
        color: "var(--rose-500)",
        icon: <XCircle size={16} color="var(--rose-500)" />,
        bgGlow: "rgba(244, 63, 94, 0.12)",
      };
    }
    if (!isFeasible) {
      return {
        label: "HIGH RISK — NEEDS ARCHITECTURAL PIVOT",
        badgeClass: "badge-amber",
        color: "var(--amber-400)",
        icon: <AlertTriangle size={16} color="var(--amber-400)" />,
        bgGlow: "rgba(245, 158, 11, 0.12)",
      };
    }
    return {
      label: "FEASIBLE WITHIN SEMESTER BOUNDARIES",
      badgeClass: "badge-emerald",
      color: "var(--emerald-400)",
      icon: <CheckCircle2 size={16} color="var(--emerald-400)" />,
      bgGlow: "rgba(16, 185, 129, 0.12)",
    };
  };

  const vInfo = getVerdictBadge();

  // Status pills for the 8 dimensions
  const dimensions = [
    {
      label: "Overall Feasibility",
      value: `${Math.round(overall_feasibility)}/100`,
      status: overall_feasibility >= 70 ? "PASS" : overall_feasibility >= 45 ? "WARNING" : "CRITICAL",
      icon: <Layers size={15} />,
    },
    {
      label: "Semester Timeline",
      value: constraints_assessment.timeline_pass ? "Capacity Met" : "Overrun Risk",
      status: constraints_assessment.timeline_pass ? "PASS" : "CRITICAL",
      icon: <Clock size={15} />,
    },
    {
      label: "Compute Infrastructure",
      value: constraints_assessment.compute_pass ? "Tier Met" : "Mismatch",
      status: constraints_assessment.compute_pass ? "PASS" : "HIGH RISK",
      icon: <Cpu size={15} />,
    },
    {
      label: "Financial Budget",
      value: constraints_assessment.budget_pass ? "Within Budget" : "Exceeded",
      status: constraints_assessment.budget_pass ? "PASS" : "HIGH RISK",
      icon: <DollarSign size={15} />,
    },
    {
      label: "Hardware Requirements",
      value: constraints_assessment.hardware_pass ? "Inventory OK" : "Missing Hardware",
      status: constraints_assessment.hardware_pass ? "PASS" : "HIGH RISK",
      icon: <Wrench size={15} />,
    },
    {
      label: "Skill Readiness",
      value: `${Math.round(skill_gap_summary.skill_match_score)}% Match`,
      status: skill_gap_summary.skill_match_score >= 70 ? "PASS" : skill_gap_summary.skill_match_score >= 45 ? "WARNING" : "CRITICAL",
      icon: <FileCheck size={15} />,
    },
    {
      label: "Prerequisite Burden",
      value: skill_gap_summary.learning_burden,
      status: skill_gap_summary.learning_burden === "None" || skill_gap_summary.learning_burden === "Low" ? "PASS" : "WARNING",
      icon: <ListFilter size={15} />,
    },
    {
      label: "Scope Vulnerability",
      value: scope_risk_level,
      status: scope_risk_level === "LOW" ? "PASS" : scope_risk_level === "MEDIUM" ? "WARNING" : "CRITICAL",
      icon: <ShieldAlert size={15} />,
    },
  ];

  const getStatusBadgeClass = (st) => {
    if (st === "PASS") return "badge-emerald";
    if (st === "WARNING") return "badge-amber";
    return "badge-rose";
  };

  const reforge = reforgeData?.reforge;
  const audit = reforgeData?.audit;
  const isGeminiActive = reforgeData?.gemini_status === "active";

  const presetRefinements = [
    "⚡ We only have 8 weeks",
    "💻 No GPU / CPU-only",
    "📉 Make this easier",
    "🔬 Make this research-oriented",
    "🚀 Add something innovative",
    "🧩 Reduce ML complexity",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      
      {/* 1. TOP BANNER: Deterministic Reality Check Verdict */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '32px', 
          borderRadius: 'var(--radius-xl)',
          background: `linear-gradient(180deg, ${vInfo.bgGlow} 0%, rgba(18, 22, 34, 0.95) 100%)`,
          border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.3)' : isFeasible ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className={`badge ${vInfo.badgeClass}`} style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                {vInfo.icon}
                {vInfo.label}
              </span>
              <span className="badge badge-indigo">
                Stage 1: Deterministic Reality Check
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Capstone Feasibility Verdict
            </h1>
            <p style={{ fontSize: '0.96rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {explanation}
            </p>
          </div>

          {/* Feasibility Dial Box */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 28px',
            background: 'rgba(10, 14, 24, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            minWidth: '170px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Deterministic Feasibility
            </span>
            <div style={{ 
              fontSize: '3.1rem', 
              fontWeight: 800, 
              color: vInfo.color,
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.1,
              margin: '4px 0',
            }}>
              {Math.round(overall_feasibility)}
              <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>/100</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isCritical ? "Catastrophic Boundary Fail" : isFeasible ? "Achievable" : "Needs Scoping"}
            </span>
          </div>

        </div>

        {/* 8-Dimension Evaluation Bar Grid */}
        <div style={{ 
          marginTop: '28px', 
          paddingTop: '24px', 
          borderTop: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
        }}>
          {dimensions.map((dim, idx) => (
            <div 
              key={idx}
              style={{
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{dim.icon}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{dim.label}</span>
                  <span style={{ fontSize: '0.84rem', color: '#f8fafc', fontWeight: 600 }}>{dim.value}</span>
                </div>
              </div>
              <span className={`badge ${getStatusBadgeClass(dim.status)}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {dim.status}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* 2. TRANSPARENCY STRIP: Clearly Separate Facts vs AI Analysis vs AI Recommendations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
      }}>
        <div className="glass-panel" style={{ padding: '14px 18px', borderLeft: '3px solid var(--primary-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Deterministic Facts
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
            Hard mathematical limits ({studentProfile.weeks_available || studentProfile.weeksAvailable}w, {studentProfile.compute_tier || studentProfile.computeTier}, ${studentProfile.budget_limit_usd || studentProfile.budgetLimitUsd || 0}). Governed by code, never overwritten by AI.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '14px 18px', borderLeft: '3px solid var(--purple-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--purple-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. Gemini AI Analysis
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
            Qualitative reasoning exposing hidden dataset bottlenecks, memory scaling traps, and examiner cross-examination questions.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '14px 18px', borderLeft: '3px solid var(--emerald-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3. Reforged Recommendation
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
            The "Unfair Twist" and scoped project architecture, mathematically recalculated to ensure guaranteed feasibility.
          </p>
        </div>
      </div>

      {/* 3. GEMINI REFORGE LOADING & TRIGGER SECTION */}
      {isReforging && (
        <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '2px solid var(--primary-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Sparkles size={24} color="var(--primary-500)" className="spin-animation" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: '0 0 8px' }}>
            Gemini Flash Reforging Engine Active
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--cyan-400)', margin: 0 }}>
            Conducting deep reality audit, formulating the Unfair Twist, and recalculating deterministic feasibility...
          </p>
        </div>
      )}

      {/* 4. GEMINI DEEP REALITY AUDIT (Stage 2) */}
      {audit && !isReforging && (
        <div className="glass-panel" style={{ padding: '28px', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                  Stage 2: Gemini Deep Reality Audit
                </span>
                <span className={`badge ${isGeminiActive ? 'badge-cyan' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                  {isGeminiActive ? `Model: ${reforgeData.model_used || 'gemini-2.5-flash'}` : 'Offline Fallback Engine'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#ffffff', margin: 0 }}>
                What Will Go Wrong: Hidden Traps & Examiner Exploits
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Deep Technical Audit
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            
            {/* Hidden Assumptions */}
            <div style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color="var(--amber-400)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--amber-400)', textTransform: 'uppercase' }}>
                  Hidden Student Assumptions
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {audit.hidden_assumptions.map((ha, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{ha}</li>
                ))}
              </ul>
            </div>

            {/* Academic Defense Weaknesses */}
            <div style={{ 
              padding: '16px', 
              background: 'rgba(244, 63, 94, 0.05)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(244, 63, 94, 0.25)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldAlert size={16} color="var(--rose-400)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase' }}>
                  External Viva Defense Traps
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {audit.academic_defense_weaknesses.map((adw, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{adw}</li>
                ))}
              </ul>
            </div>

            {/* Compute & Data Dependency Risks */}
            <div style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Cpu size={16} color="var(--cyan-400)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                  Compute & Data Dependencies
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {[...(audit.compute_dependency_risks || []), ...(audit.data_dependency_risks || [])].map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '6px' }}>• {item}</div>
                ))}
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <FileCheck size={16} color="var(--emerald-400)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase' }}>
                  Skill Gap & Execution Reality
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {audit.skill_gap_analysis}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 5. THE UNFAIR TWIST & REFORGED PROJECT CARD (Stage 3) */}
      {reforge && !isReforging && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '32px', 
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(18, 22, 34, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Reforged Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                  <Sparkles size={14} />
                  Stage 3: Reforged Project Architecture
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.78rem' }}>
                  <Award size={14} />
                  Top Marks Blueprint
                </span>
              </div>

              <h2 style={{ fontSize: '1.9rem', color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                {reforge.transformed_title}
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {reforge.proposed_solution}
              </p>
            </div>

            {/* Recalculated Score Dial (Before vs After) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              background: 'rgba(10, 14, 24, 0.85)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Before
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rose-400)' }}>
                  {Math.round(reforgeData.deterministic_feasibility_before)}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/100</span>
                </div>
              </div>

              <ArrowRight size={20} color="var(--primary-400)" />

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                  After Reforge
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                  {Math.round(reforgeData.deterministic_feasibility_after)}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* THE UNFAIR TWIST FEATURE BOX */}
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={18} color="var(--amber-400)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--amber-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                THE UNFAIR TWIST (Defensible Scientific Differentiator)
              </span>
            </div>

            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fef3c7', marginBottom: '8px' }}>
              {reforge.unfair_twist}
            </div>

            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
              <strong>Why This Wins in Examinations: </strong>
              {reforge.why_unfair_twist_is_defensible}
            </p>
          </div>

          {/* 6. BEFORE / AFTER VISUAL DIFF: REMOVED / MODIFIED / ADDED */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Architectural Transformation Diff
              </h3>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                Delta vs Original Proposal
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              
              {/* REMOVED (Red) */}
              <div style={{
                padding: '18px',
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.28)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <MinusCircle size={16} color="var(--rose-400)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase' }}>
                    REMOVED (Impractical Scope)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reforge.visual_diff.removed.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.83rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: 'var(--rose-400)', fontWeight: 700 }}>✕</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODIFIED (Amber) */}
              <div style={{
                padding: '18px',
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <SlidersHorizontal size={16} color="var(--amber-400)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--amber-400)', textTransform: 'uppercase' }}>
                    MODIFIED (Scaled to Fit)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reforge.visual_diff.modified.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.83rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: 'var(--amber-400)', fontWeight: 700 }}>↻</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADDED (Emerald) */}
              <div style={{
                padding: '18px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <PlusCircle size={16} color="var(--emerald-400)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--emerald-400)', textTransform: 'uppercase' }}>
                    ADDED (Novelty & Defensibility)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reforge.visual_diff.added.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.83rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Concrete Execution Specs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            padding: '16px',
            background: 'rgba(10, 14, 24, 0.6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '28px',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Feasible Timeline</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {reforge.reforged_project_spec.estimated_weeks} Weeks ({reforge.reforged_project_spec.estimated_hours} Hours)
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Compute Environment</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {reforge.reforged_project_spec.compute_requirement} (Guaranteed Pass)
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Budget</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                ${reforge.reforged_project_spec.estimated_cost_usd.toFixed(2)} USD
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Research Angle</span>
              <div style={{ fontSize: '0.82rem', color: 'var(--cyan-400)', lineHeight: 1.3 }}>
                {reforge.research_angle}
              </div>
            </div>
          </div>

          {/* 7. NATURAL LANGUAGE REFINEMENT INTERACTION BOX */}
          <div style={{
            padding: '24px',
            background: 'rgba(10, 14, 24, 0.8)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <SlidersHorizontal size={18} color="var(--primary-400)" />
              <h4 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                Natural Language Refinement
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Iterate on this capstone in plain English. Gemini re-adjusts the architecture and recalculates deterministic feasibility in real-time.
            </p>

            {/* Quick action preset chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {presetRefinements.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyRefinement(preset)}
                  disabled={isRefining}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    color: '#cbd5e1',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-500)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom instruction input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                className="input-text"
                placeholder="e.g. 'We only have 8 weeks', 'Make this easier', 'Remove hardware dependency'..."
                value={refineInstruction}
                onChange={(e) => setRefineInstruction(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApplyRefinement(); }}
                disabled={isRefining}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleApplyRefinement()}
                disabled={isRefining || !refineInstruction.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isRefining ? <RefreshCw size={16} className="spin-animation" /> : <Send size={16} />}
                {isRefining ? 'Refining...' : 'Refine'}
              </button>
            </div>

            {refineMessage && (
              <div style={{ 
                marginTop: '12px', 
                fontSize: '0.82rem', 
                color: 'var(--cyan-400)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={14} color="var(--cyan-400)" />
                {refineMessage}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 8. ACTION BAR (Reset, Edit Constraints, or Re-run) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '16px',
        padding: '16px 0',
      }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RotateCcw size={16} />
          Evaluate Another Project Idea
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onEditConstraints}
          >
            Adjust Student Profile Constraints
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleManualReforge}
            disabled={isReforging}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} />
            {isReforging ? 'Regenerating...' : 'Regenerate Gemini Reforge'}
          </button>
        </div>
      </div>

    </div>
  );
}
