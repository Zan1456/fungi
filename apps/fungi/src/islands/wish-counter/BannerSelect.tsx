import { bannerTypeKeys, type BannerTypeKey } from '@lib/wishTypes';

export interface BannerSelectProps {
  value: BannerTypeKey;
  onChange: (value: BannerTypeKey) => void;
  labels: Record<BannerTypeKey, string>;
}

export function BannerSelect({ value, onChange, labels }: BannerSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {bannerTypeKeys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            value === key ? 'border-foreground bg-foreground text-background' : 'border-border text-muted hover:text-foreground'
          }`}
        >
          {labels[key]}
        </button>
      ))}
    </div>
  );
}
