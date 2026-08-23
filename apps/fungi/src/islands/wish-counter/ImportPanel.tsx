import { useRef, useState, type ChangeEvent } from 'react';
import { useStore } from '@nanostores/react';
import { importWishesFromUrl } from '@lib/wishImport';
import { wishHistory, mergeWishItems, clearBanner, replaceAll } from '@stores/wishHistory';
import type { BannerTypeKey } from '@lib/wishTypes';

export interface ImportPanelLabels {
  urlLabel: string;
  urlPlaceholder: string;
  importButton: string;
  importing: string;
  importErrorPrefix: string;
  exportButton: string;
  importJsonButton: string;
  clearButton: string;
  clearConfirm: string;
  manualTitle: string;
  manualName: string;
  manualRarity: string;
  manualDate: string;
  manualAddButton: string;
}

export interface ImportPanelProps {
  bannerType: BannerTypeKey;
  labels: ImportPanelLabels;
}

export function ImportPanel({ bannerType, labels }: ImportPanelProps) {
  const history = useStore(wishHistory);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [manualName, setManualName] = useState('');
  const [manualRarity, setManualRarity] = useState<3 | 4 | 5>(5);
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().slice(0, 16));

  async function handleImport() {
    if (!url.trim()) return;
    setBusy(true);
    setStatus(null);
    try {
      const summary = await importWishesFromUrl(url.trim());
      setStatus(`+${summary.imported}`);
      setUrl('');
    } catch (err) {
      setStatus(`${labels.importErrorPrefix}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `fungi-wish-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      replaceAll(JSON.parse(text));
      setStatus('OK');
    } catch (err) {
      setStatus(`${labels.importErrorPrefix}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      e.target.value = '';
    }
  }

  function handleClear() {
    if (window.confirm(labels.clearConfirm)) {
      clearBanner(bannerType);
    }
  }

  function handleManualAdd() {
    if (!manualName.trim()) return;
    mergeWishItems(bannerType, [
      {
        id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'character',
        itemId: manualName.trim().toLowerCase().replace(/\s+/g, '_'),
        name: manualName.trim(),
        rarity: manualRarity,
        bannerType,
        time: new Date(manualDate).toISOString(),
      },
    ]);
    setManualName('');
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-muted-2">{labels.urlLabel}</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={labels.urlPlaceholder}
            className="h-10 flex-1 rounded-md border border-border bg-transparent px-3 text-sm text-foreground placeholder:text-muted-2 focus:border-border-hover focus:outline-none"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={busy}
            className="h-10 shrink-0 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-white/90 disabled:opacity-50"
          >
            {busy ? labels.importing : labels.importButton}
          </button>
        </div>
        {status && <p className="mt-2 text-xs text-muted">{status}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          {labels.exportButton}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          {labels.importJsonButton}
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-danger"
        >
          {labels.clearButton}
        </button>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-xs uppercase tracking-wide text-muted-2">{labels.manualTitle}</h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-muted">{labels.manualName}</label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-transparent px-2 text-sm text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">{labels.manualRarity}</label>
            <select
              value={manualRarity}
              onChange={(e) => setManualRarity(Number(e.target.value) as 3 | 4 | 5)}
              className="h-9 rounded-md border border-border bg-transparent px-2 text-sm text-foreground"
            >
              <option value={5} className="bg-background">
                5★
              </option>
              <option value={4} className="bg-background">
                4★
              </option>
              <option value={3} className="bg-background">
                3★
              </option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">{labels.manualDate}</label>
            <input
              type="datetime-local"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              className="h-9 rounded-md border border-border bg-transparent px-2 text-sm text-foreground"
            />
          </div>
          <button
            type="button"
            onClick={handleManualAdd}
            className="h-9 shrink-0 rounded-md border border-border px-3 text-sm text-foreground hover:border-border-hover"
          >
            {labels.manualAddButton}
          </button>
        </div>
      </div>
    </div>
  );
}
