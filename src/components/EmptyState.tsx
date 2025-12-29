import { Lightbulb } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Lightbulb className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No notes yet</h2>
      <p className="text-muted-foreground max-w-md">
        Create your first note by clicking on "Take a note..." above. Your notes will be saved automatically.
      </p>
    </div>
  );
};
