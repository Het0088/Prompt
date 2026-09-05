import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  RefreshCw, 
  Award, 
  BookOpen, 
  Download,
  Share2
} from 'lucide-react';
import { generateIEEESynopsis } from '../services/geminiService';

export default function SynopsisExporter({ project }) {
  const [synopsisMarkdown, setSynopsisMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!project) return;
    loadSynopsis();
  }, [project]);

  const loadSynopsis = async () => {
    setIsLoading(true);
    try {
      const doc = await generateIEEESynopsis(project);
      setSynopsisMarkdown(doc);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(synopsisMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!project) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Project Selected</h3>
        <p style={{ color: 'var(--text-tertiary)' }}>Please generate or select a project first to export the IEEE synopsis.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action Bar */}
      <div className="glass-panel no-print" style={{ padding: '20px 28px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-emerald">
                <Award size={13} color="var(--emerald-400)" />
                IEEE Format Compliant
              </span>
              <span className="badge badge-indigo">
                Capstone Submission Ready
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#ffffff' }}>
              Official Academic Project Synopsis Document
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Formatted for final year committee review, thesis synopsis, and conference submission
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={loadSynopsis}
              disabled={isLoading}
              title="Regenerate proposal with Gemini"
            >
              <RefreshCw size={14} className={isLoading ? "spin-animation" : ""} />
              <span>Regenerate</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleCopy}
              title="Copy Markdown to Clipboard"
            >
              {copied ? <Check size={14} color="var(--emerald-400)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              title="Print to PDF or paper for submission"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
          </div>

        </div>
      </div>

      {/* Document Paper Container */}
      <div 
        className="glass-panel synopsis-print-container" 
        style={{ 
          padding: '44px 54px', 
          borderRadius: 'var(--radius-xl)', 
          background: 'rgba(15, 19, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <span className="pulse-dot" style={{ background: 'var(--cyan-400)', width: '12px', height: '12px' }} />
            <p style={{ marginTop: '16px', color: 'var(--cyan-400)', fontSize: '0.95rem' }}>
              Synthesizing formal IEEE academic synopsis with problem formulation...
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* University Header Block */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.15)', paddingBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                Department of Computer Science & Engineering / AI & Data Science
              </div>
              <h1 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '12px 0 6px', letterSpacing: '-0.01em' }}>
                {project.title}
              </h1>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                A Final Year Capstone Project Synopsis Submitted in Partial Fulfillment of the Degree of Bachelor of Technology
              </div>
            </div>

            {/* Rendered Academic Synopsis Body */}
            <div style={{ 
              fontFamily: "'Times New Roman', Times, serif, 'Plus Jakarta Sans'", 
              color: '#e2e8f0', 
              lineHeight: 1.7,
              fontSize: '1.02rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {synopsisMarkdown}
              </div>
            </div>

            {/* Signature / Approval Footer for Viva Committee */}
            <div style={{ 
              marginTop: '40px', 
              paddingTop: '24px', 
              borderTop: '1px solid rgba(255,255,255,0.15)', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ height: '50px' }}></div>
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.3)', paddingTop: '6px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  Student Candidate(s)
                </div>
              </div>
              <div>
                <div style={{ height: '50px' }}></div>
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.3)', paddingTop: '6px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  Internal Project Guide
                </div>
              </div>
              <div>
                <div style={{ height: '50px' }}></div>
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.3)', paddingTop: '6px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  External Examiner / HoD
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
