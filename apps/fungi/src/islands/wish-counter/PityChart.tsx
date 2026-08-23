import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WishItem } from '@lib/wishTypes';

export interface PityChartProps {
  history: WishItem[];
  emptyLabel: string;
  tooltipLabel: string;
}

export function PityChart({ history, emptyLabel, tooltipLabel }: PityChartProps) {
  const sorted = [...history].sort((a, b) => a.time.localeCompare(b.time));
  const data: { index: number; pulls: number }[] = [];
  let counter = 0;
  let fiveStarIndex = 0;
  for (const wish of sorted) {
    counter++;
    if (wish.rarity === 5) {
      fiveStarIndex++;
      data.push({ index: fiveStarIndex, pulls: counter });
      counter = 0;
    }
  }

  if (data.length === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="index" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} width={28} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.06)' }}
            formatter={(value: number) => [value, tooltipLabel]}
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 6,
              fontSize: 12,
              color: '#fafafa',
            }}
          />
          <Bar dataKey="pulls" fill="#fafafa" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
