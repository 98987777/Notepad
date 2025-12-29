import { Note, Label } from '@/types/note';
import { NoteCard } from './NoteCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { colorClasses } from './ColorPicker';
import { cn } from '@/lib/utils';
import { Pin, GripVertical, CheckSquare, Square } from 'lucide-react';

interface NotesGridProps {
  notes: Note[];
  labels: Label[];
  onUpdate: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onAddLabel: (noteId: string, labelId: string) => void;
  onRemoveLabel: (noteId: string, labelId: string) => void;
  onToggleChecklistItem: (noteId: string, itemId: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export const NotesGrid = ({
  notes,
  labels,
  onUpdate,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onAddLabel,
  onRemoveLabel,
  onToggleChecklistItem,
  onReorder,
}: NotesGridProps) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const note = notes.find(n => n.id === event.active.id);
    if (note) setActiveNote(note);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNote(null);
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={notes.map(n => n.id)} strategy={rectSortingStrategy}>
        <div className="note-grid">
          {notes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              labels={labels}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
              onAddLabel={onAddLabel}
              onRemoveLabel={onRemoveLabel}
              onToggleChecklistItem={onToggleChecklistItem}
              index={index}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeNote ? (
          <div className={cn('rounded-xl p-4 note-shadow-hover rotate-3 scale-105', colorClasses[activeNote.color], activeNote.isPinned && 'ring-2 ring-primary/30')}>
            <div className="absolute top-2 right-2 p-1.5">
              <GripVertical className="w-4 h-4 text-foreground/50" />
            </div>
            {activeNote.isPinned && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Pin className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div className="min-h-[60px] pr-6">
              {activeNote.title && <h3 className="font-semibold text-lg mb-2 break-words">{activeNote.title}</h3>}
              {activeNote.checklist.length > 0 ? (
                <div className="space-y-1">
                  {activeNote.checklist.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      {item.checked ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-foreground/40" />}
                      <span className={cn('text-sm', item.checked && 'line-through text-foreground/50')}>{item.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/80 whitespace-pre-wrap break-words line-clamp-4">{activeNote.content}</p>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
