import { useState, useEffect, useCallback } from 'react';
import { Note, NoteColor, ChecklistItem } from '@/types/note';
import { arrayMove } from '@dnd-kit/sortable';

const STORAGE_KEY = 'keep-notes';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old notes that don't have new fields
        const migrated = parsed.map((note: any) => ({
          ...note,
          isArchived: note.isArchived ?? false,
          labels: note.labels ?? [],
          checklist: note.checklist ?? [],
        }));
        setNotes(migrated);
      } catch {
        setNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((title: string, content: string, color: NoteColor = 'default', checklist: ChecklistItem[] = [], defaultLabels: string[] = []) => {
    const newNote: Note = {
      id: generateId(),
      title: title.trim(),
      content: content.trim(),
      color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      isArchived: false,
      labels: defaultLabels,
      checklist,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const toggleArchive = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, isArchived: !note.isArchived, isPinned: false, updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const addLabelToNote = useCallback((noteId: string, labelId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId && !note.labels.includes(labelId)
          ? { ...note, labels: [...note.labels, labelId], updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const removeLabelFromNote = useCallback((noteId: string, labelId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, labels: note.labels.filter(l => l !== labelId), updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const toggleChecklistItem = useCallback((noteId: string, itemId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? {
              ...note,
              checklist: note.checklist.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
              updatedAt: Date.now(),
            }
          : note
      )
    );
  }, []);

  const reorderNotes = useCallback((activeId: string, overId: string) => {
    setNotes(prev => {
      const oldIndex = prev.findIndex(n => n.id === activeId);
      const newIndex = prev.findIndex(n => n.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const activeNotes = notes.filter(n => !n.isArchived);
  const archivedNotes = notes.filter(n => n.isArchived);
  const pinnedNotes = activeNotes.filter(n => n.isPinned);
  const otherNotes = activeNotes.filter(n => !n.isPinned);

  return {
    notes,
    activeNotes,
    archivedNotes,
    pinnedNotes,
    otherNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    addLabelToNote,
    removeLabelFromNote,
    toggleChecklistItem,
    reorderNotes,
  };
};
