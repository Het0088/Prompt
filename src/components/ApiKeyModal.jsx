import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Cpu, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { fetchGeminiStatus } from '../services/apiService';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [backendStatus, setBackendStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setIsLoading(true);
    const status = await fetchGeminiStatus();
    setBackendStatus(status);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const isConfigured = backendStatus?.configured;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              padding: '8px', 
              background: 'rgba(99, 102, 241, 0.15)', 
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <Key size={20} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Gemini Architecture & Security</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
                Server-side LLM orchestration with zero browser key exposure
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

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Security Guarantee Banner */}
          <div style={{ 
            padding: '14px 16px', 
            background: 'rgba(16, 185, 129, 0.08)', 
            border: '1px solid rgba(16, 185, 129, 0.25)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <ShieldCheck size={20} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong style={{ color: '#ffffff' }}>Zero-Exposure Server Architecture:</strong> For hackathon security compliance, 
              Google Gemini API keys are never accepted in browser forms or stored in client storage. All calls are routed 
              exclusively through the FastAPI backend via secure environment variables.
            </div>
          </div>

          {/* Current Engine Status */}
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(10, 14, 24, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Backend Intelligence Status
              </span>
              <span className={`badge ${isConfigured ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                {isConfigured ? 'GEMINI ACTIVE' : 'DETERMINISTIC FALLBACK'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={22} color={isConfigured ? 'var(--emerald-400)' : 'var(--amber-400)'} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {backendStatus?.message || "Checking backend connection..."}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  Active Model: <code style={{ color: 'var(--cyan-400)' }}>{backendStatus?.model || "Deterministic Math Core"}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              How to configure your API key on the backend:
            </span>

            <div style={{ 
              padding: '12px 14px', 
              background: '#090d16', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: 'var(--cyan-400)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div><span style={{ color: 'var(--text-tertiary)' }}># 1. Open .env or set environment variable:</span></div>
              <div>GEMINI_API_KEY="your_gemini_api_key_here"</div>
              <div>GEMINI_MODEL="gemini-flash-lite-latest"</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                Restart uvicorn after updating environment.
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--cyan-400)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                Get Google AI Studio key <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={checkStatus}
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Refresh Status'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onClose}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
