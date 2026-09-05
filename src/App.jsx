import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OnboardingWizard from './components/OnboardingWizard';
import RealityCheckView from './components/RealityCheckView';
import ApiKeyModal from './components/ApiKeyModal';
import PromptInspectorModal from './components/PromptInspectorModal';
import { submitRealityCheck, fetchGeminiStatus, fetchBackendHealth } from './services/apiService';
import { DEMO_STUDENT_PROFILE, DEMO_RAW_IDEA } from './data/demoScenario';
import { 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('onboarding'); // 'onboarding' | 'reality-check'
  const [profile, setProfile] = useState(DEMO_STUDENT_PROFILE);
  const [rawIdea, setRawIdea] = useState(DEMO_RAW_IDEA);
  const [realityCheckResult, setRealityCheckResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiError, setApiError] = useState("");
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState({ configured: false, status: "checking" });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPromptInspectorOpen, setIsPromptInspectorOpen] = useState(false);

  // Check backend health & Gemini status on mount with resilient polling for cold starts
  useEffect(() => {
    let isMounted = true;
    let retryTimer = null;

    const checkSystem = async () => {
      try {
        const data = await fetchBackendHealth();
        if (isMounted) {
          const isHealthy = data && data.status === 'healthy';
          setBackendHealthy(isHealthy);
          
          if (!isHealthy) {
            // Backend might be waking up on Render, retry in 3.5s
            retryTimer = setTimeout(checkSystem, 3500);
          }
        }
      } catch (err) {
        if (isMounted) {
          setBackendHealthy(false);
          retryTimer = setTimeout(checkSystem, 4000);
        }
      }

      try {
        const status = await fetchGeminiStatus();
        if (isMounted && status) {
          setGeminiStatus(status);
        }
      } catch (err) {
        // Fallback status remains
      }
    };

    checkSystem();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // Animated loading feedback
  const loadingSteps = [
    "Parsing technical keywords and required domain components...",
    "Evaluating team hour capacity vs. project workload...",
    "Auditing compute infrastructure against VRAM requirements...",
    "Checking regulatory and clinical data access barriers...",
    "Synthesizing deterministic feasibility and defense pivot...",
  ];

  useEffect(() => {
    let intervalId;
    if (isLoading) {
      setLoadingStep(0);
      intervalId = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingSteps.length);
      }, 700);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

  const handleRunRealityCheck = async () => {
    setIsLoading(true);
    setApiError("");

    const response = await submitRealityCheck(profile, rawIdea);

    setIsLoading(false);

    if (response.success) {
      setRealityCheckResult(response.data);
      setCurrentView('reality-check');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setApiError(response.error);
    }
  };

  const handleResetToOnboarding = () => {
    setCurrentView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      
      {/* Top Header */}
      <Header 
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
        activeTab={currentView}
        setActiveTab={setCurrentView}
        geminiStatus={geminiStatus}
      />

      {/* Backend Status Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 18px',
        background: 'rgba(10, 14, 24, 0.7)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot" style={{ background: backendHealthy ? 'var(--emerald-400)' : 'var(--amber-400)' }} />
          <span>
            <strong>Deterministic Core: </strong> 
            {backendHealthy ? 'Active' : 'Connecting...'}
          </span>
          <span style={{ color: 'var(--border-medium)', margin: '0 4px' }}>•</span>
          <span style={{ color: geminiStatus.configured ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
            <strong>Gemini AI: </strong>
            {geminiStatus.configured ? `Active (${geminiStatus.model || 'gemini-flash-lite-latest'})` : 'Deterministic Fallback Mode'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>Milestone 3</span>
          <span style={{ color: '#cbd5e1' }}>Deterministic Foundation + Gemini Flash Reasoning</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ minHeight: '65vh' }}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="glass-panel" style={{ padding: '64px 32px', textAlign: 'center', maxWidth: '640px', margin: '40px auto' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.15)',
              border: '2px solid var(--primary-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Activity size={28} color="var(--primary-500)" className="spin-animation" />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '8px' }}>
              Conducting Project Reality Check
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--cyan-400)', minHeight: '24px' }}>
              {loadingSteps[loadingStep]}
            </p>
          </div>
        )}

        {/* API Error Banner */}
        {apiError && !isLoading && (
          <div style={{
            maxWidth: '880px',
            margin: '0 auto 24px',
            padding: '16px 20px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <AlertCircle size={20} color="var(--rose-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--rose-500)', marginBottom: '4px' }}>
                Reality Check Service Error
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                {apiError}
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRunRealityCheck}
                style={{ marginTop: '12px' }}
              >
                Retry Reality Check
              </button>
            </div>
          </div>
        )}

        {/* ONBOARDING WIZARD VIEW (Default / Home View) */}
        {(currentView !== 'reality-check' || !realityCheckResult) && !isLoading && (
          <OnboardingWizard 
            profile={profile}
            setProfile={setProfile}
            rawIdea={rawIdea}
            setRawIdea={setRawIdea}
            onSubmitRealityCheck={handleRunRealityCheck}
            isLoading={isLoading}
          />
        )}

        {/* REALITY CHECK RESULT VIEW */}
        {currentView === 'reality-check' && !isLoading && realityCheckResult && (
          <RealityCheckView 
            result={realityCheckResult}
            rawIdea={rawIdea}
            studentProfile={profile}
            onReset={handleResetToOnboarding}
            onEditConstraints={handleResetToOnboarding}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{ 
        padding: '20px 28px', 
        marginTop: '32px',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
            Forge<span className="text-gradient">Grad</span> AI
          </span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
            • Google PromptWars 2026 Edition • Milestone 3 Gemini Intelligence Layer
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            Deterministic Foundation • Gemini Flash Architecture
          </span>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {}}
      />

      {/* Prompt Architecture Inspector Modal */}
      <PromptInspectorModal 
        isOpen={isPromptInspectorOpen}
        onClose={() => setIsPromptInspectorOpen(false)}
      />

    </div>
  );
}
