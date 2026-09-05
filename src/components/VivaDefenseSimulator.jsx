import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  UserX, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw,
  Lightbulb,
  MessageSquare,
  Zap,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { conductVivaInterrogation } from '../services/geminiService';

export default function VivaDefenseSimulator({ project }) {
  const [persona, setPersona] = useState('sharma');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Real-time evaluation scorecard
  const [latestScorecard, setLatestScorecard] = useState({
    rigor: 8,
    confidence: 8,
    tips: "Always start your defense with the baseline problem before jumping into complex ML architectures."
  });

  const chatEndRef = useRef(null);

  // Initialize conversation when project or persona changes
  useEffect(() => {
    if (!project) return;

    const initialTrap = project.defenseQA?.[0];
    const initialQuestion = initialTrap 
      ? initialTrap.q 
      : `Candidate, I have examined your submission for "${project.title}". Explain to this review board why your proposed architecture is fundamentally necessary rather than a trivial combination of off-the-shelf libraries.`;

    const initialMessage = {
      role: 'examiner',
      senderName: getPersonaTitle(persona),
      text: initialQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([initialMessage]);

    if (initialTrap) {
      setLatestScorecard({
        rigor: 7,
        confidence: 7,
        tips: initialTrap.examinerTrap || "Examiners will test whether you understand baseline models."
      });
    }

    if (isAudioEnabled) {
      speakText(initialQuestion);
    }
  }, [project, persona]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getPersonaTitle(p) {
    if (p === 'sharma') return "Prof. H. Sharma (Harsh External Examiner)";
    if (p === 'vance') return "Dr. Elena Vance (IEEE Research Advisor)";
    return "Marcus Sterling (Principal Systems Architect)";
  }

  // Browser Speech Synthesis
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // stop previous
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = persona === 'sharma' ? 0.9 : 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isEvaluating) return;

    const userText = inputValue.trim();
    setInputValue('');

    const newStudentMsg = {
      role: 'student',
      senderName: 'You (Candidate)',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, newStudentMsg];
    setMessages(updatedHistory);
    setIsEvaluating(true);

    try {
      const evaluation = await conductVivaInterrogation({
        project,
        conversationHistory: updatedHistory,
        studentResponse: userText,
        persona
      });

      const examinerMsg = {
        role: 'examiner',
        senderName: getPersonaTitle(persona),
        text: evaluation.examinerFeedback,
        nextQuestion: evaluation.nextQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedHistory, examinerMsg]);

      // Update scorecard
      setLatestScorecard({
        rigor: evaluation.rigorScore || 8,
        confidence: evaluation.confidenceScore || 8,
        tips: evaluation.coachTips || "State explicit performance metrics."
      });

      // Confetti celebration if student scores high marks!
      if ((evaluation.rigorScore || 0) >= 9) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      if (isAudioEnabled) {
        speakText(`${evaluation.examinerFeedback} ${evaluation.nextQuestion || ''}`);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (!project) return;
    const initialQuestion = project.defenseQA?.[0]?.q || `Explain the core algorithmic novelty of ${project.title}.`;
    setMessages([
      {
        role: 'examiner',
        senderName: getPersonaTitle(persona),
        text: initialQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!project) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Project Selected</h3>
        <p style={{ color: 'var(--text-tertiary)' }}>Please generate or select a project to start the Viva defense.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Room Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-rose">
                <Flame size={13} color="var(--rose-500)" />
                High-Stakes Viva Voce
              </span>
              <span className="badge badge-indigo">
                {project.title.split(':')[0]}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#ffffff' }}>
              The AI Defense Interrogation Room
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Prepare for tough external university examiners before your final year grade is on the line.
            </p>
          </div>

          {/* Controls: Persona Selector & Audio Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Persona Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                Examiner:
              </span>
              <select 
                className="select-input"
                value={persona}
                onChange={e => setPersona(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="sharma">Prof. Sharma (Harsh Skeptical Examiner)</option>
                <option value="vance">Dr. Vance (IEEE Research Advisor)</option>
                <option value="sterling">Marcus Sterling (Big-Tech Architect)</option>
              </select>
            </div>

            {/* Audio Speech Toggle */}
            <button 
              className={`btn ${isAudioEnabled ? 'btn-accent-cyan' : 'btn-secondary'} btn-sm`}
              onClick={() => {
                const next = !isAudioEnabled;
                setIsAudioEnabled(next);
                if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              title="Toggle Browser Voice Speech Synthesis"
            >
              {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isAudioEnabled ? 'Voice On' : 'Voice Off'}</span>
            </button>

            {/* Reset Viva */}
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleResetChat}
              title="Reset Defense Session"
            >
              <RotateCcw size={15} />
            </button>

          </div>

        </div>
      </div>

      {/* Main Split View: Chat Simulator (Left) + Scorecard & Traps (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '24px' }}>
        
        {/* Left: Chat Window */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '620px', borderRadius: 'var(--radius-xl)' }}>
          
          {/* Chat Messages Log */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {messages.map((msg, idx) => {
              const isExaminer = msg.role === 'examiner';

              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: isExaminer ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    marginBottom: '4px',
                    justifyContent: isExaminer ? 'flex-start' : 'flex-end'
                  }}>
                    {isExaminer ? <UserX size={13} color="var(--rose-500)" /> : <GraduationCap size={13} color="var(--cyan-400)" />}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isExaminer ? '#fda4af' : 'var(--cyan-400)' }}>
                      {msg.senderName}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <div style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    background: isExaminer ? 'rgba(24, 30, 48, 0.9)' : 'var(--grad-primary)',
                    border: `1px solid ${isExaminer ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}`,
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    lineHeight: 1.55,
                    boxShadow: isExaminer ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 18px rgba(99,102,241,0.35)'
                  }}>
                    {msg.text}
                    {msg.nextQuestion && (
                      <div style={{ 
                        marginTop: '10px', 
                        paddingTop: '10px', 
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                        color: '#93c5fd',
                        fontWeight: 600
                      }}>
                        {msg.nextQuestion}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isEvaluating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: 'rgba(24, 30, 48, 0.6)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                <span className="pulse-dot" style={{ background: 'var(--rose-500)' }} />
                <span style={{ fontSize: '0.82rem', color: '#fda4af' }}>
                  Examiner is scrutinizing your technical defense...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(10, 13, 20, 0.7)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                className="input-text"
                placeholder="Defend your architectural choices with mathematical precision..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={isEvaluating}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isEvaluating || !inputValue.trim()}
                style={{ padding: '0 20px' }}
              >
                <Send size={16} />
              </button>
            </div>
          </form>

        </div>

        {/* Right: Live Rubric Scorecard & Examiner Traps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Live Scorecard */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="var(--amber-400)" />
                Examiner Scorecard
              </h3>
              <span className="badge badge-amber">Live Rubric</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Rigor Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Technical Rigor & Math</span>
                  <span style={{ color: latestScorecard.rigor >= 8 ? 'var(--emerald-400)' : 'var(--amber-400)', fontWeight: 700 }}>
                    {latestScorecard.rigor}/10
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${latestScorecard.rigor * 10}%`, 
                    height: '100%', 
                    background: latestScorecard.rigor >= 8 ? 'var(--grad-emerald)' : 'var(--grad-amber)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Confidence Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Defense Clarity & Composure</span>
                  <span style={{ color: latestScorecard.confidence >= 8 ? 'var(--emerald-400)' : 'var(--amber-400)', fontWeight: 700 }}>
                    {latestScorecard.confidence}/10
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${latestScorecard.confidence * 10}%`, 
                    height: '100%', 
                    background: 'var(--grad-cyan)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Coach Advice */}
              <div style={{ 
                padding: '14px', 
                background: 'rgba(99, 102, 241, 0.08)', 
                border: '1px solid rgba(99, 102, 241, 0.25)', 
                borderRadius: 'var(--radius-md)',
                marginTop: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Lightbulb size={15} color="var(--cyan-400)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                    Mentor Coaching Tip
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {latestScorecard.tips}
                </p>
              </div>

            </div>
          </div>

          {/* Pre-Emptive Examiner Trap Alerts */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShieldAlert size={18} color="var(--rose-500)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                Examiner Traps to Anticipate
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.defenseQA?.slice(0, 2).map((item, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: '12px 14px', 
                    background: 'rgba(10, 14, 24, 0.6)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                    "{item.q}"
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                    <strong style={{ color: 'var(--amber-400)' }}>Trap: </strong>
                    {item.examinerTrap}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
