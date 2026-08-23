import { ElementIcon, type ElementId } from '@fungi/ui/react/ElementIcon.tsx';
import { WeaponIcon, type WeaponType } from '@fungi/ui/react/WeaponIcon.tsx';
import { RarityStars } from '@fungi/ui/react/RarityStars.tsx';
import { CharacterPortrait } from '@fungi/ui/react/CharacterPortrait.tsx';

export interface CharacterSummary {
  id: string;
  name: string;
  rarity: number;
  element: ElementId;
  weapon: WeaponType;
}

export interface CharacterCardProps {
  character: CharacterSummary;
  href: string;
}

export function CharacterCard({ character, href }: CharacterCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-surface/60 p-3 transition-colors hover:border-border-hover"
    >
      <div className="relative">
        <CharacterPortrait id={character.id} name={character.name} size={96} className="aspect-square w-full" />
        <ElementIcon element={character.element} size={26} className="absolute right-1.5 top-1.5" />
      </div>
      <div>
        <div className="truncate font-medium text-foreground">{character.name}</div>
        <div className="mt-1 flex items-center justify-between">
          <RarityStars rarity={character.rarity} />
          <WeaponIcon type={character.weapon} size={18} />
        </div>
      </div>
    </a>
  );
}
