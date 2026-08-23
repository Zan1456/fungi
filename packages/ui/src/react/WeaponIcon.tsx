export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'catalyst' | 'bow';

export interface WeaponIconProps {
  type: WeaponType;
  size?: number;
  className?: string;
}

export function WeaponIcon({ type, size = 24, className = '' }: WeaponIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-white/5 ring-1 ring-inset ring-white/10 ${className}`}
      style={{ width: size, height: size }}
      title={type}
    >
      <img
        src={`/images/weapons/types/${type}.svg`}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
        alt={type}
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        loading="lazy"
      />
    </span>
  );
}
