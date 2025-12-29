import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/types/note';

const STORAGE_KEY = 'keep-labels';

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultLabels: Label[] = [
  { id: 'personal', name: 'Personal', color: '210 80% 60%' },
  { id: 'work', name: 'Work', color: '24 95% 55%' },
  { id: 'ideas', name: 'Ideas', color: '280 70% 60%' },
  { id: 'important', name: 'Important', color: '0 70% 55%' },
];

export const useLabels = () => {
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLabels(JSON.parse(stored));
      } catch {
        setLabels(defaultLabels);
      }
    } else {
      setLabels(defaultLabels);
    }
  }, []);

  useEffect(() => {
    if (labels.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    }
  }, [labels]);

  const addLabel = useCallback((name: string, color: string) => {
    const newLabel: Label = {
      id: generateId(),
      name: name.trim(),
      color,
    };
    setLabels(prev => [...prev, newLabel]);
    return newLabel;
  }, []);

  const updateLabel = useCallback((id: string, updates: Partial<Omit<Label, 'id'>>) => {
    setLabels(prev =>
      prev.map(label =>
        label.id === id ? { ...label, ...updates } : label
      )
    );
  }, []);

  const deleteLabel = useCallback((id: string) => {
    setLabels(prev => prev.filter(label => label.id !== id));
  }, []);

  return {
    labels,
    addLabel,
    updateLabel,
    deleteLabel,
  };
};
