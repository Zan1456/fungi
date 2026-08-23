export interface ItemIconProps {
  id: string;
  name?: string;
  size?: number;
  className?: string;
}

export function ItemIcon({ id, name, size = 32, className = '' }: ItemIconProps) {
  return (
    <img
      src={`/images/items/${id}.png`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/images/placeholder.svg';
      }}
      alt={name ?? id}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-md bg-white/5 object-cover ring-1 ring-inset ring-white/10 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
