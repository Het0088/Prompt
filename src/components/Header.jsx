import React from 'react';
import { Sparkles, Key, Code2, Cpu, GraduationCap, ShieldCheck } from 'lucide-react';
import { getStoredApiKey, getStoredModel } from '../services/geminiService';

export default function Header({ onOpenApiKeyModal, onOpenPromptInspector, activeTab, setActiveTab }) {
  const hasApiKey = Boolean(getStoredApiKey());
  const activeModel = getStoredModel();

  return (
    <header className="glass-panel" style={{ padding: '16px 28px', margin: '16px 0 0', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveTab('generator')}>
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
          
          {/* AI Engine Status Pill */}
          <div 
            onClick={onOpenApiKeyModal}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              background: hasApiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              border: `1px solid ${hasApiKey ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`,
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to configure Gemini API Key or change model"
          >
            <span 
              className="pulse-dot" 
              style={{ background: hasApiKey ? 'var(--emerald-400)' : '#818cf8' }} 
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: hasApiKey ? 'var(--emerald-400)' : '#c7d2fe' }}>
              {hasApiKey ? `Gemini Live (${activeModel})` : 'Neural Simulated Engine'}
            </span>
            <Key size={14} color={hasApiKey ? 'var(--emerald-400)' : '#c7d2fe'} />
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
