import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  DEMO_SCENARIO_A_PROFILE, 
  DEMO_SCENARIO_A_IDEA, 
  DEMO_SCENARIO_B_PROFILE, 
  DEMO_SCENARIO_B_IDEA, 
  ALTERNATIVE_DEMO_IDEAS 
} from '../data/demoScenario';

const BRANCH_OPTIONS = [
  "Computer Science & Engineering",
  "AI & Data Science",
  "Cybersecurity & Digital Forensics",
  "Information Technology",
  "IoT & Embedded Systems",
  "Robotics & Automation",
  "Biomedical Engineering",
  "Electrical & Electronics",
];

const LEVEL_OPTIONS = [
  "B.Tech / B.E. Final Year",
  "M.Tech / M.S. Final Year",
  "MCA / Post-Graduate",
  "Diploma / Final Semester",
];

const STANDARD_SKILLS = [
  { key: "python", label: "Python" },
  { key: "pytorch", label: "PyTorch / Deep Learning" },
  { key: "machine_learning", label: "Machine Learning (Scikit-Learn)" },
  { key: "javascript", label: "JavaScript / TypeScript" },
  { key: "react", label: "React / Frontend" },
  { key: "sql", label: "SQL / Relational Databases" },
  { key: "c", label: "C / C++" },
  { key: "docker", label: "Docker / DevOps" },
];

const COMPUTE_OPTIONS = [
  { value: "cpu_only", label: "CPU Only (Local Laptop, No GPU)", desc: "Best for software, TinyML, or lightweight data pipelines" },
  { value: "colab_free", label: "Google Colab Free Tier (T4 GPU, 12h timeouts)", desc: "Standard for undergraduate deep learning coursework" },
  { value: "local_gpu", label: "Local NVIDIA Dedicated GPU (RTX 3060+)", desc: "Unrestricted local training with 8GB-12GB VRAM" },
  { value: "cloud_gpu", label: "Cloud GPU Clusters (A100 / H100 / AWS EC2)", desc: "Paid enterprise infrastructure for 3D/LLM models" },
];

const HARDWARE_ITEMS = [
  { id: "esp32", label: "ESP32 Microcontroller" },
  { id: "raspberry_pi", label: "Raspberry Pi (3/4/5)" },
  { id: "arduino", label: "Arduino Uno / Nano" },
  { id: "sensors", label: "IoT Sensors (Environmental / Bio)" },
  { id: "drone_platform", label: "UAV / Drone Chassis" },
  { id: "jetson_nano", label: "NVIDIA Jetson Nano" },
];

const TARGET_GOALS = [
  { value: "ieee_paper", label: "IEEE / Scopus Research Paper", desc: "Prioritizes novelty, mathematical rigor, and baseline ablation studies." },
  { value: "startup_mvp", label: "Startup MVP / Patent Potential", desc: "Prioritizes product readiness, user experience, and commercial viability." },
  { value: "industry_grade", label: "Industry-Grade Production System", desc: "Prioritizes architecture, latency, throughput, and automated CI/CD." },
  { value: "social_good", label: "Social Impact & Local Community", desc: "Prioritizes accessibility, low-cost deployment, and real-world utility." },
];

export default function OnboardingWizard({
  profile,
  setProfile,
  rawIdea,
  setRawIdea,
  onSubmitRealityCheck,
  isLoading,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState("");

  const updateProfileField = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
    setValidationError("");
  };

  const updateSkillLevel = (skillKey, level) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillKey]: level,
      },
    }));
  };

  const toggleHardware = (hwId) => {
    setProfile(prev => {
      const current = prev.hardwareAvailable || [];
      const updated = current.includes(hwId)
        ? current.filter(x => x !== hwId)
        : [...current, hwId];
      return { ...prev, hardwareAvailable: updated };
    });
  };

  const handleLoadDemoA = () => {
    setProfile(DEMO_SCENARIO_A_PROFILE);
    setRawIdea(DEMO_SCENARIO_A_IDEA);
    setCurrentStep(5);
    setValidationError("");
  };

  const handleLoadDemoB = () => {
    setProfile(DEMO_SCENARIO_B_PROFILE);
    setRawIdea(DEMO_SCENARIO_B_IDEA);
    setCurrentStep(5);
    setValidationError("");
  };

  const validateAndProceed = () => {
    if (currentStep === 1) {
      if (!profile.major) {
        setValidationError("Please select your academic major.");
        return;
      }
    }
    if (currentStep === 3) {
      if (profile.weeksAvailable < 1 || profile.teamSize < 1 || profile.weeklyHoursPerMember < 1) {
        setValidationError("All timeline parameters must be at least 1.");
        return;
      }
    }
    setValidationError("");
    setCurrentStep(s => Math.min(5, s + 1));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!rawIdea.trim() || rawIdea.trim().length < 5) {
      setValidationError("Please describe your project idea with at least a few words.");
      return;
    }
    onSubmitRealityCheck();
  };

  const skillLevelDescriptions = {
    1: "1 - Beginner (Concept only)",
    2: "2 - Novice (Toy projects)",
    3: "3 - Competent (Coursework ready)",
    4: "4 - Proficient (Production use)",
    5: "5 - Expert (Advanced architecture)",
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner with Demo Trigger */}
      <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-indigo">Step {currentStep} of 5</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Student Dossier & Constraints</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#f8fafc' }}>
              {currentStep === 1 && "About Your Academic Background"}
              {currentStep === 2 && "Rate Your Core Technical Skills"}
              {currentStep === 3 && "Hard Semester Constraints & Compute"}
              {currentStep === 4 && "Capstone Evaluation Goal"}
              {currentStep === 5 && "Proposed Project Idea"}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-accent-cyan btn-sm"
              onClick={handleLoadDemoA}
              title="Loads Scenario A: 3-person CS team, 12w, CPU-only, 3D Medical AI (Unrealistic)"
            >
              <Zap size={14} />
              <span>Load Demo Scenario</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLoadDemoB}
              title="Loads Scenario B: 2-person team, 10w, CPU-only, Face Recognition Attendance (Cliché)"
            >
              <Sparkles size={14} />
              <span>Scenario B (Face Attendance)</span>
            </button>
          </div>
        </div>

        {/* Progress Dots Bar */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              onClick={() => setCurrentStep(step)}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: step <= currentStep ? 'var(--grad-primary)' : 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Form Step Card */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* STEP 1: ABOUT YOU */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Tell us your engineering branch and level so we can calibrate academic review standards.
              </p>

              <div className="input-group">
                <label className="input-label">Academic Major / Discipline</label>
                <select
                  className="select-input"
                  value={profile.major}
                  onChange={e => updateProfileField("major", e.target.value)}
                >
                  {BRANCH_OPTIONS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Degree Level</label>
                <select
                  className="select-input"
                  value={profile.academicLevel || LEVEL_OPTIONS[0]}
                  onChange={e => updateProfileField("academicLevel", e.target.value)}
                >
                  {LEVEL_OPTIONS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS MATRIX */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Rate your team's collective proficiency on a 1–5 scale. ForgeGrad uses this to calculate exact skill gap penalties.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {STANDARD_SKILLS.map(skill => {
                  const currentVal = profile.skills[skill.key] || 1;
                  return (
                    <div
                      key={skill.key}
                      style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                          {skill.label}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: currentVal >= 3 ? 'var(--cyan-400)' : 'var(--amber-400)', fontWeight: 600 }}>
                          {skillLevelDescriptions[currentVal]}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={currentVal}
                        onChange={e => updateSkillLevel(skill.key, parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CONSTRAINTS & HARDWARE */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hard physical and logistical boundaries. The deterministic engine uses these to compute person-hour capacity and check budget limits.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Team Members</label>
                  <input
                    type="number"
                    className="input-text"
                    min="1"
                    max="10"
                    value={profile.teamSize}
                    onChange={e => updateProfileField("teamSize", parseInt(e.target.value, 10) || 1)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Weeks Available</label>
                  <input
                    type="number"
                    className="input-text"
                    min="1"
                    max="52"
                    value={profile.weeksAvailable}
                    onChange={e => updateProfileField("weeksAvailable", parseInt(e.target.value, 10) || 1)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Hours / Member / Wk</label>
                  <input
                    type="number"
                    className="input-text"
                    min="1"
                    max="80"
                    value={profile.weeklyHoursPerMember}
                    onChange={e => updateProfileField("weeklyHoursPerMember", parseInt(e.target.value, 10) || 1)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Budget Limit ($ USD)</label>
                  <input
                    type="number"
                    className="input-text"
                    min="0"
                    step="10"
                    value={profile.budgetLimitUsd}
                    onChange={e => updateProfileField("budgetLimitUsd", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Compute Tier */}
              <div className="input-group">
                <label className="input-label">Compute Infrastructure Access</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {COMPUTE_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        background: profile.computeTier === opt.value ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${profile.computeTier === opt.value ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="computeTier"
                        value={opt.value}
                        checked={profile.computeTier === opt.value}
                        onChange={e => updateProfileField("computeTier", e.target.value)}
                        style={{ marginTop: '3px', accentColor: 'var(--primary-500)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hardware Checkboxes */}
              <div className="input-group">
                <label className="input-label">Physical Hardware in Your Possession (if any)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {HARDWARE_ITEMS.map(hw => {
                    const isChecked = (profile.hardwareAvailable || []).includes(hw.id);
                    return (
                      <label
                        key={hw.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          background: isChecked ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isChecked ? 'var(--cyan-400)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleHardware(hw.id)}
                          style={{ accentColor: 'var(--cyan-400)' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{hw.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TARGET GOAL */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                What is your team's primary success metric for final-year evaluation?
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {TARGET_GOALS.map(goal => (
                  <label
                    key={goal.value}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '18px',
                      background: profile.targetOutcome === goal.value ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${profile.targetOutcome === goal.value ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="targetOutcome"
                        value={goal.value}
                        checked={profile.targetOutcome === goal.value}
                        onChange={e => updateProfileField("targetOutcome", e.target.value)}
                        style={{ accentColor: 'var(--primary-500)' }}
                      />
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                        {goal.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '24px' }}>
                      {goal.desc}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PROJECT IDEA */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  What are you thinking of building? State your idea plainly — even if it's broad or challenging. ForgeGrad AI will stress-test its feasibility.
                </p>
              </div>

              <div className="input-group">
                <textarea
                  className="textarea-input"
                  rows={4}
                  placeholder="e.g., Real-time AI medical diagnosis using large 3D medical images..."
                  value={rawIdea}
                  onChange={e => setRawIdea(e.target.value)}
                  style={{ fontSize: '1.05rem', lineHeight: 1.5 }}
                />
              </div>

              {/* Alternative Demo Idea Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  Or stress-test other high-contrast scenarios:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ALTERNATIVE_DEMO_IDEAS.map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setRawIdea(item.idea)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '6px 14px',
                        color: rawIdea === item.idea ? 'var(--cyan-400)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderColor: rawIdea === item.idea ? 'var(--cyan-400)' : 'var(--border-subtle)',
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Capacity Summary Pill */}
              <div style={{
                padding: '12px 18px',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Configured Capacity:</strong> {profile.weeksAvailable} weeks × {profile.teamSize} members × {profile.weeklyHoursPerMember} hrs/wk = <span style={{ color: 'var(--cyan-400)', fontWeight: 700 }}>{profile.weeksAvailable * profile.teamSize * profile.weeklyHoursPerMember} total person-hours</span>
                </div>
                <div className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                  {profile.computeTier.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Validation Feedback */}
          {validationError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--rose-500)',
              fontSize: '0.85rem',
            }}>
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={validateAndProceed}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isLoading}
                style={{ padding: '12px 28px' }}
              >
                {isLoading ? (
                  <>
                    <span className="pulse-dot" style={{ background: '#ffffff' }} />
                    <span>Executing Reality Check...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Run Project Reality Check</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}
