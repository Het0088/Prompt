import React, { useState } from 'react';
import { X, Code2, Sparkles, Layers, ShieldAlert, Terminal, Copy, Check } from 'lucide-react';
import { PROMPT_SYSTEM_ARCHITECTURE } from '../services/promptEngineeringDocs';

export default function PromptInspectorModal({ isOpen, onClose }) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPhase = PROMPT_SYSTEM_ARCHITECTURE.pipelinePhases[activePhaseIndex];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '920px' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              padding: '8px', 
              background: 'rgba(6, 182, 212, 0.15)', 
              borderRadius: '8px',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              <Code2 size={22} color="var(--cyan-400)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Prompt Engineering Architecture</h3>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  v{PROMPT_SYSTEM_ARCHITECTURE.version}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
                Inspection view for Google PromptWars Hackathon judges & evaluators
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Phase Selector Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: '12px 24px', 
          background: 'rgba(10, 13, 20, 0.6)', 
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          {PROMPT_SYSTEM_ARCHITECTURE.pipelinePhases.map((phase, idx) => (
            <button
              key={phase.phase}
              onClick={() => setActivePhaseIndex(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: idx === activePhaseIndex ? 'var(--primary-500)' : 'transparent',
                background: idx === activePhaseIndex ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: idx === activePhaseIndex ? '#c7d2fe' : 'var(--text-tertiary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                background: idx === activePhaseIndex ? 'var(--primary-500)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }}>
                {idx + 1}
              </span>
              {phase.phase.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          
          {/* Phase Overview & Applied Techniques */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>
                {currentPhase.phase}
              </h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {currentPhase.techniques.map(t => (
                  <span key={t} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {currentPhase.purpose}
            </p>
          </div>

          {/* System Prompt Box */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '8px 12px',
              background: '#0d111c',
              borderTopLeftRadius: 'var(--radius-md)',
              borderTopRightRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderBottom: 'none'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Instruction & Behavioral Guardrails
              </span>
              <button 
                onClick={() => handleCopy(currentPhase.systemPrompt)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                {copied ? <Check size={12} color="var(--emerald-400)" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="code-box" style={{ 
              margin: 0, 
              borderTopLeftRadius: 0, 
              borderTopRightRadius: 0, 
              whiteSpace: 'pre-wrap', 
              color: '#93c5fd',
              fontSize: '0.82rem'
            }}>
              {currentPhase.systemPrompt}
            </pre>
          </div>

          {/* Few Shot Demonstration Box (if phase 1) */}
          {activePhaseIndex === 0 && (
            <div style={{ 
              background: 'rgba(18, 22, 34, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--purple-500)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                  In-Context Chain-of-Thought (CoT) Scratchpad Example
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                How Gemini reasons inside scratchpad tags before synthesizing the final capstone proposal:
              </p>
              <pre className="code-box" style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                {PROMPT_SYSTEM_ARCHITECTURE.fewShotExamples[0].thinkingProcess}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div style={{ marginRight: 'auto', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            Google PromptWars 2026 • Evaluated on Structured Outputs & Guardrails
          </div>
          <button className="btn btn-primary" onClick={onClose}>
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
