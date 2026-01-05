'use client';

import { useState, useCallback } from 'react';
import { FlowNode } from '@/types/funnel';
import { funnels, globalPrinciples } from '@/data/funnels';
import FlowChart from '@/components/FlowChart';
import FunnelSelector from '@/components/FunnelSelector';
import DetailsPanel from '@/components/DetailsPanel';
import GlobalPrinciples from '@/components/GlobalPrinciples';

export default function Home() {
  const [selectedFunnelId, setSelectedFunnelId] = useState(funnels[0].id);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [showUnifiedMap, setShowUnifiedMap] = useState(true);

  const selectedFunnel = funnels.find((f) => f.id === selectedFunnelId) || funnels[0];

  const handleFunnelSelect = useCallback((funnelId: string) => {
    setSelectedFunnelId(funnelId);
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback((node: FlowNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 glass"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
                color: 'var(--bg-primary)',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              A
            </div>
            <div>
              <h1
                className="text-xl font-semibold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                AILO Funnel Architecture
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Multi-Entry Qualification System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <button
              onClick={() => setShowUnifiedMap(!showUnifiedMap)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              style={{
                background: showUnifiedMap ? 'var(--accent-gold)' : 'var(--bg-tertiary)',
                color: showUnifiedMap ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: `1px solid ${showUnifiedMap ? 'var(--accent-gold)' : 'var(--border-default)'}`,
              }}
            >
              {showUnifiedMap ? 'Individual View' : 'Unified Map'}
            </button>

            {/* Stats */}
            <div
              className="hidden md:flex items-center gap-4 px-4 py-2 rounded-lg"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  5
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Funnels
                </div>
              </div>
              <div
                className="w-px h-8"
                style={{ background: 'var(--border-subtle)' }}
              />
              <div className="text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: 'var(--crm-accent)' }}
                >
                  1
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  CRM
                </div>
              </div>
              <div
                className="w-px h-8"
                style={{ background: 'var(--border-subtle)' }}
              />
              <div className="text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: 'var(--trust-ultra)' }}
                >
                  1
                </div>
                <div
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-20">
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left sidebar - Funnel selector */}
          <aside
            className="w-80 flex-shrink-0 flex flex-col overflow-hidden"
            style={{
              background: 'var(--bg-secondary)',
              borderRight: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex-1 overflow-y-auto p-5">
              <FunnelSelector
                funnels={funnels}
                selectedFunnelId={selectedFunnelId}
                onSelect={handleFunnelSelect}
              />
            </div>

            {/* Global principles at bottom */}
            <GlobalPrinciples principles={globalPrinciples} />
          </aside>

          {/* Center - Flow visualization */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Funnel info bar */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      selectedFunnel.trustLevel === 'ultra'
                        ? 'var(--trust-ultra)'
                        : selectedFunnel.trustLevel === 'warm'
                        ? 'var(--trust-warm)'
                        : selectedFunnel.trustLevel === 'cold'
                        ? 'var(--trust-cold)'
                        : 'var(--score-mid)',
                    boxShadow: `0 0 8px ${
                      selectedFunnel.trustLevel === 'ultra'
                        ? 'var(--trust-ultra)'
                        : selectedFunnel.trustLevel === 'warm'
                        ? 'var(--trust-warm)'
                        : selectedFunnel.trustLevel === 'cold'
                        ? 'var(--trust-cold)'
                        : 'var(--score-mid)'
                    }50`,
                  }}
                />
                <h2
                  className="text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {selectedFunnel.name}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: 'var(--text-muted)' }}>
                  {selectedFunnel.nodes.length} nodes
                </span>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {selectedFunnel.connections.length} connections
                </span>
              </div>
            </div>

            {/* Flow chart container */}
            <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
              {showUnifiedMap ? (
                <UnifiedMap selectedFunnelId={selectedFunnelId} onFunnelSelect={handleFunnelSelect} />
              ) : (
                <FlowChart
                  key={selectedFunnel.id}
                  funnel={selectedFunnel}
                  allFunnels={funnels}
                  onFunnelChange={handleFunnelSelect}
                  onNodeClick={handleNodeClick}
                  activeNodeId={selectedNode?.id}
                />
              )}
            </div>
          </div>

          {/* Right sidebar - Details panel */}
          <aside
            className="w-80 flex-shrink-0 overflow-hidden"
            style={{
              background: 'var(--bg-secondary)',
            }}
          >
            <DetailsPanel
              funnel={selectedFunnel}
              selectedNode={selectedNode}
              onClose={handleCloseDetails}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

function UnifiedMap({ selectedFunnelId, onFunnelSelect }: { selectedFunnelId: string; onFunnelSelect: (id: string) => void }) {
  // Determine which flow to highlight based on selected funnel
  const isUltra = selectedFunnelId === 'funnel-1';
  const isWarm = selectedFunnelId === 'funnel-2';
  const isCold = selectedFunnelId === 'funnel-3';
  const isApp = selectedFunnelId === 'funnel-4';
  const isGeo = selectedFunnelId === 'funnel-5';

  // Base opacity for non-selected elements
  const dimmed = 0.15;
  const normal = 1;

  // Get opacity based on whether this path is part of selected funnel
  const getOpacity = (forFunnels: string[]) => {
    if (forFunnels.includes(selectedFunnelId)) return normal;
    return dimmed;
  };

  return (
    <div className="w-full h-full overflow-auto p-6">
      {/* Flow selector buttons */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          { id: 'funnel-1', label: 'Personal', color: 'var(--trust-ultra)' },
          { id: 'funnel-2', label: 'Events', color: 'var(--trust-warm)' },
          { id: 'funnel-3', label: 'Cold Traffic', color: 'var(--trust-cold)' },
          { id: 'funnel-4', label: 'In-App', color: 'var(--trust-cold)' },
          { id: 'funnel-5', label: 'Geo-Restricted', color: 'var(--score-mid)' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => onFunnelSelect(f.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
            style={{
              background: selectedFunnelId === f.id ? f.color : 'var(--bg-tertiary)',
              color: selectedFunnelId === f.id ? 'white' : 'var(--text-muted)',
              border: `1px solid ${selectedFunnelId === f.id ? f.color : 'var(--border-default)'}`,
              boxShadow: selectedFunnelId === f.id ? `0 0 15px ${f.color}50` : 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <svg width="100%" height="800" viewBox="0 0 900 800" className="mx-auto" style={{ maxWidth: '900px' }}>
        <defs>
          {/* Gradients */}
          <linearGradient id="ultraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--trust-ultra)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--trust-ultra)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="warmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--trust-warm)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--trust-warm)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="coldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--trust-cold)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--trust-cold)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="crmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--crm-accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--crm-accent)" stopOpacity="0.1" />
          </linearGradient>

          {/* Arrow markers */}
          <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
          </marker>
          <marker id="arrowGold" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-gold)" />
          </marker>
          <marker id="arrowUltra" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--trust-ultra)" />
          </marker>
          <marker id="arrowWarm" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--trust-warm)" />
          </marker>
          <marker id="arrowCold" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--trust-cold)" />
          </marker>
        </defs>

        {/* Animated flow style */}
        <style>
          {`
            .flow-path {
              stroke-dasharray: 8 4;
              animation: flowDash 1s linear infinite;
            }
            @keyframes flowDash {
              to { stroke-dashoffset: -12; }
            }
            .pulse-glow {
              animation: pulseGlow 2s ease-in-out infinite;
            }
            @keyframes pulseGlow {
              0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
              50% { filter: drop-shadow(0 0 12px currentColor); }
            }
          `}
        </style>

        {/* Title */}
        <text x="450" y="35" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="600">
          Unified Funnel Architecture
        </text>
        <text x="450" y="55" textAnchor="middle" fill="var(--text-muted)" fontSize="12">
          Click a flow on the left to highlight its path
        </text>

        {/* ===== ENTRY POINTS LAYER ===== */}
        <text x="50" y="100" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="0.1em">
          ENTRY POINTS
        </text>

        {/* Ultra Trust - Personal */}
        <g
          transform="translate(100, 120)"
          opacity={getOpacity(['funnel-1'])}
          style={{ transition: 'opacity 0.3s ease', cursor: 'pointer' }}
          onClick={() => onFunnelSelect('funnel-1')}
          className={isUltra ? 'pulse-glow' : ''}
        >
          <rect x="-4" y="-4" width="148" height="68" rx="14" fill="none" stroke="var(--trust-ultra)" strokeWidth={isUltra ? "3" : "0"} opacity="0.5" />
          <rect x="0" y="0" width="140" height="60" rx="12" fill="url(#ultraGrad)" stroke="var(--trust-ultra)" strokeWidth={isUltra ? "3" : "2"} />
          <text x="70" y="25" textAnchor="middle" fill="var(--trust-ultra)" fontSize="11" fontWeight="700">ULTRA TRUST</text>
          <text x="70" y="42" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Personal Network</text>
        </g>

        {/* Warm Trust - Events */}
        <g
          transform="translate(280, 120)"
          opacity={getOpacity(['funnel-2'])}
          style={{ transition: 'opacity 0.3s ease', cursor: 'pointer' }}
          onClick={() => onFunnelSelect('funnel-2')}
          className={isWarm ? 'pulse-glow' : ''}
        >
          <rect x="-4" y="-4" width="148" height="68" rx="14" fill="none" stroke="var(--trust-warm)" strokeWidth={isWarm ? "3" : "0"} opacity="0.5" />
          <rect x="0" y="0" width="140" height="60" rx="12" fill="url(#warmGrad)" stroke="var(--trust-warm)" strokeWidth={isWarm ? "3" : "2"} />
          <text x="70" y="25" textAnchor="middle" fill="var(--trust-warm)" fontSize="11" fontWeight="700">WARM TRUST</text>
          <text x="70" y="42" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Events / Network</text>
        </g>

        {/* Cold Trust - Paid/Organic */}
        <g
          transform="translate(460, 120)"
          opacity={getOpacity(['funnel-3'])}
          style={{ transition: 'opacity 0.3s ease', cursor: 'pointer' }}
          onClick={() => onFunnelSelect('funnel-3')}
          className={isCold ? 'pulse-glow' : ''}
        >
          <rect x="-4" y="-4" width="148" height="68" rx="14" fill="none" stroke="var(--trust-cold)" strokeWidth={isCold ? "3" : "0"} opacity="0.5" />
          <rect x="0" y="0" width="140" height="60" rx="12" fill="url(#coldGrad)" stroke="var(--trust-cold)" strokeWidth={isCold ? "3" : "2"} />
          <text x="70" y="25" textAnchor="middle" fill="var(--trust-cold)" fontSize="11" fontWeight="700">COLD TRAFFIC</text>
          <text x="70" y="42" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Paid / Organic</text>
        </g>

        {/* In-App */}
        <g
          transform="translate(640, 120)"
          opacity={getOpacity(['funnel-4'])}
          style={{ transition: 'opacity 0.3s ease', cursor: 'pointer' }}
          onClick={() => onFunnelSelect('funnel-4')}
          className={isApp ? 'pulse-glow' : ''}
        >
          <rect x="-4" y="-4" width="148" height="68" rx="14" fill="none" stroke="var(--trust-cold)" strokeWidth={isApp ? "3" : "0"} opacity="0.5" />
          <rect x="0" y="0" width="140" height="60" rx="12" fill="url(#coldGrad)" stroke="var(--trust-cold)" strokeWidth={isApp ? "3" : "2"} />
          <text x="70" y="25" textAnchor="middle" fill="var(--trust-cold)" fontSize="11" fontWeight="700">IN-APP</text>
          <text x="70" y="42" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Existing Users</text>
        </g>

        {/* ===== QUALIFICATION LAYER ===== */}
        <text x="50" y="230" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="0.1em">
          QUALIFICATION
        </text>

        {/* Direct path from Ultra (no quiz needed) */}
        <g opacity={getOpacity(['funnel-1'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path
            d="M 170 180 L 170 270"
            stroke="var(--trust-ultra)"
            strokeWidth={isUltra ? "3" : "2"}
            fill="none"
            className={isUltra ? "flow-path" : ""}
            markerEnd="url(#arrowUltra)"
          />
          <text x="180" y="225" fill="var(--trust-ultra)" fontSize="9">No quiz needed</text>
        </g>

        {/* Quiz box for Warm/Cold */}
        <g
          transform="translate(320, 250)"
          opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-4'])}
          style={{ transition: 'opacity 0.3s ease' }}
        >
          <rect x="0" y="0" width="200" height="50" rx="10" fill="var(--bg-tertiary)" stroke="var(--accent-gold)" strokeWidth="2" />
          <text x="100" y="22" textAnchor="middle" fill="var(--accent-gold)" fontSize="12" fontWeight="600">QUALIFICATION QUIZ</text>
          <text x="100" y="38" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Scoring + Routing</text>
        </g>

        {/* Connections to Quiz */}
        <g opacity={getOpacity(['funnel-2'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 350 180 L 380 250" stroke="var(--trust-warm)" strokeWidth={isWarm ? "3" : "1.5"} className={isWarm ? "flow-path" : ""} markerEnd="url(#arrowWarm)" fill="none" />
        </g>
        <g opacity={getOpacity(['funnel-3'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 530 180 L 480 250" stroke="var(--trust-cold)" strokeWidth={isCold ? "3" : "1.5"} className={isCold ? "flow-path" : ""} markerEnd="url(#arrowCold)" fill="none" />
        </g>
        <g opacity={getOpacity(['funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 710 180 L 520 270" stroke="var(--trust-cold)" strokeWidth={isApp ? "3" : "1.5"} strokeDasharray="4 2" markerEnd="url(#arrowCold)" fill="none" />
        </g>

        {/* ===== SCORE RESULTS ===== */}
        <text x="50" y="360" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="0.1em">
          SCORE RESULT
        </text>

        {/* High Score */}
        <g transform="translate(200, 380)" opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="120" height="45" rx="8" fill="var(--bg-tertiary)" stroke="var(--score-high)" strokeWidth="2" />
          <circle cx="20" cy="22" r="8" fill="var(--score-high)" />
          <text x="70" y="26" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="600">HIGH SCORE</text>
        </g>

        {/* Mid Score */}
        <g transform="translate(360, 380)" opacity={getOpacity(['funnel-2', 'funnel-3'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="120" height="45" rx="8" fill="var(--bg-tertiary)" stroke="var(--score-mid)" strokeWidth="2" />
          <circle cx="20" cy="22" r="8" fill="var(--score-mid)" />
          <text x="70" y="26" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="600">MID SCORE</text>
        </g>

        {/* Low Score */}
        <g transform="translate(520, 380)" opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-5'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="120" height="45" rx="8" fill="var(--bg-tertiary)" stroke="var(--score-low)" strokeWidth="2" />
          <circle cx="20" cy="22" r="8" fill="var(--score-low)" />
          <text x="70" y="26" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="600">LOW SCORE</text>
        </g>

        {/* Quiz to scores */}
        <g opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 370 300 L 260 380" stroke="var(--score-high)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
        </g>
        <g opacity={getOpacity(['funnel-2', 'funnel-3'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 420 300 L 420 380" stroke="var(--score-mid)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
        </g>
        <g opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-5'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 470 300 L 580 380" stroke="var(--score-low)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
        </g>

        {/* ===== WARMING LAYER ===== */}
        <text x="50" y="480" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="0.1em">
          WARMING
        </text>

        {/* Call */}
        <g transform="translate(280, 500)" opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="100" height="40" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-default)" strokeWidth="1.5" />
          <text x="50" y="25" textAnchor="middle" fill="var(--text-primary)" fontSize="11">Founder Call</text>
        </g>

        {/* Webinar */}
        <g transform="translate(420, 500)" opacity={getOpacity(['funnel-2', 'funnel-3'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="100" height="40" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-default)" strokeWidth="1.5" />
          <text x="50" y="25" textAnchor="middle" fill="var(--text-primary)" fontSize="11">Webinar</text>
        </g>

        {/* High to Call (for cold) */}
        <g opacity={getOpacity(['funnel-3'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 260 425 L 260 480 L 280 500" stroke="var(--score-high)" strokeWidth={isCold ? "3" : "1.5"} className={isCold ? "flow-path" : ""} markerEnd="url(#arrowHead)" fill="none" />
          <text x="230" y="465" fill="var(--text-muted)" fontSize="9">Cold: call first</text>
        </g>

        {/* Warm high direct to payment */}
        <g opacity={getOpacity(['funnel-2'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 260 425 L 200 550 L 250 620" stroke="var(--score-high)" strokeWidth={isWarm ? "3" : "1.5"} className={isWarm ? "flow-path" : ""} markerEnd="url(#arrowGold)" fill="none" />
          <text x="180" y="500" fill="var(--trust-warm)" fontSize="9">Warm: direct</text>
        </g>

        {/* Mid to Webinar/Call */}
        <g opacity={getOpacity(['funnel-2', 'funnel-3'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 420 425 L 420 500" stroke="var(--score-mid)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
          <path d="M 470 425 L 470 500" stroke="var(--score-mid)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
        </g>

        {/* ===== PAYMENT LAYER ===== */}
        <text x="50" y="590" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="0.1em">
          CONVERSION
        </text>

        {/* Payment Box */}
        <g transform="translate(250, 610)" opacity={getOpacity(['funnel-1', 'funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="140" height="50" rx="10" fill="var(--bg-elevated)" stroke="var(--accent-gold)" strokeWidth="2" />
          <text x="70" y="22" textAnchor="middle" fill="var(--accent-gold)" fontSize="13" fontWeight="700">💳 PAYMENT</text>
          <text x="70" y="40" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Intentional purchase</text>
        </g>

        {/* Ultra direct to payment */}
        <g opacity={getOpacity(['funnel-1'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path
            d="M 170 280 L 170 630 L 250 635"
            stroke="var(--trust-ultra)"
            strokeWidth={isUltra ? "4" : "2"}
            fill="none"
            className={isUltra ? "flow-path" : ""}
            markerEnd="url(#arrowGold)"
          />
        </g>

        {/* Call to payment */}
        <g opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 330 540 L 320 610" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrowGold)" fill="none" />
        </g>

        {/* ===== CRM SPINE ===== */}
        <g transform="translate(700, 250)">
          <rect x="0" y="0" width="80" height="430" rx="12" fill="url(#crmGrad)" stroke="var(--crm-accent)" strokeWidth="2" strokeDasharray="4 2" />
          <text x="40" y="30" textAnchor="middle" fill="var(--crm-accent)" fontSize="11" fontWeight="700" transform="rotate(90, 40, 30)">CRM SPINE</text>
          <text x="40" y="80" textAnchor="middle" fill="var(--crm-accent)" fontSize="9">Source</text>
          <text x="40" y="140" textAnchor="middle" fill="var(--crm-accent)" fontSize="9">Score</text>
          <text x="40" y="200" textAnchor="middle" fill="var(--crm-accent)" fontSize="9">Status</text>
          <text x="40" y="260" textAnchor="middle" fill="var(--crm-accent)" fontSize="9">Geo</text>
          <text x="40" y="320" textAnchor="middle" fill="var(--crm-accent)" fontSize="9">Next Action</text>
        </g>

        {/* Low score to CRM nurture */}
        <g opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-5'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 640 402 L 700 400" stroke="var(--score-low)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
          <text x="650" y="390" fill="var(--score-low)" fontSize="9">Nurture</text>
        </g>

        {/* ===== OUTCOMES ===== */}
        <text x="50" y="710" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="0.1em">
          OUTCOMES
        </text>

        {/* Premium App */}
        <g transform="translate(250, 720)" opacity={getOpacity(['funnel-1', 'funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="140" height="50" rx="10" fill="var(--bg-elevated)" stroke="var(--trust-ultra)" strokeWidth="2" />
          <text x="70" y="22" textAnchor="middle" fill="var(--trust-ultra)" fontSize="12" fontWeight="700">⭐ PREMIUM APP</text>
          <text x="70" y="40" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Full access granted</text>
        </g>

        {/* CRM Nurture */}
        <g transform="translate(550, 720)" opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-5'])} style={{ transition: 'opacity 0.3s ease' }}>
          <rect x="0" y="0" width="140" height="50" rx="10" fill="var(--bg-tertiary)" stroke="var(--crm-accent)" strokeWidth="2" />
          <text x="70" y="22" textAnchor="middle" fill="var(--crm-accent)" fontSize="12" fontWeight="700">📧 CRM NURTURE</text>
          <text x="70" y="40" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Re-qualify later</text>
        </g>

        {/* Payment to App */}
        <g opacity={getOpacity(['funnel-1', 'funnel-2', 'funnel-3', 'funnel-4'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 320 660 L 320 720" stroke="var(--trust-ultra)" strokeWidth="2" markerEnd="url(#arrowHead)" fill="none" />
        </g>

        {/* Low score to nurture */}
        <g opacity={getOpacity(['funnel-2', 'funnel-3', 'funnel-5'])} style={{ transition: 'opacity 0.3s ease' }}>
          <path d="M 740 680 L 690 720" stroke="var(--crm-accent)" strokeWidth="1.5" markerEnd="url(#arrowHead)" fill="none" />
        </g>

        {/* Legend */}
        <g transform="translate(50, 780)">
          <text x="0" y="0" fill="var(--text-muted)" fontSize="10" fontWeight="600">LEGEND:</text>
          <circle cx="80" cy="-4" r="5" fill="var(--trust-ultra)" />
          <text x="90" y="0" fill="var(--text-muted)" fontSize="9">Ultra Trust</text>
          <circle cx="160" cy="-4" r="5" fill="var(--trust-warm)" />
          <text x="170" y="0" fill="var(--text-muted)" fontSize="9">Warm</text>
          <circle cx="220" cy="-4" r="5" fill="var(--trust-cold)" />
          <text x="230" y="0" fill="var(--text-muted)" fontSize="9">Cold</text>
          <circle cx="280" cy="-4" r="5" fill="var(--crm-accent)" />
          <text x="290" y="0" fill="var(--text-muted)" fontSize="9">CRM</text>
        </g>
      </svg>
    </div>
  );
}
