import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Tabs } from '@fungi/ui/Tabs';
import { wishHistory } from '@stores/wishHistory';
import { computePity } from '@lib/pity';
import type { BannerTypeKey } from '@lib/wishTypes';
import { BannerSelect } from './BannerSelect';
import { PityDisplay } from './PityDisplay';
import { ImportPanel, type ImportPanelLabels } from './ImportPanel';
import { HistoryTable, type HistoryTableLabels } from './HistoryTable';
import { PityChart } from './PityChart';

export interface WishCounterAppLabels {
  banners: Record<BannerTypeKey, string>;
  pity4: string;
  pity5: string;
  tabImport: string;
  tabHistory: string;
  tabStats: string;
  chartEmpty: string;
  chartTooltip: string;
  importPanel: ImportPanelLabels;
  history: HistoryTableLabels;
}

export interface WishCounterAppProps {
  labels: WishCounterAppLabels;
}

export function WishCounterApp({ labels }: WishCounterAppProps) {
  const history = useStore(wishHistory);
  const [bannerType, setBannerType] = useState<BannerTypeKey>('character-event');
  const bannerHistory = history[bannerType] ?? [];
  const pity = useMemo(() => computePity(bannerHistory), [bannerHistory]);

  return (
    <div className="flex flex-col gap-6">
      <BannerSelect value={bannerType} onChange={setBannerType} labels={labels.banners} />
      <PityDisplay pity={pity} labels={{ pity4: labels.pity4, pity5: labels.pity5 }} />
      <Tabs
        items={[
          {
            id: 'import',
            label: labels.tabImport,
            content: <ImportPanel bannerType={bannerType} labels={labels.importPanel} />,
          },
          {
            id: 'history',
            label: labels.tabHistory,
            content: <HistoryTable items={bannerHistory} labels={labels.history} />,
          },
          {
            id: 'stats',
            label: labels.tabStats,
            content: <PityChart history={bannerHistory} emptyLabel={labels.chartEmpty} tooltipLabel={labels.chartTooltip} />,
          },
        ]}
      />
    </div>
  );
}
