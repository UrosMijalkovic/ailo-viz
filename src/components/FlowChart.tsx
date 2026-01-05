'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { FunnelData, FlowNode as FlowNodeType } from '@/types/funnel';
import FlowNode from './FlowNode';
import FlowConnector from './FlowConnector';

interface FlowChartProps {
  funnel: FunnelData;
  allFunnels?: FunnelData[];
  onFunnelChange?: (funnelId: string) => void;
  onNodeClick?: (node: FlowNodeType) => void;
  activeNodeId?: string | null;
  highlightedPath?: string[];
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

// Trust level colors
const getTrustColor = (trustLevel: string) => {
  switch (trustLevel) {
    case 'ultra': return 'var(--trust-ultra)';
    case 'warm': return 'var(--trust-warm)';
    case 'cold': return 'var(--trust-cold)';
    default: return 'var(--score-mid)';
  }
};

export default function FlowChart({
  funnel,
  allFunnels = [],
  onFunnelChange,
  onNodeClick,
  activeNodeId,
  highlightedPath = [],
}: FlowChartProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Get the trust color for this funnel
  const trustColor = getTrustColor(funnel.trustLevel);

  // Reset transform when funnel changes
  useEffect(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, [funnel.id]);

  // Identify entry nodes
  const entryNodeIds = useMemo(() => {
    const hasIncoming = new Set(funnel.connections.map((c) => c.to));
    return new Set(funnel.nodes.filter((n) => n.type === 'entry' || !hasIncoming.has(n.id)).map(n => n.id));
  }, [funnel]);

  // Calculate node positions - entry nodes centered and prominent
  const nodePositions = useMemo(() => {
    const positions: Map<string, NodePosition> = new Map();
    const { nodes, connections } = funnel;

    const adjacency = new Map<string, string[]>();
    connections.forEach((conn) => {
      if (!adjacency.has(conn.from)) {
        adjacency.set(conn.from, []);
      }
      adjacency.get(conn.from)!.push(conn.to);
    });

    // Assign levels using BFS from entry nodes
    const levels = new Map<string, number>();
    const entryNodes = nodes.filter(n => entryNodeIds.has(n.id));
    const queue: { id: string; level: number }[] = entryNodes.map((n) => ({
      id: n.id,
      level: 0,
    }));
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const existingLevel = levels.get(id);
      if (existingLevel === undefined || level > existingLevel) {
        levels.set(id, level);
      }

      const children = adjacency.get(id) || [];
      children.forEach((childId) => {
        if (!visited.has(childId)) {
          queue.push({ id: childId, level: level + 1 });
        }
      });
    }

    // Handle orphan nodes
    nodes.forEach((node) => {
      if (!levels.has(node.id)) {
        levels.set(node.id, 0);
      }
    });

    // Group by level
    const levelGroups = new Map<number, string[]>();
    levels.forEach((level, nodeId) => {
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)!.push(nodeId);
    });

    const horizontalSpacing = 200;
    const verticalSpacing = 110;

    // Position nodes - entry nodes get special treatment
    levelGroups.forEach((nodeIds, level) => {
      const groupHeight = (nodeIds.length - 1) * verticalSpacing;
      const startY = -groupHeight / 2;

      nodeIds.forEach((nodeId, index) => {
        positions.set(nodeId, {
          id: nodeId,
          x: level * horizontalSpacing,
          y: startY + index * verticalSpacing,
        });
      });
    });

    // Center the graph
    const allX = Array.from(positions.values()).map((p) => p.x);
    const allY = Array.from(positions.values()).map((p) => p.y);

    if (allX.length === 0 || allY.length === 0) {
      return positions;
    }

    const minX = Math.min(...allX);
    const minY = Math.min(...allY);

    const paddingX = 120;
    const paddingY = 80;

    positions.forEach((pos) => {
      pos.x = pos.x - minX + paddingX;
      pos.y = pos.y - minY + paddingY;
    });

    return positions;
  }, [funnel, entryNodeIds]);

  // Zoom handlers
  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setTransform((prev) => {
      const newScale = Math.min(Math.max(prev.scale + delta, 0.5), 3);
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta, e.clientX, e.clientY);
  }, [handleZoom]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  const isConnectionHighlighted = (from: string, to: string) => {
    if (highlightedPath.length === 0) return true;
    const fromIdx = highlightedPath.indexOf(from);
    const toIdx = highlightedPath.indexOf(to);
    return fromIdx !== -1 && toIdx !== -1 && toIdx === fromIdx + 1;
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (highlightedPath.length === 0) return true;
    return highlightedPath.includes(nodeId);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Flow Navigation Bar */}
      {allFunnels.length > 0 && (
        <div
          className="flex-shrink-0 px-4 py-3 flex items-center gap-2 overflow-x-auto"
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wider mr-2 flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            Flows
          </span>
          {allFunnels.map((f) => {
            const isActive = f.id === funnel.id;
            const trustColor = getTrustColor(f.trustLevel);
            return (
              <button
                key={f.id}
                onClick={() => onFunnelChange?.(f.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${trustColor}20, ${trustColor}10)`
                    : 'var(--bg-tertiary)',
                  border: isActive
                    ? `2px solid ${trustColor}`
                    : '1px solid var(--border-default)',
                  color: isActive ? trustColor : 'var(--text-secondary)',
                  boxShadow: isActive
                    ? `0 0 20px ${trustColor}30, inset 0 0 20px ${trustColor}10`
                    : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: trustColor,
                    boxShadow: isActive ? `0 0 8px ${trustColor}` : 'none',
                  }}
                />
                <span className="whitespace-nowrap">{f.shortName || f.name}</span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ marginLeft: '4px' }}
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[400px] overflow-hidden"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Zoom Controls */}
        <div
          className="absolute top-4 right-4 flex flex-col gap-2 z-10"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleZoom(0.2)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={resetView}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
            title="Reset View"
          >
            ⟲
          </button>
          <div
            className="w-10 h-8 rounded-lg flex items-center justify-center text-xs font-mono"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            {Math.round(transform.scale * 100)}%
          </div>
        </div>

        {/* Instructions */}
        <div
          className="absolute top-4 left-4 text-xs z-10 px-3 py-2 rounded-lg"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          Scroll to zoom • Drag to pan
        </div>

      <svg
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      >
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--accent-gold)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="entryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Transform group for pan/zoom */}
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
          style={{ transformOrigin: 'center center' }}
        >
        {/* Render connections */}
        <g className="connections">
          {funnel.connections.map((connection) => {
            const fromPos = nodePositions.get(connection.from);
            const toPos = nodePositions.get(connection.to);

            if (!fromPos || !toPos) return null;

            const isHighlighted = isConnectionHighlighted(
              connection.from,
              connection.to
            );
            const isHovered =
              hoveredNodeId === connection.from ||
              hoveredNodeId === connection.to;

            // Check if this connection is from an entry node
            const isFromEntry = entryNodeIds.has(connection.from);

            return (
              <FlowConnector
                key={`${connection.from}-${connection.to}`}
                connection={connection}
                fromX={fromPos.x + (isFromEntry ? 80 : 60)}
                fromY={fromPos.y}
                toX={toPos.x - 60}
                toY={toPos.y}
                isActive={isHighlighted && (isHovered || !hoveredNodeId)}
              />
            );
          })}
        </g>

        {/* Render nodes */}
        <g className="nodes">
          {funnel.nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            const isHighlighted = isNodeHighlighted(node.id);
            const isActive = activeNodeId === node.id;
            const isEntry = entryNodeIds.has(node.id);

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  opacity: isHighlighted || !highlightedPath.length ? 1 : 0.3,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <FlowNode
                  node={node}
                  x={pos.x}
                  y={pos.y}
                  isActive={isActive}
                  isHighlighted={hoveredNodeId === node.id}
                  isEntry={isEntry}
                  entryColor={isEntry ? trustColor : undefined}
                  onClick={() => onNodeClick?.(node)}
                />
              </g>
            );
          })}
        </g>

        {/* CRM Spine indicator */}
        <g className="crm-spine">
          {funnel.nodes
            .filter((n) => n.isCRM)
            .map((node) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;
              return (
                <g key={`crm-indicator-${node.id}`}>
                  <line
                    x1={pos.x}
                    y1={pos.y + 35}
                    x2={pos.x}
                    y2={pos.y + 60}
                    stroke="var(--crm-accent)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    opacity="0.5"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 75}
                    textAnchor="middle"
                    fill="var(--crm-accent)"
                    fontSize="9"
                    fontWeight="500"
                    opacity="0.7"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    CRM WRITE
                  </text>
                </g>
              );
            })}
        </g>
        </g>
      </svg>

        {/* Legend */}
        <div
          className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs z-10 px-3 py-2 rounded-lg"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
                border: '2px solid var(--accent-gold)'
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Entry Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--score-high)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>High Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--score-mid)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Mid Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--score-low)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Low Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--crm-accent)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>CRM</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--accent-gold)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
