import { Label } from '@/types/note';
import { cn } from '@/lib/utils';
import { StickyNote, Archive, Tag, Plus, X, Check } from 'lucide-react';
import { useState } from 'react';

export type ViewMode = 'notes' | 'archive' | 'label';

interface AppSidebarProps {
  labels: Label[];
  viewMode: ViewMode;
  selectedLabelId: string | null;
  onViewChange: (mode: ViewMode, labelId?: string) => void;
  onAddLabel: (name: string, color: string) => void;
  onDeleteLabel: (id: string) => void;
  noteCounts: {
    notes: number;
    archive: number;
    labels: Record<string, number>;
  };
}

const labelColors = [
  '210 80% 60%',
  '24 95% 55%',
  '280 70% 60%',
  '0 70% 55%',
  '140 60% 45%',
  '175 70% 45%',
];

export const AppSidebar = ({
  labels,
  viewMode,
  selectedLabelId,
  onViewChange,
  onAddLabel,
  onDeleteLabel,
  noteCounts,
}: AppSidebarProps) => {
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(labelColors[0]);

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      onAddLabel(newLabelName, newLabelColor);
      setNewLabelName('');
      setNewLabelColor(labelColors[Math.floor(Math.random() * labelColors.length)]);
      setIsAddingLabel(false);
    }
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/50 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {/* Notes */}
        <button
          onClick={() => onViewChange('notes')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            viewMode === 'notes' && !selectedLabelId
              ? 'bg-primary/15 text-primary font-semibold'
              : 'hover:bg-muted text-foreground/70 hover:text-foreground'
          )}
        >
          <StickyNote className="w-5 h-5" />
          <span className="flex-1 text-left">Notes</span>
          <span className="text-sm opacity-60">{noteCounts.notes}</span>
        </button>

        {/* Archive */}
        <button
          onClick={() => onViewChange('archive')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            viewMode === 'archive'
              ? 'bg-primary/15 text-primary font-semibold'
              : 'hover:bg-muted text-foreground/70 hover:text-foreground'
          )}
        >
          <Archive className="w-5 h-5" />
          <span className="flex-1 text-left">Archive</span>
          <span className="text-sm opacity-60">{noteCounts.archive}</span>
        </button>

        {/* Labels Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-4 mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Labels</h3>
            <button
              onClick={() => setIsAddingLabel(true)}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Add label"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {isAddingLabel && (
            <div className="mx-2 mb-2 p-3 bg-muted rounded-xl animate-fade-in">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                placeholder="Label name"
                className="w-full bg-transparent outline-none text-sm mb-2 placeholder:text-foreground/40"
                autoFocus
              />
              <div className="flex items-center gap-1 mb-2">
                {labelColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewLabelColor(color)}
                    className={cn(
                      'w-5 h-5 rounded-full transition-all',
                      newLabelColor === color && 'ring-2 ring-foreground/40 ring-offset-1'
                    )}
                    style={{ backgroundColor: `hsl(${color})` }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingLabel(false)}
                  className="flex-1 py-1.5 text-sm rounded-lg hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLabel}
                  className="flex-1 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {labels.map((label) => (
              <div
                key={label.id}
                className={cn(
                  'group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer',
                  viewMode === 'label' && selectedLabelId === label.id
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'hover:bg-muted text-foreground/70 hover:text-foreground'
                )}
                onClick={() => onViewChange('label', label.id)}
              >
                <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: `hsl(${label.color})` }} />
                <span className="flex-1 text-left truncate">{label.name}</span>
                <span className="text-sm opacity-60">{noteCounts.labels[label.id] || 0}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLabel(label.id);
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all"
                  title="Delete label"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};
