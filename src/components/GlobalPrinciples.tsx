'use client';

import { GlobalPrinciple } from '@/types/funnel';

interface GlobalPrinciplesProps {
  principles: GlobalPrinciple[];
}

export default function GlobalPrinciples({ principles }: GlobalPrinciplesProps) {
  return (
    <div
      className="px-5 py-4"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-4">
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

      <div className="space-y-2">
        {principles.map((principle, index) => (
          <PrincipleCard key={principle.id} principle={principle} index={index} />
        ))}
      </div>
    </div>
  );
}

function PrincipleCard({
  principle,
  index,
}: {
  principle: GlobalPrinciple;
  index: number;
}) {
  return (
    <div
      className="group relative p-3 rounded-lg transition-all duration-300 cursor-default"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 100}ms forwards`,
      }}
    >
      {/* Hover effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, var(--accent-gold-glow), transparent)',
        }}
      />

      <div className="relative z-10 flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
        >
          {principle.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-medium mb-0.5 truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {principle.title}
          </h4>
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {principle.description}
          </p>
        </div>
      </div>
    </div>
  );
}
