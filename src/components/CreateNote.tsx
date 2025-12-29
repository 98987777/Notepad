import { useState } from 'react';
import { NoteColor, ChecklistItem } from '@/types/note';
import { ColorPicker, colorClasses } from './ColorPicker';
import { cn } from '@/lib/utils';
import { Plus, Palette, ListChecks, X, Square, CheckSquare } from 'lucide-react';

interface CreateNoteProps {
  onAdd: (title: string, content: string, color: NoteColor, checklist: ChecklistItem[], defaultLabels?: string[]) => void;
  defaultLabelId?: string;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const CreateNote = ({ onAdd, defaultLabelId }: CreateNoteProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('default');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const handleSubmit = () => {
    if (title.trim() || content.trim() || checklist.length > 0) {
      const labels = defaultLabelId ? [defaultLabelId] : [];
      onAdd(title, content, color, checklist, labels);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor('default');
    setIsExpanded(false);
    setIsChecklistMode(false);
    setChecklist([]);
    setNewItemText('');
    setShowColorPicker(false);
  };

  const handleClose = () => {
    handleSubmit();
  };

  const addChecklistItem = () => {
    if (newItemText.trim()) {
      setChecklist(prev => [...prev, { id: generateId(), text: newItemText.trim(), checked: false }]);
      setNewItemText('');
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-xl mx-auto rounded-xl note-shadow-hover transition-all duration-300',
        colorClasses[color]
      )}
    >
      {isExpanded ? (
        <div className="p-4 animate-fade-in">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent font-semibold text-lg outline-none placeholder:text-foreground/40 mb-2"
            autoFocus
          />

          {isChecklistMode ? (
            <div className="space-y-2 mb-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button onClick={() => toggleChecklistItem(item.id)}>
                    {item.checked ? (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5 text-foreground/40" />
                    )}
                  </button>
                  <span className={cn('flex-1', item.checked && 'line-through text-foreground/50')}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => removeChecklistItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-foreground/10 rounded transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                  placeholder="Add item"
                  className="flex-1 bg-transparent outline-none placeholder:text-foreground/40"
                />
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Take a note..."
              className="w-full bg-transparent resize-none outline-none min-h-[80px] placeholder:text-foreground/40"
              rows={3}
            />
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/10">
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
                  title="Change color"
                >
                  <Palette className="w-5 h-5 text-foreground/60" />
                </button>
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-2 p-3 bg-card rounded-xl note-shadow-hover z-10 animate-fade-in">
                    <ColorPicker
                      selectedColor={color}
                      onColorSelect={(c) => {
                        setColor(c);
                        setShowColorPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsChecklistMode(!isChecklistMode)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isChecklistMode ? 'bg-primary/20 text-primary' : 'hover:bg-foreground/10 text-foreground/60'
                )}
                title="Toggle checklist"
              >
                <ListChecks className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center gap-3 text-foreground/50 hover:text-foreground/70 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-lg">Take a note...</span>
        </button>
      )}
    </div>
  );
};
