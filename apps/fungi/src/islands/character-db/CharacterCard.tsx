import { ElementIcon, type ElementId } from '@fungi/ui/react/ElementIcon';
import { WeaponIcon, type WeaponType } from '@fungi/ui/react/WeaponIcon';
import { RarityStars } from '@fungi/ui/react/RarityStars';

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
      className="group flex flex-col gap-3 rounded-lg border border-border bg-surface/60 p-4 transition-colors hover:border-border-hover"
    >
      <div className="flex items-center justify-between">
        <ElementIcon element={character.element} size={28} />
        <WeaponIcon type={character.weapon} size={22} />
      </div>
      <div>
        <div className="font-medium text-foreground">{character.name}</div>
        <RarityStars rarity={character.rarity} className="mt-1" />
      </div>
    </a>
  );
}
