'use client';

import { FunnelData, TrustLevel } from '@/types/funnel';

interface FunnelSelectorProps {
  funnels: FunnelData[];
  selectedFunnelId: string;
  onSelect: (funnelId: string) => void;
}

const trustColors: Record<TrustLevel, { bg: string; border: string; text: string }> = {
  ultra: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'var(--trust-ultra)',
    text: 'var(--trust-ultra)',
  },
  warm: {
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'var(--trust-warm)',
    text: 'var(--trust-warm)',
  },
  cold: {
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'var(--trust-cold)',
    text: 'var(--trust-cold)',
  },
  'geo-restricted': {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'var(--score-mid)',
    text: 'var(--score-mid)',
  },
};

const trustLabels: Record<TrustLevel, string> = {
  ultra: 'ULTRA TRUST',
  warm: 'WARM',
  cold: 'COLD',
  'geo-restricted': 'GEO-RESTRICTED',
};

export default function FunnelSelector({
  funnels,
  selectedFunnelId,
  onSelect,
}: FunnelSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-1.5 h-6 rounded-full"
          style={{ background: 'var(--accent-gold)' }}
        />
        <span
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Entry Points
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {funnels.map((funnel, index) => {
          const isSelected = funnel.id === selectedFunnelId;
          const trust = trustColors[funnel.trustLevel];

          return (
            <button
              key={funnel.id}
              onClick={() => onSelect(funnel.id)}
              className="relative group text-left transition-all duration-300"
              style={{
                opacity: 0,
                animation: `slideInRight 0.4s ease-out ${index * 80}ms forwards`,
              }}
            >
              <div
                className="relative px-4 py-3 rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  background: isSelected ? trust.bg : 'var(--bg-secondary)',
                  border: `1px solid ${isSelected ? trust.border : 'var(--border-subtle)'}`,
                  boxShadow: isSelected
                    ? `0 0 20px ${trust.bg}, inset 0 1px 0 rgba(255,255,255,0.05)`
                    : 'none',
                }}
              >
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${trust.bg}, transparent)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Funnel number indicator */}
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                        style={{
                          background: isSelected ? trust.border : 'var(--bg-tertiary)',
                          color: isSelected ? 'var(--bg-primary)' : 'var(--text-tertiary)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <div
                          className="text-sm font-medium transition-colors duration-300"
                          style={{
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}
                        >
                          {funnel.shortName}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {funnel.entryType}
                        </div>
                      </div>
                    </div>

                    {/* Trust badge */}
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider"
                      style={{
                        background: trust.bg,
                        color: trust.text,
                        border: `1px solid ${trust.border}`,
                        opacity: isSelected ? 1 : 0.6,
                      }}
                    >
                      {trustLabels[funnel.trustLevel]}
                    </div>
                  </div>
                </div>

                {/* Active indicator line */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r transition-all duration-300"
                  style={{
                    height: isSelected ? '60%' : '0%',
                    background: trust.border,
                    boxShadow: isSelected ? `0 0 8px ${trust.border}` : 'none',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
