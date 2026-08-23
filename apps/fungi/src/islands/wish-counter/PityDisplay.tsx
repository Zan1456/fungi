import { SOFT_PITY_4, SOFT_PITY_5, type PityCounts } from '@lib/pity';

export interface PityDisplayLabels {
  pity4: string;
  pity5: string;
}

export interface PityDisplayProps {
  pity: PityCounts;
  labels: PityDisplayLabels;
}

export function PityDisplay({ pity, labels }: PityDisplayProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <PityMeter label={labels.pity5} count={pity.pity5} soft={SOFT_PITY_5} hard={90} />
      <PityMeter label={labels.pity4} count={pity.pity4} soft={SOFT_PITY_4} hard={10} />
    </div>
  );
}

function PityMeter({ label, count, soft, hard }: { label: string; count: number; soft: number; hard: number }) {
  const pct = Math.min(100, (count / hard) * 100);
  const inSoftPity = count >= soft;
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-2">{label}</span>
        <span className="font-mono text-2xl text-foreground">{count}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${inSoftPity ? 'bg-accent' : 'bg-foreground/70'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
