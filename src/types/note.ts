export type NoteColor = 
  | 'default' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'pink' 
  | 'purple' 
  | 'orange' 
  | 'teal' 
  | 'red';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isArchived: boolean;
  labels: string[]; // label ids
  checklist: ChecklistItem[];
}
