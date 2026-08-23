import { useState, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export function Tabs({ items, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const activeItem = items.find((item) => item.id === active) ?? items[0];

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={item.id === active}
            onClick={() => setActive(item.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              item.id === active ? 'border-b-2 border-foreground text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-4">
        {activeItem?.content}
      </div>
    </div>
  );
}
