'use client';

import { FlowNode as FlowNodeType } from '@/types/funnel';

interface FlowNodeProps {
  node: FlowNodeType;
  x: number;
  y: number;
  isActive?: boolean;
  isHighlighted?: boolean;
  isEntry?: boolean;
  entryColor?: string;
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
  isEntry = false,
  entryColor = 'var(--accent-gold)',
  onClick,
  animationDelay = 0,
}: FlowNodeProps) {
  const style = nodeStyles[node.type];
  const scoreStyle = node.scoreLevel ? scoreColors[node.scoreLevel] : null;

  // Entry nodes get special prominent styling with trust color
  const borderColor = isEntry ? entryColor : (scoreStyle?.border || style.border);
  const glowColor = isEntry ? `${entryColor}66` : (scoreStyle?.glow || style.glow);

  // Entry nodes are larger and more prominent
  const width = isEntry ? 160 : (node.type === 'decision' ? 110 : 120);
  const height = isEntry ? 70 : (node.type === 'decision' ? 55 : 50);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
      }}
      className="flow-node-group"
    >
      {/* Entry node outer glow ring - always visible */}
      {isEntry && (
        <>
          {/* Pulsing outer ring */}
          <rect
            x={-width / 2 - 12}
            y={-height / 2 - 12}
            width={width + 24}
            height={height + 24}
            rx={16}
            fill="none"
            stroke={entryColor}
            strokeWidth="1"
            opacity="0.2"
            className="entry-pulse-ring"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          {/* Inner glow background */}
          <rect
            x={-width / 2 - 6}
            y={-height / 2 - 6}
            width={width + 12}
            height={height + 12}
            rx={14}
            fill={`${entryColor}15`}
            stroke={entryColor}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />
        </>
      )}

      {/* Glow effect for active/highlighted */}
      {(isActive || isHighlighted) && (
        <rect
          x={-width / 2 - 4}
          y={-height / 2 - 4}
          width={width + 8}
          height={height + 8}
          rx={isEntry ? 14 : (node.type === 'decision' ? 12 : 10)}
          fill="none"
          stroke={borderColor}
          strokeWidth="2"
          opacity="0.4"
          style={{
            filter: `drop-shadow(0 0 16px ${glowColor})`,
          }}
        />
      )}

      {/* Main shape */}
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={isEntry ? 12 : 8}
        fill={isEntry ? 'var(--bg-elevated)' : style.bg}
        stroke={borderColor}
        strokeWidth={isEntry ? 3 : (isActive ? 2 : 1.5)}
        style={{
          filter: isEntry
            ? `drop-shadow(0 4px 20px ${entryColor}40)`
            : (isActive ? `drop-shadow(0 0 8px ${glowColor})` : undefined),
          transition: 'all 0.3s ease',
        }}
      />

      {/* Entry gradient overlay */}
      {isEntry && (
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={12}
          fill="url(#entryGradient)"
          opacity="0.15"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Entry "START" label */}
      {isEntry && (
        <text
          x={0}
          y={-height / 2 - 18}
          textAnchor="middle"
          fill={entryColor}
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.1em"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          ENTRY POINT
        </text>
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
        y={isEntry ? 0 : 4}
        textAnchor="middle"
        fill={isEntry ? entryColor : 'var(--text-primary)'}
        fontSize={isEntry ? 14 : 12}
        fontWeight={isEntry ? '700' : '500'}
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        {node.label}
      </text>
      {/* Entry description */}
      {isEntry && node.description && (
        <text
          x={0}
          y={18}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          {node.description}
        </text>
      )}

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
