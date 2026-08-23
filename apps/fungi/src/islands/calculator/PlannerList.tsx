import { ElementIcon } from '@fungi/ui/react/ElementIcon.tsx';
import { RangeInput } from './TargetLevelInput';
import type { PlannerEntry } from '@lib/materials';
import type { CharacterSummary } from '@/islands/character-db/CharacterCard';

export interface PlannerListLabels {
  ascension: string;
  normalAttack: string;
  skill: string;
  burst: string;
  remove: string;
  empty: string;
}

export interface PlannerListProps {
  entries: PlannerEntry[];
  characters: CharacterSummary[];
  onRemove: (characterId: string) => void;
  onChange: (characterId: string, patch: Partial<PlannerEntry>) => void;
  labels: PlannerListLabels;
}

export function PlannerList({ entries, characters, onRemove, onChange, labels }: PlannerListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted">{labels.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const character = characters.find((c) => c.id === entry.characterId);
        if (!character) return null;
        return (
          <div key={entry.characterId} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ElementIcon element={character.element} size={24} />
                <span className="font-medium text-foreground">{character.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(entry.characterId)}
                className="text-xs text-muted hover:text-danger"
              >
                {labels.remove}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <RangeInput
                label={labels.ascension}
                min={0}
                max={6}
                value={[entry.currentAscension, entry.targetAscension]}
                onChange={([current, target]) =>
                  onChange(entry.characterId, { currentAscension: current, targetAscension: target })
                }
              />
              <RangeInput
                label={labels.normalAttack}
                min={1}
                max={10}
                value={entry.talents.normal}
                onChange={(normal) => onChange(entry.characterId, { talents: { ...entry.talents, normal } })}
              />
              <RangeInput
                label={labels.skill}
                min={1}
                max={10}
                value={entry.talents.skill}
                onChange={(skill) => onChange(entry.characterId, { talents: { ...entry.talents, skill } })}
              />
              <RangeInput
                label={labels.burst}
                min={1}
                max={10}
                value={entry.talents.burst}
                onChange={(burst) => onChange(entry.characterId, { talents: { ...entry.talents, burst } })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
