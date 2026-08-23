import { useMemo, useState, type ReactNode } from 'react';
import { CharacterCard, type CharacterSummary } from './CharacterCard';
import type { ElementId } from '@fungi/ui/react/ElementIcon';
import type { WeaponType } from '@fungi/ui/react/WeaponIcon';

const ELEMENTS: ElementId[] = ['pyro', 'hydro', 'anemo', 'electro', 'dendro', 'cryo', 'geo'];
const WEAPON_TYPES: WeaponType[] = ['sword', 'claymore', 'polearm', 'catalyst', 'bow'];

export interface CharacterGridLabels {
  searchPlaceholder: string;
  all: string;
  noResults: string;
}

export interface CharacterGridProps {
  characters: CharacterSummary[];
  locale: string;
  labels: CharacterGridLabels;
}

export function CharacterGrid({ characters, locale, labels }: CharacterGridProps) {
  const [query, setQuery] = useState('');
  const [element, setElement] = useState<ElementId | null>(null);
  const [weapon, setWeapon] = useState<WeaponType | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return characters.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (element && c.element !== element) return false;
      if (weapon && c.weapon !== weapon) return false;
      return true;
    });
  }, [characters, query, element, weapon]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm text-foreground placeholder:text-muted-2 focus:border-border-hover focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <FilterPill active={element === null} onClick={() => setElement(null)}>
            {labels.all}
          </FilterPill>
          {ELEMENTS.map((el) => (
            <FilterPill key={el} active={element === el} onClick={() => setElement(element === el ? null : el)}>
              {el}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={weapon === null} onClick={() => setWeapon(null)}>
            {labels.all}
          </FilterPill>
          {WEAPON_TYPES.map((w) => (
            <FilterPill key={w} active={weapon === w} onClick={() => setWeapon(weapon === w ? null : w)}>
              {w}
            </FilterPill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">{labels.noResults}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((c) => (
            <CharacterCard key={c.id} character={c} href={`/${locale}/characters/${c.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors ${
        active ? 'border-foreground bg-foreground text-background' : 'border-border text-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
