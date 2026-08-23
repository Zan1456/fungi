import type { WishItem } from '@lib/wishTypes';

export interface HistoryTableLabels {
  empty: string;
  name: string;
  rarity: string;
  date: string;
}

export interface HistoryTableProps {
  items: WishItem[];
  labels: HistoryTableLabels;
}

export function HistoryTable({ items, labels }: HistoryTableProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">{labels.empty}</p>;
  }

  const sorted = [...items].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="max-h-[32rem] overflow-y-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-background">
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-2">
            <th className="px-4 py-2 font-medium">{labels.name}</th>
            <th className="px-4 py-2 font-medium">{labels.rarity}</th>
            <th className="px-4 py-2 font-medium">{labels.date}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0">
              <td className="px-4 py-2 text-foreground">{item.name}</td>
              <td className={`px-4 py-2 font-mono ${item.rarity === 5 ? 'text-amber-400' : item.rarity === 4 ? 'text-purple-300' : 'text-muted'}`}>
                {item.rarity}★
              </td>
              <td className="px-4 py-2 font-mono text-xs text-muted">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
