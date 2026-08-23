import { useState } from 'react';
import { ElementIcon } from '@fungi/ui/react/ElementIcon.tsx';
import { RarityStars } from '@fungi/ui/react/RarityStars.tsx';
import type { CharacterSummary } from '@/islands/character-db/CharacterCard';

export interface CharacterPickerModalProps {
  characters: CharacterSummary[];
  onSelect: (id: string) => void;
  onClose: () => void;
  searchPlaceholder: string;
}

export function CharacterPickerModal({ characters, onSelect, onClose, searchPlaceholder }: CharacterPickerModalProps) {
  const [query, setQuery] = useState('');
  const filtered = characters.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-20" onClick={onClose}>
      <div
        className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-background p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="mb-3 h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm text-foreground focus:outline-none"
        />
        <div className="flex flex-col gap-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className="flex items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-white/5"
            >
              <ElementIcon element={c.element} size={24} />
              <span className="flex-1 text-sm text-foreground">{c.name}</span>
              <RarityStars rarity={c.rarity} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
