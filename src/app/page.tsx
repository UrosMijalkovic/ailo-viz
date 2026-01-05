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
  const [showUnifiedMap, setShowUnifiedMap] = useState(false);

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
                <UnifiedMap />
              ) : (
                <FlowChart
                  key={selectedFunnel.id}
                  funnel={selectedFunnel}
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

function UnifiedMap() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div
        className="max-w-4xl w-full p-8 rounded-2xl animate-scale-in"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          className="text-xl font-semibold mb-6 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          Unified Funnel Mental Model
        </h3>

        <div
          className="font-mono text-sm leading-relaxed p-6 rounded-xl"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          <pre className="whitespace-pre-wrap">
            <span style={{ color: 'var(--accent-gold)' }}>SOURCE</span>
            {`
 ├─ `}
            <span style={{ color: 'var(--trust-ultra)' }}>Trusted</span>
            {` (Haleh Personal)
 │   └─ `}
            <span style={{ color: 'var(--accent-gold)' }}>Pay</span>
            {` → Auth → `}
            <span style={{ color: 'var(--trust-ultra)' }}>App</span>
            {`
 │
 ├─ `}
            <span style={{ color: 'var(--trust-warm)' }}>Warm</span>
            {` (Events / Network)
 │   └─ Quiz → Score
 │       ├─ `}
            <span style={{ color: 'var(--score-high)' }}>High</span>
            {` → Pay
 │       ├─ `}
            <span style={{ color: 'var(--score-mid)' }}>Mid</span>
            {` → Call / Webinar
 │       └─ `}
            <span style={{ color: 'var(--score-low)' }}>Low</span>
            {` → `}
            <span style={{ color: 'var(--crm-accent)' }}>CRM</span>
            {`
 │
 ├─ `}
            <span style={{ color: 'var(--trust-cold)' }}>Cold</span>
            {` (Paid / Organic)
 │   └─ Quiz → Score
 │       ├─ `}
            <span style={{ color: 'var(--score-high)' }}>High</span>
            {` → Call → Pay
 │       ├─ `}
            <span style={{ color: 'var(--score-mid)' }}>Mid</span>
            {` → Webinar → Call
 │       └─ `}
            <span style={{ color: 'var(--score-low)' }}>Low</span>
            {` → `}
            <span style={{ color: 'var(--crm-accent)' }}>CRM</span>
            {`
 │
 └─ `}
            <span style={{ color: 'var(--trust-cold)' }}>App</span>
            {`
     ├─ IAP Now
     └─ Quiz Later`}
          </pre>
        </div>

        <div
          className="mt-6 p-4 rounded-lg text-sm"
          style={{
            background: 'var(--accent-gold-glow)',
            border: '1px solid var(--border-accent)',
          }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-gold)' }}>Key insight:</span> All
            paths converge to the CRM. Different entry points, same decision
            engine.
          </p>
        </div>
      </div>
    </div>
  );
}
