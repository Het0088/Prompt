import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Sliders, 
  Lightbulb, 
  Code, 
  Layers, 
  RefreshCw,
  Award,
  ChevronRight
} from 'lucide-react';
import { BRANCHES, TARGET_OUTCOMES, RESOURCE_TIERS, CURATED_PROJECTS } from '../data/curatedProjects';
import { generateProjectIdeas } from '../services/geminiService';

export default function IdeaGenerator({ onSelectProject, activeProject }) {
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [targetOutcome, setTargetOutcome] = useState(TARGET_OUTCOMES[0]);
  const [resourceTier, setResourceTier] = useState(RESOURCE_TIERS[0]);
  const [teamSize, setTeamSize] = useState("3-4 Members (Standard Capstone)");
  const [rawIdea, setRawIdea] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState(CURATED_PROJECTS);
  const [generationNotice, setGenerationNotice] = useState("");

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setGenerationNotice("");

    try {
      const results = await generateProjectIdeas({
        branch,
        targetOutcome,
        resourceTier,
        studentIdeaOrInterest: rawIdea,
        teamSize
      });
      setGeneratedProjects(results);
      if (results.length > 0 && !activeProject) {
        onSelectProject(results[0], 'generator');
      }
      setGenerationNotice(`Generated ${results.length} publication-grade project proposals tailored to your parameters.`);
    } catch (err) {
      console.error(err);
      setGenerationNotice("Using offline-curated architectures.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetSelect = (presetProject) => {
    onSelectProject(presetProject, 'blueprint');
  };

  const sampleQuickIdeas = [
    { label: "ICU Sepsis Early Warning", branch: "AI & Healthcare Tech", text: "ICU telemetry prediction with hospital privacy" },
    { label: "Anti-Spoofing Exam Proctor", branch: "Cybersecurity & Forensics", text: "Exam proctoring with webcam liveness & zero video uploads" },
    { label: "Agri-Drone Spectral Analysis", branch: "IoT & Embedded Systems", text: "Autonomous drone for crop stress and precision irrigation" },
    { label: "DeFi Flash-Loan Defense", branch: "FinTech & Blockchain", text: "Mempool exploit detection via Temporal Graph Neural Networks" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-indigo">
            <Flame size={13} color="#818cf8" />
            Cliché Buster Engine Active
          </span>
          <span className="badge badge-emerald">
            <Award size={13} color="var(--emerald-400)" />
            IEEE / University Grade
          </span>
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '12px' }}>
          Formulate a <span className="text-gradient">Publishable Final Year Project</span> in Seconds
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Transform standard undergraduate clichés into defense-proof, patent-grade capstones with rigorous system architectures, verified datasets, and automated viva preparation.
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            
            {/* Branch */}
            <div className="input-group">
              <label className="input-label">Academic Branch / Specialization</label>
              <select 
                className="select-input"
                value={branch}
                onChange={e => setBranch(e.target.value)}
              >
                {BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Target Outcome */}
            <div className="input-group">
              <label className="input-label">Target Milestone / Grade Goal</label>
              <select 
                className="select-input"
                value={targetOutcome}
                onChange={e => setTargetOutcome(e.target.value)}
              >
                {TARGET_OUTCOMES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Resources / Compute */}
            <div className="input-group">
              <label className="input-label">Compute & Hardware Constraints</label>
              <select 
                className="select-input"
                value={resourceTier}
                onChange={e => setResourceTier(e.target.value)}
              >
                {RESOURCE_TIERS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Team Size */}
            <div className="input-group">
              <label className="input-label">Team Structure</label>
              <select 
                className="select-input"
                value={teamSize}
                onChange={e => setTeamSize(e.target.value)}
              >
                <option value="Solo (1 Student)">Solo (1 Student - Scoped for High Individual Output)</option>
                <option value="Pair (2 Students)">Pair (2 Students - Modular Frontend/Backend/ML)</option>
                <option value="3-4 Members (Standard Capstone)">3-4 Members (Full SDLC Division of Labor)</option>
              </select>
            </div>

          </div>

          {/* Student's Raw Idea or Interest */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">
                <Lightbulb size={15} color="var(--amber-400)" />
                Student's Raw Idea, Interest, or Topic You Want Upgraded (Optional)
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                e.g., "Face recognition attendance" or "Plant leaf disease"
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                className="input-text"
                placeholder="Type your initial idea (even if it's a basic cliché — our prompt engine will add the novel twist!)"
                value={rawIdea}
                onChange={e => setRawIdea(e.target.value)}
                style={{ paddingRight: '140px' }}
              />
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={isGenerating}
                style={{ 
                  position: 'absolute', 
                  right: '6px', 
                  top: '6px', 
                  bottom: '6px',
                  padding: '0 18px',
                  fontSize: '0.88rem'
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={15} className="spin-animation" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Synthesize</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Archetype Suggestion Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Or test curated award-winning capstones:
            </span>
            {CURATED_PROJECTS.slice(0, 4).map(cp => (
              <button
                key={cp.id}
                type="button"
                onClick={() => handlePresetSelect(cp)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--cyan-400)';
                  e.currentTarget.style.color = 'var(--cyan-400)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>{cp.title.split(':')[0]}</span>
                <ChevronRight size={12} />
              </button>
            ))}
          </div>

        </form>
      </div>

      {/* Generation Status Feedback */}
      {generationNotice && (
        <div style={{ 
          padding: '10px 18px', 
          background: 'rgba(99, 102, 241, 0.1)', 
          border: '1px solid rgba(99, 102, 241, 0.25)', 
          borderRadius: 'var(--radius-md)',
          color: '#c7d2fe',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={16} color="var(--emerald-400)" />
          {generationNotice}
        </div>
      )}

      {/* Proposal Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Generated Capstone Proposals</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              Filtered against 50+ undergraduate clichés with novelty scoring & algorithmic twists
            </p>
          </div>
          <span className="badge badge-indigo">
            {generatedProjects.length} Architectures Ready
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {generatedProjects.map(proj => {
            const isSelected = activeProject?.id === proj.id;

            return (
              <div 
                key={proj.id}
                className="glass-panel glass-panel-interactive"
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  gap: '20px',
                  borderColor: isSelected ? 'var(--primary-500)' : 'var(--border-subtle)',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-md)'
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Badges Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                      {proj.domain}
                    </span>

                    {/* Novelty Score Meter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        Novelty Index:
                      </span>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: proj.noveltyScore >= 90 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: `1px solid ${proj.noveltyScore >= 90 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        <Zap size={13} color={proj.noveltyScore >= 90 ? 'var(--emerald-400)' : 'var(--amber-400)'} />
                        <span style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          color: proj.noveltyScore >= 90 ? 'var(--emerald-400)' : 'var(--amber-400)' 
                        }}>
                          {proj.noveltyScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#ffffff' }}>
                      {proj.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {proj.summary}
                    </p>
                  </div>

                  {/* Cliché Buster Alert */}
                  {proj.clicheWarning && (
                    <div style={{ 
                      padding: '12px 14px', 
                      background: 'rgba(244, 63, 94, 0.08)', 
                      border: '1px solid rgba(244, 63, 94, 0.2)', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldAlert size={14} color="var(--rose-500)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rose-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Undergraduate Cliché Avoided
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#fda4af', lineHeight: 1.45 }}>
                        {proj.clicheWarning}
                      </p>
                    </div>
                  )}

                  {/* The Unfair Algorithmic Twist */}
                  <div style={{ 
                    padding: '12px 14px', 
                    background: 'rgba(16, 185, 129, 0.08)', 
                    border: '1px solid rgba(16, 185, 129, 0.25)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} color="var(--emerald-400)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        The Winning Algorithmic Twist
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#a7f3d0', lineHeight: 1.45 }}>
                      {proj.unfairTwist}
                    </p>
                  </div>

                  {/* Tech Stack Highlights */}
                  {proj.techStack && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.entries(proj.techStack).map(([layer, val]) => (
                        <span 
                          key={layer} 
                          style={{ 
                            fontSize: '0.72rem', 
                            padding: '3px 8px', 
                            background: 'rgba(255,255,255,0.04)', 
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          <strong style={{ color: '#cbd5e1', textTransform: 'capitalize' }}>{layer}:</strong> {val.split(',')[0]}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

                {/* Card Actions */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '160px', padding: '10px 16px', fontSize: '0.88rem' }}
                    onClick={() => onSelectProject(proj, 'blueprint')}
                  >
                    <Layers size={15} />
                    <span>View SRS Blueprint</span>
                  </button>

                  <button 
                    className="btn btn-accent-cyan"
                    style={{ padding: '10px 14px', fontSize: '0.88rem' }}
                    onClick={() => onSelectProject(proj, 'viva')}
                    title="Simulate live viva defense against harsh external examiners"
                  >
                    <Flame size={15} />
                    <span>Grill in Viva</span>
                  </button>

                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '10px 14px', fontSize: '0.88rem' }}
                    onClick={() => onSelectProject(proj, 'synopsis')}
                    title="Export IEEE-compliant academic project proposal synopsis"
                  >
                    <Award size={15} />
                    <span>Synopsis</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
