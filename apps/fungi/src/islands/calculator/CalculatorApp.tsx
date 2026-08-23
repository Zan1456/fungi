import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { plannerList, addPlannerEntry, removePlannerEntry, updatePlannerEntry } from '@stores/calculatorPlanner';
import { aggregateMaterials } from '@lib/materials';
import { CharacterPickerModal } from './CharacterPickerModal';
import { PlannerList } from './PlannerList';
import { MaterialSummary } from './MaterialSummary';
import type { CharacterSummary } from '@/islands/character-db/CharacterCard';

export interface CalculatorAppLabels {
  addCharacter: string;
  searchPlaceholder: string;
  ascension: string;
  normalAttack: string;
  skill: string;
  burst: string;
  remove: string;
  emptyPlanner: string;
  summaryTitle: string;
  mora: string;
  summaryEmpty: string;
}

export interface CalculatorAppProps {
  characters: CharacterSummary[];
  labels: CalculatorAppLabels;
}

export function CalculatorApp({ characters, labels }: CalculatorAppProps) {
  const entries = useStore(plannerList);
  const [pickerOpen, setPickerOpen] = useState(false);
  const result = useMemo(() => aggregateMaterials(entries), [entries]);
  const availableCharacters = useMemo(
    () => characters.filter((c) => !entries.some((e) => e.characterId === c.id)),
    [characters, entries],
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="mb-4 inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-white/90"
        >
          + {labels.addCharacter}
        </button>
        <PlannerList
          entries={entries}
          characters={characters}
          onRemove={removePlannerEntry}
          onChange={updatePlannerEntry}
          labels={{
            ascension: labels.ascension,
            normalAttack: labels.normalAttack,
            skill: labels.skill,
            burst: labels.burst,
            remove: labels.remove,
            empty: labels.emptyPlanner,
          }}
        />
      </div>
      <MaterialSummary result={result} labels={{ title: labels.summaryTitle, mora: labels.mora, empty: labels.summaryEmpty }} />
      {pickerOpen && (
        <CharacterPickerModal
          characters={availableCharacters}
          searchPlaceholder={labels.searchPlaceholder}
          onSelect={(id) => {
            addPlannerEntry(id);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
