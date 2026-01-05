'use client';

import { FlowConnection, ScoreLevel } from '@/types/funnel';

interface FlowConnectorProps {
  connection: FlowConnection;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isActive?: boolean;
}

const scoreColors: Record<ScoreLevel | 'default', string> = {
  high: 'var(--score-high)',
  mid: 'var(--score-mid)',
  low: 'var(--score-low)',
  none: 'var(--text-muted)',
  default: 'var(--text-muted)',
};

export default function FlowConnector({
  connection,
  fromX,
  fromY,
  toX,
  toY,
  isActive = false,
}: FlowConnectorProps) {
  const color = connection.scoreLevel
    ? scoreColors[connection.scoreLevel]
    : scoreColors.default;

  // Simple straight line path
  const path = `M ${fromX} ${fromY} L ${toX} ${toY}`;

  // Calculate midpoint for label
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  // Calculate arrow angle
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
  const arrowSize = 8;

  return (
    <g>
      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={isActive ? 2.5 : 2}
        opacity={isActive ? 1 : 0.6}
        strokeLinecap="round"
      />

      {/* Arrow head */}
      <polygon
        points={`0,${-arrowSize / 2} ${arrowSize},0 0,${arrowSize / 2}`}
        fill={color}
        opacity={isActive ? 1 : 0.6}
        transform={`translate(${toX}, ${toY}) rotate(${angle})`}
      />

      {/* Connection label */}
      {connection.label && (
        <g transform={`translate(${midX}, ${midY - 15})`}>
          <rect
            x={-connection.label.length * 4 - 8}
            y={-12}
            width={connection.label.length * 8 + 16}
            height={24}
            rx={4}
            fill="var(--bg-elevated)"
            stroke={color}
            strokeWidth="1"
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fill={color}
            fontSize="11"
            fontWeight="500"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            {connection.label}
          </text>
        </g>
      )}
    </g>
  );
}
