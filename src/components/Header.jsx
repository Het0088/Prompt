import React from 'react';
import { Key, Code2, GraduationCap, RotateCcw } from 'lucide-react';

export default function Header({ onOpenApiKeyModal, onOpenPromptInspector, activeTab, setActiveTab, geminiStatus }) {
  const isGeminiActive = Boolean(geminiStatus?.configured);
  const activeModel = geminiStatus?.model || 'gemini-flash-lite-latest';

  return (
    <header className="glass-panel" style={{ padding: '16px 28px', margin: '16px 0 0', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Badge (Returns to Homepage / Generator) */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} 
          onClick={() => setActiveTab('onboarding')}
          title="Return to ForgeGrad AI Homepage / Capstone Generator"
        >
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'var(--grad-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Forge<span className="text-gradient">Grad</span> AI
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                PromptWars Edition
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              AI Capstone Architect, Cliché Buster & Viva Defense Mentor
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* New Analysis Shortcut if currently viewing Reality Check */}
          {activeTab === 'reality-check' && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('onboarding')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Return to Capstone Input to evaluate another project idea"
            >
              <RotateCcw size={14} />
              <span>New Analysis</span>
            </button>
          )}

          {/* AI Engine Status Pill */}
          <div 
            onClick={onOpenApiKeyModal}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              background: isGeminiActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.1)',
              border: `1px solid ${isGeminiActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(99, 102, 241, 0.25)'}`,
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to view Gemini AI Architecture, status & model details"
          >
            <span 
              className="pulse-dot" 
              style={{ background: isGeminiActive ? 'var(--emerald-400)' : '#818cf8' }} 
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isGeminiActive ? 'var(--emerald-400)' : '#c7d2fe' }}>
              {isGeminiActive ? `Gemini Live (${activeModel})` : 'Neural Simulated Engine'}
            </span>
            <Key size={14} color={isGeminiActive ? 'var(--emerald-400)' : '#c7d2fe'} />
          </div>

          {/* Prompt Architecture Inspector Trigger */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenPromptInspector}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Inspect System Prompts, Few-Shot Demonstrations & Schemas"
          >
            <Code2 size={15} color="var(--cyan-400)" />
            <span style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>Prompt Lab</span>
          </button>
        </div>
      </div>
    </header>
  );
}
