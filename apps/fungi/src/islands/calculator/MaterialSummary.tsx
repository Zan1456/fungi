import { ItemIcon } from '@fungi/ui/react/ItemIcon';
import type { AggregateResult } from '@lib/materials';

export interface MaterialSummaryLabels {
  title: string;
  mora: string;
  empty: string;
}

export interface MaterialSummaryProps {
  result: AggregateResult;
  labels: MaterialSummaryLabels;
}

export function MaterialSummary({ result, labels }: MaterialSummaryProps) {
  const items = Array.from(result.items.values()).sort((a, b) => (b.item.rarity ?? 0) - (a.item.rarity ?? 0));

  return (
    <div className="h-fit rounded-lg border border-border p-4">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-2">{labels.title}</h2>
      {items.length === 0 && result.mora === 0 ? (
        <p className="text-sm text-muted">{labels.empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{labels.mora}</span>
            <span className="font-mono text-foreground">{result.mora.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-2">
            {items.map(({ item, amount }) => (
              <div key={item.id} className="flex items-center gap-2">
                <ItemIcon id={item.id} name={item.name} size={28} />
                <span className="flex-1 truncate text-sm text-foreground">{item.name}</span>
                <span className="font-mono text-xs text-muted">×{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
