import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  Calendar, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Flame,
  Award
} from 'lucide-react';

export default function ProjectBlueprint({ project, onNavigateToViva, onNavigateToSynopsis }) {
  // Checkbox tracking for student's 16-week progress
  const [completedPhases, setCompletedPhases] = useState({});

  if (!project) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Project Selected</h3>
        <p style={{ color: 'var(--text-tertiary)' }}>Please generate or pick an idea from the Generator tab.</p>
      </div>
    );
  }

  const togglePhase = (index) => {
    setCompletedPhases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const completedCount = Object.values(completedPhases).filter(Boolean).length;
  const totalPhases = project.roadmap?.length || 6;
  const progressPercent = Math.round((completedCount / totalPhases) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-cyan">{project.domain}</span>
              <span className="badge badge-indigo">{project.branch}</span>
              <span className="badge badge-emerald">Novelty: {project.noveltyScore}%</span>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#ffffff' }}>
              {project.title}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {project.summary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-accent-cyan" 
              onClick={onNavigateToViva}
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <Flame size={16} />
              <span>Practice Viva Defense</span>
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onNavigateToSynopsis}
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <Award size={16} />
              <span>Export IEEE Synopsis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive System Architecture Pipeline */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} color="var(--primary-500)" />
              End-to-End System Architecture
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              Decoupled, edge-resilient micro-architecture designed for undergraduate defense scrutiny
            </p>
          </div>
          <span className="badge badge-indigo">Distributed Pipeline</span>
        </div>

        {/* Pipeline Flow Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '16px',
          position: 'relative'
        }}>
          
          {/* Layer 1: Ingestion / Client */}
          <div style={{ 
            background: 'rgba(10, 14, 24, 0.8)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '6px' }}>
                <Server size={16} color="#818cf8" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                Layer 1: Ingestion / Client
              </span>
            </div>
            <h4 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>
              Telemetry & Web Client
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {project.architecture?.client || project.techStack?.frontend || "Client interface collecting telemetry & streaming to edge via secure WebSockets"}
            </p>
          </div>

          {/* Layer 2: Gateway */}
          <div style={{ 
            background: 'rgba(10, 14, 24, 0.8)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '6px' }}>
                <ShieldCheck size={16} color="var(--cyan-400)" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                Layer 2: Gateway & Auth
              </span>
            </div>
            <h4 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>
              API & Cryptographic Auth
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {project.architecture?.gateway || "FastAPI asynchronous broker with mTLS token authentication and packet validation"}
            </p>
          </div>

          {/* Layer 3: Algorithmic Core */}
          <div style={{ 
            background: 'rgba(10, 14, 24, 0.8)', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '6px' }}>
                <Cpu size={16} color="var(--emerald-400)" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase' }}>
                Layer 3: Core Algorithm
              </span>
            </div>
            <h4 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>
              The Novel Twist Engine
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
              {project.architecture?.orchestration || project.unfairTwist}
            </p>
          </div>

          {/* Layer 4: Storage / Proofs */}
          <div style={{ 
            background: 'rgba(10, 14, 24, 0.8)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '6px' }}>
                <Database size={16} color="var(--purple-500)" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--purple-500)', textTransform: 'uppercase' }}>
                Layer 4: Data & Audit
              </span>
            </div>
            <h4 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>
              Persistence & Proofs
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {project.architecture?.storage || project.techStack?.database || "PostgreSQL with vector embeddings and append-only audit trail"}
            </p>
          </div>

        </div>
      </div>

      {/* Tech Stack Breakdown Table */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--cyan-400)" />
          Technology Stack Specifications
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {project.techStack && Object.entries(project.techStack).map(([layer, tools]) => (
            <div 
              key={layer}
              style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px' }}>
                {layer}
              </div>
              <div style={{ fontSize: '0.92rem', color: '#cbd5e1', fontWeight: 600 }}>
                {tools}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Datasets & Benchmark Matrix */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--emerald-400)" />
              Verified Public Datasets & Benchmark Sources
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              Open-access datasets ready for academic literature review and baseline experimentation
            </p>
          </div>
          <span className="badge badge-emerald">Verified Open Access</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {project.datasets?.map((ds, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(10, 14, 24, 0.6)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '4px' }}>
                  {ds.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong>Scale:</strong> {ds.size}
                  </span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                    {ds.type}
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                    {ds.license}
                  </span>
                </div>
              </div>

              {ds.url && (
                <a 
                  href={ds.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Access Corpus</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 16-Week Capstone Roadmap with Milestone Checkbox Tracker */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--purple-500)" />
              16-Week Final Year Capstone Roadmap
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              Step-by-step SDLC deliverables aligned with university semester review milestones
            </p>
          </div>

          {/* Progress Bar & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                {completedCount} of {totalPhases} Phases Complete
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {progressPercent}% Semester Progress
              </div>
            </div>
            <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--grad-primary)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {project.roadmap?.map((item, idx) => {
            const isDone = Boolean(completedPhases[idx]);

            return (
              <div 
                key={idx}
                onClick={() => togglePhase(idx)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '14px', 
                  padding: '16px', 
                  background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(10, 14, 24, 0.5)',
                  border: '1px solid',
                  borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: isDone ? 'var(--emerald-400)' : 'var(--text-tertiary)' }}>
                  {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: isDone ? 'var(--emerald-400)' : '#818cf8',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {item.week}
                    </span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {item.phase}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: isDone ? 'var(--text-tertiary)' : 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.task}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
