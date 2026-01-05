'use client';

import { FlowNode as FlowNodeType } from '@/types/funnel';

interface FlowNodeProps {
  node: FlowNodeType;
  x: number;
  y: number;
  isActive?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  animationDelay?: number;
}

const nodeStyles = {
  entry: {
    bg: 'var(--bg-elevated)',
    border: 'var(--accent-gold)',
    glow: 'var(--accent-gold-glow)',
    icon: '→',
  },
  action: {
    bg: 'var(--bg-tertiary)',
    border: 'var(--border-default)',
    glow: 'transparent',
    icon: '◆',
  },
  decision: {
    bg: 'var(--bg-tertiary)',
    border: 'var(--accent-gold-dim)',
    glow: 'var(--accent-gold-glow)',
    icon: '◇',
  },
  outcome: {
    bg: 'var(--bg-elevated)',
    border: 'var(--trust-ultra)',
    glow: 'rgba(16, 185, 129, 0.15)',
    icon: '★',
  },
  crm: {
    bg: 'var(--bg-tertiary)',
    border: 'var(--crm-accent)',
    glow: 'var(--crm-glow)',
    icon: '◉',
  },
};

const scoreColors = {
  high: { border: 'var(--score-high)', glow: 'var(--score-high-glow)' },
  mid: { border: 'var(--score-mid)', glow: 'var(--score-mid-glow)' },
  low: { border: 'var(--score-low)', glow: 'var(--score-low-glow)' },
  none: { border: 'var(--border-default)', glow: 'transparent' },
};

export default function FlowNode({
  node,
  x,
  y,
  isActive = false,
  isHighlighted = false,
  onClick,
  animationDelay = 0,
}: FlowNodeProps) {
  const style = nodeStyles[node.type];
  const scoreStyle = node.scoreLevel ? scoreColors[node.scoreLevel] : null;
  const borderColor = scoreStyle?.border || style.border;
  const glowColor = scoreStyle?.glow || style.glow;

  const width = node.type === 'decision' ? 110 : 120;
  const height = node.type === 'decision' ? 55 : 50;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
      }}
      className="flow-node-group"
    >
      {/* Glow effect */}
      {(isActive || isHighlighted) && (
        <rect
          x={-width / 2 - 4}
          y={-height / 2 - 4}
          width={width + 8}
          height={height + 8}
          rx={node.type === 'decision' ? 12 : 10}
          fill="none"
          stroke={borderColor}
          strokeWidth="2"
          opacity="0.3"
          style={{
            filter: `drop-shadow(0 0 12px ${glowColor})`,
          }}
        />
      )}

      {/* Main shape */}
      {node.type === 'decision' ? (
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={8}
          fill={style.bg}
          stroke={borderColor}
          strokeWidth={isActive ? 2 : 1.5}
          style={{
            filter: isActive ? `drop-shadow(0 0 8px ${glowColor})` : undefined,
            transition: 'all 0.3s ease',
          }}
        />
      ) : (
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={8}
          fill={style.bg}
          stroke={borderColor}
          strokeWidth={isActive ? 2 : 1.5}
          style={{
            filter: isActive ? `drop-shadow(0 0 8px ${glowColor})` : undefined,
            transition: 'all 0.3s ease',
          }}
        />
      )}

      {/* Icon indicators */}
      {node.isPayment && (
        <circle
          cx={width / 2 - 8}
          cy={-height / 2 - 5}
          r={8}
          fill="var(--accent-gold)"
          stroke="var(--bg-primary)"
          strokeWidth="2"
        />
      )}
      {node.isCRM && (
        <circle
          cx={width / 2 - 8}
          cy={-height / 2 - 5}
          r={8}
          fill="var(--crm-accent)"
          stroke="var(--bg-primary)"
          strokeWidth="2"
        />
      )}
      {node.isApp && (
        <circle
          cx={width / 2 - 8}
          cy={-height / 2 - 5}
          r={8}
          fill="var(--trust-ultra)"
          stroke="var(--bg-primary)"
          strokeWidth="2"
        />
      )}

      {/* Badge icons */}
      {node.isPayment && (
        <text
          x={width / 2 - 8}
          y={-height / 2 - 2}
          textAnchor="middle"
          fill="var(--bg-primary)"
          fontSize="9"
          fontWeight="bold"
        >
          $
        </text>
      )}
      {node.isCRM && (
        <text
          x={width / 2 - 8}
          y={-height / 2 - 2}
          textAnchor="middle"
          fill="var(--bg-primary)"
          fontSize="8"
          fontWeight="bold"
        >
          C
        </text>
      )}
      {node.isApp && (
        <text
          x={width / 2 - 8}
          y={-height / 2 - 2}
          textAnchor="middle"
          fill="var(--bg-primary)"
          fontSize="9"
        >
          ★
        </text>
      )}

      {/* Label */}
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize="12"
        fontWeight="500"
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        {node.label}
      </text>

      {/* Score indicator bar */}
      {node.scoreLevel && node.scoreLevel !== 'none' && (
        <rect
          x={-width / 2 + 8}
          y={height / 2 - 4}
          width={width - 16}
          height={3}
          rx={1.5}
          fill={scoreStyle?.border}
          opacity={0.8}
        />
      )}

      {/* Hover effect overlay */}
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={8}
        fill="white"
        opacity="0"
        className="hover-overlay"
        style={{
          transition: 'opacity 0.2s ease',
        }}
      />
    </g>
  );
}
