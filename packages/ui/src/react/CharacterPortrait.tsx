export interface CharacterPortraitProps {
  id: string;
  name?: string;
  size?: number;
  className?: string;
}

export function CharacterPortrait({ id, name, size = 64, className = '' }: CharacterPortraitProps) {
  return (
    <img
      src={`/images/characters/${id}.png`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/images/placeholder.svg';
      }}
      alt={name ?? id}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-lg bg-white/5 object-cover ring-1 ring-inset ring-white/10 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
