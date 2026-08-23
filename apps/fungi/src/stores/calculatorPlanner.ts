import { persistentAtom } from '@nanostores/persistent';
import type { PlannerEntry } from '@lib/materials';

export const plannerList = persistentAtom<PlannerEntry[]>('fungi:planner', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addPlannerEntry(characterId: string) {
  const current = plannerList.get();
  if (current.some((e) => e.characterId === characterId)) return;
  plannerList.set([
    ...current,
    {
      characterId,
      currentAscension: 0,
      targetAscension: 6,
      talents: { normal: [1, 10], skill: [1, 10], burst: [1, 10] },
    },
  ]);
}

export function removePlannerEntry(characterId: string) {
  plannerList.set(plannerList.get().filter((e) => e.characterId !== characterId));
}

export function updatePlannerEntry(characterId: string, patch: Partial<PlannerEntry>) {
  plannerList.set(plannerList.get().map((e) => (e.characterId === characterId ? { ...e, ...patch } : e)));
}
