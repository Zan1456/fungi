// React counterpart of ../ElementIcon.astro, for use inside client-hydrated islands
// (Astro components can't be rendered from within a React component tree).
export type ElementId = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';

const tint: Record<ElementId, string> = {
  pyro: 'bg-pyro/15 ring-pyro/30',
  hydro: 'bg-hydro/15 ring-hydro/30',
  anemo: 'bg-anemo/15 ring-anemo/30',
  electro: 'bg-electro/15 ring-electro/30',
  dendro: 'bg-dendro/15 ring-dendro/30',
  cryo: 'bg-cryo/15 ring-cryo/30',
  geo: 'bg-geo/15 ring-geo/30',
};

export interface ElementIconProps {
  element: ElementId;
  size?: number;
  className?: string;
}

export function ElementIcon({ element, size = 24, className = '' }: ElementIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${tint[element]} ${className}`}
      style={{ width: size, height: size }}
      title={element}
    >
      <img
        src={`/images/elements/${element}.svg`}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
        alt={element}
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        loading="lazy"
      />
    </span>
  );
}
