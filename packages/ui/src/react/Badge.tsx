import type { ReactNode } from 'react';

export type BadgeTone = 'default' | 'accent' | 'success' | 'danger' | 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';

const tones: Record<BadgeTone, string> = {
  default: 'border-border text-muted',
  accent: 'border-accent/40 text-accent',
  success: 'border-success/40 text-success',
  danger: 'border-danger/40 text-danger',
  pyro: 'border-pyro/40 text-pyro',
  hydro: 'border-hydro/40 text-hydro',
  anemo: 'border-anemo/40 text-anemo',
  electro: 'border-electro/40 text-electro',
  dendro: 'border-dendro/40 text-dendro',
  cryo: 'border-cryo/40 text-cryo',
  geo: 'border-geo/40 text-geo',
};

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children?: ReactNode;
}

export function Badge({ tone = 'default', className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
