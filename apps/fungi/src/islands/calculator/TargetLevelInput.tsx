export interface RangeInputProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

/** A paired current->target stepper, reused for ascension phases and talent levels. */
export function RangeInput({ label, min, max, value, onChange }: RangeInputProps) {
  const [current, target] = value;
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted">{label}</span>
      <select
        value={current}
        onChange={(e) => onChange([Number(e.target.value), target])}
        className="rounded border border-border bg-transparent px-1 py-0.5 text-foreground"
      >
        {options.map((n) => (
          <option key={n} value={n} className="bg-background">
            {n}
          </option>
        ))}
      </select>
      <span className="text-muted-2">→</span>
      <select
        value={target}
        onChange={(e) => onChange([current, Number(e.target.value)])}
        className="rounded border border-border bg-transparent px-1 py-0.5 text-foreground"
      >
        {options.map((n) => (
          <option key={n} value={n} className="bg-background">
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
