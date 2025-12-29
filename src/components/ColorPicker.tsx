import { NoteColor } from '@/types/note';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selectedColor: NoteColor;
  onColorSelect: (color: NoteColor) => void;
  className?: string;
}

const colors: { value: NoteColor; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Purple' },
  { value: 'blue', label: 'Blue' },
  { value: 'teal', label: 'Teal' },
  { value: 'green', label: 'Green' },
];

const colorClasses: Record<NoteColor, string> = {
  default: 'bg-note',
  yellow: 'bg-note-yellow',
  green: 'bg-note-green',
  blue: 'bg-note-blue',
  pink: 'bg-note-pink',
  purple: 'bg-note-purple',
  orange: 'bg-note-orange',
  teal: 'bg-note-teal',
  red: 'bg-note-red',
};

export const ColorPicker = ({ selectedColor, onColorSelect, className }: ColorPickerProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {colors.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onColorSelect(value)}
          className={cn(
            'w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110',
            colorClasses[value],
            selectedColor === value
              ? 'border-foreground/60 ring-2 ring-foreground/20'
              : 'border-transparent hover:border-foreground/30'
          )}
          title={label}
          aria-label={`Select ${label} color`}
        />
      ))}
    </div>
  );
};

export { colorClasses };
