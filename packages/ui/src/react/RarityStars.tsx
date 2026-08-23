export interface RarityStarsProps {
  rarity: number;
  className?: string;
}

export function RarityStars({ rarity, className = '' }: RarityStarsProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rarity} star rarity`} title={`${rarity}★`}>
      {Array.from({ length: rarity }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current text-amber-400">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
