import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note, NoteColor, Label, ChecklistItem } from '@/types/note';
import { colorClasses, ColorPicker } from './ColorPicker';
import { cn } from '@/lib/utils';
import { Pin, Trash2, Palette, X, Check, GripVertical, Archive, ArchiveRestore, Tag, Square, CheckSquare, Plus } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  labels: Label[];
  onUpdate: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onAddLabel: (noteId: string, labelId: string) => void;
  onRemoveLabel: (noteId: string, labelId: string) => void;
  onToggleChecklistItem: (noteId: string, itemId: string) => void;
  index: number;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const NoteCard = ({
  note,
  labels,
  onUpdate,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onAddLabel,
  onRemoveLabel,
  onToggleChecklistItem,
  index,
}: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editChecklist, setEditChecklist] = useState<ChecklistItem[]>(note.checklist);
  const [newItemText, setNewItemText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: `${index * 50}ms`,
  };

  const handleSave = () => {
    onUpdate(note.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      checklist: editChecklist,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditChecklist(note.checklist);
    setIsEditing(false);
  };

  const handleColorChange = (color: NoteColor) => {
    onUpdate(note.id, { color });
    setShowColorPicker(false);
  };

  const addEditChecklistItem = () => {
    if (newItemText.trim()) {
      setEditChecklist(prev => [...prev, { id: generateId(), text: newItemText.trim(), checked: false }]);
      setNewItemText('');
    }
  };

  const noteLabels = labels.filter(l => note.labels.includes(l.id));
  const availableLabels = labels.filter(l => !note.labels.includes(l.id));
  const checkedCount = note.checklist.filter(i => i.checked).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-xl p-4 note-shadow transition-all duration-200',
        colorClasses[note.color],
        note.isPinned && 'ring-2 ring-primary/30',
        isDragging && 'note-shadow-hover scale-105 z-50 opacity-90 rotate-2',
        !isDragging && 'hover:note-shadow-hover animate-pop-in'
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute top-2 right-2 p-1.5 rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/10',
          isEditing && 'hidden'
        )}
      >
        <GripVertical className="w-4 h-4 text-foreground/50" />
      </div>

      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Pin className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent font-semibold text-lg outline-none placeholder:text-foreground/40"
            autoFocus
          />
          {editChecklist.length > 0 ? (
            <div className="space-y-2">
              {editChecklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group/item">
                  <button
                    onClick={() =>
                      setEditChecklist(prev =>
                        prev.map(i => (i.id === item.id ? { ...i, checked: !i.checked } : i))
                      )
                    }
                  >
                    {item.checked ? (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5 text-foreground/40" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      setEditChecklist(prev =>
                        prev.map(i => (i.id === item.id ? { ...i, text: e.target.value } : i))
                      )
                    }
                    className={cn('flex-1 bg-transparent outline-none', item.checked && 'line-through text-foreground/50')}
                  />
                  <button
                    onClick={() => setEditChecklist(prev => prev.filter(i => i.id !== item.id))}
                    className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-foreground/10 rounded"
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
                  onKeyDown={(e) => e.key === 'Enter' && addEditChecklistItem()}
                  placeholder="Add item"
                  className="flex-1 bg-transparent outline-none placeholder:text-foreground/40"
                />
              </div>
            </div>
          ) : (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Take a note..."
              className="w-full bg-transparent resize-none outline-none min-h-[80px] placeholder:text-foreground/40"
              rows={4}
            />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleCancel} className="p-2 rounded-full hover:bg-foreground/10 transition-colors" title="Cancel">
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleSave} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" title="Save">
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cursor-pointer min-h-[60px] pr-6" onClick={() => setIsEditing(true)}>
            {note.title && <h3 className="font-semibold text-lg mb-2 break-words">{note.title}</h3>}
            
            {note.checklist.length > 0 ? (
              <div className="space-y-1.5">
                {note.checklist.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleChecklistItem(note.id, item.id);
                    }}
                  >
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-foreground/40 shrink-0" />
                    )}
                    <span className={cn('text-sm', item.checked && 'line-through text-foreground/50')}>
                      {item.text}
                    </span>
                  </div>
                ))}
                {note.checklist.length > 5 && (
                  <p className="text-sm text-foreground/50">+{note.checklist.length - 5} more items</p>
                )}
                <p className="text-xs text-foreground/50 mt-2">
                  {checkedCount}/{note.checklist.length} completed
                </p>
              </div>
            ) : note.content ? (
              <p className="text-foreground/80 whitespace-pre-wrap break-words">{note.content}</p>
            ) : (
              <p className="text-foreground/40 italic">Empty note</p>
            )}
          </div>

          {/* Labels */}
          {noteLabels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {noteLabels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `hsl(${label.color} / 0.2)`, color: `hsl(${label.color})` }}
                >
                  {label.name}
                  <button
                    onClick={() => onRemoveLabel(note.id, label.id)}
                    className="hover:bg-foreground/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-4 pt-3 border-t border-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
            {!note.isArchived && (
              <button
                onClick={() => onTogglePin(note.id)}
                className={cn('p-2 rounded-full transition-colors', note.isPinned ? 'bg-primary/20 text-primary' : 'hover:bg-foreground/10')}
                title={note.isPinned ? 'Unpin' : 'Pin'}
              >
                <Pin className="w-4 h-4" />
              </button>
            )}
            <div className="relative">
              <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 rounded-full hover:bg-foreground/10 transition-colors" title="Change color">
                <Palette className="w-4 h-4" />
              </button>
              {showColorPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-3 bg-card rounded-xl note-shadow-hover z-10 animate-fade-in">
                  <ColorPicker selectedColor={note.color} onColorSelect={handleColorChange} />
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setShowLabelPicker(!showLabelPicker)} className="p-2 rounded-full hover:bg-foreground/10 transition-colors" title="Add label">
                <Tag className="w-4 h-4" />
              </button>
              {showLabelPicker && availableLabels.length > 0 && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-card rounded-xl note-shadow-hover z-10 animate-fade-in min-w-[140px]">
                  {availableLabels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => {
                        onAddLabel(note.id, label.id);
                        setShowLabelPicker(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${label.color})` }} />
                      {label.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onToggleArchive(note.id)}
              className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
              title={note.isArchived ? 'Unarchive' : 'Archive'}
            >
              {note.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors ml-auto"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
