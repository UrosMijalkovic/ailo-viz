'use client';

import { FlowNode, FunnelData } from '@/types/funnel';

interface DetailsPanelProps {
  funnel: FunnelData;
  selectedNode: FlowNode | null;
  onClose: () => void;
}

export default function DetailsPanel({
  funnel,
  selectedNode,
  onClose,
}: DetailsPanelProps) {
  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-8 rounded-full"
            style={{ background: 'var(--accent-gold)' }}
          />
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {selectedNode ? selectedNode.label : funnel.name}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {selectedNode ? `Node Details` : 'Funnel Overview'}
            </p>
          </div>
        </div>
        {selectedNode && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-200"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {selectedNode ? (
          <NodeDetails node={selectedNode} />
        ) : (
          <FunnelOverview funnel={funnel} />
        )}
      </div>
    </div>
  );
}

function NodeDetails({ node }: { node: FlowNode }) {
  const typeLabels = {
    entry: 'Entry Point',
    action: 'Action',
    decision: 'Decision',
    outcome: 'Outcome',
    crm: 'CRM Integration',
  };

  const scoreLabels = {
    high: { label: 'High Score Path', color: 'var(--score-high)' },
    mid: { label: 'Mid Score Path', color: 'var(--score-mid)' },
    low: { label: 'Low Score Path', color: 'var(--score-low)' },
    none: { label: 'Universal', color: 'var(--text-tertiary)' },
  };

  const score = node.scoreLevel ? scoreLabels[node.scoreLevel] : null;

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Type badge */}
      <div className="flex items-center gap-2">
        <span
          className="px-2.5 py-1 rounded-md text-xs font-medium"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          {typeLabels[node.type]}
        </span>
        {score && (
          <span
            className="px-2.5 py-1 rounded-md text-xs font-medium"
            style={{
              background: `${score.color}20`,
              color: score.color,
              border: `1px solid ${score.color}30`,
            }}
          >
            {score.label}
          </span>
        )}
      </div>

      {/* Description */}
      {node.description && (
        <div>
          <h4
            className="text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Description
          </h4>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {node.description}
          </p>
        </div>
      )}

      {/* Details list */}
      {node.details && node.details.length > 0 && (
        <div>
          <h4
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Details
          </h4>
          <ul className="space-y-2">
            {node.details.map((detail, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
                style={{
                  opacity: 0,
                  animation: `slideInRight 0.3s ease-out ${index * 50}ms forwards`,
                }}
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--accent-gold)' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indicators */}
      <div className="pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <h4
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Properties
        </h4>
        <div className="flex flex-wrap gap-2">
          {node.isPayment && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
              style={{
                background: 'var(--accent-gold-glow)',
                color: 'var(--accent-gold)',
                border: '1px solid var(--accent-gold)30',
              }}
            >
              <span>$</span>
              <span>Payment Step</span>
            </div>
          )}
          {node.isCRM && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
              style={{
                background: 'var(--crm-glow)',
                color: 'var(--crm-accent)',
                border: '1px solid var(--crm-accent)30',
              }}
            >
              <span>◉</span>
              <span>CRM Write</span>
            </div>
          )}
          {node.isApp && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--trust-ultra)',
                border: '1px solid var(--trust-ultra)30',
              }}
            >
              <span>★</span>
              <span>App Access</span>
            </div>
          )}
          {!node.isPayment && !node.isCRM && !node.isApp && (
            <div
              className="px-2.5 py-1 rounded-md text-xs"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}
            >
              Standard Node
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FunnelOverview({ funnel }: { funnel: FunnelData }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Description */}
      <div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {funnel.description}
        </p>
      </div>

      {/* Entry type */}
      <div>
        <h4
          className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Entry Type
        </h4>
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {funnel.entryType}
        </p>
      </div>

      {/* Key Rules */}
      <div>
        <h4
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Key Rules
        </h4>
        <ul className="space-y-2.5">
          {funnel.keyRules.map((rule, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-sm"
              style={{
                opacity: 0,
                animation: `slideInRight 0.3s ease-out ${index * 60}ms forwards`,
              }}
            >
              <span
                className="mt-0.5 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  background: 'var(--accent-gold-glow)',
                  color: 'var(--accent-gold)',
                }}
              >
                {index + 1}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <h4
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Structure
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {funnel.nodes.length}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Nodes
            </div>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {funnel.connections.length}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Connections
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
