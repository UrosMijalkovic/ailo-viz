'use client';

import { useState } from 'react';
import { GlobalPrinciple } from '@/types/funnel';

interface GlobalPrinciplesProps {
  principles: GlobalPrinciple[];
}

export default function GlobalPrinciples({ principles }: GlobalPrinciplesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Collapsed view in sidebar */}
      <div
        className="px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-5 rounded-full"
              style={{ background: 'var(--crm-accent)' }}
            />
            <span
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Global Principles
            </span>
          </div>
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-muted)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Mini preview */}
        <div className="mt-3 flex gap-1.5">
          {principles.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="w-7 h-7 rounded-md flex items-center justify-center text-xs"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
              }}
              title={p.title}
            >
              {p.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Expanded modal overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl animate-scale-in"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--crm-accent), var(--crm-accent)80)',
                    boxShadow: '0 0 20px var(--crm-glow)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Global Principles
                  </h2>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Core rules that apply across all funnels
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4">
                {principles.map((principle, index) => (
                  <PrincipleCardExpanded key={principle.id} principle={principle} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PrincipleCardExpanded({
  principle,
  index,
}: {
  principle: GlobalPrinciple;
  index: number;
}) {
  return (
    <div
      className="p-4 rounded-xl transition-all duration-300"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 80}ms forwards`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          {principle.icon}
        </div>

        <div className="flex-1">
          <h3
            className="text-base font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {principle.title}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {principle.description}
          </p>
        </div>

        {/* Number badge */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: 'var(--crm-accent)20',
            color: 'var(--crm-accent)',
            border: '1px solid var(--crm-accent)40',
          }}
        >
          {index + 1}
        </div>
      </div>
    </div>
  );
}

