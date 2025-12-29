import { useState, useMemo } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useLabels } from '@/hooks/useLabels';
import { Header } from '@/components/Header';
import { CreateNote } from '@/components/CreateNote';
import { NotesGrid } from '@/components/NotesGrid';
import { EmptyState } from '@/components/EmptyState';
import { AppSidebar, ViewMode } from '@/components/AppSidebar';
import { Pin, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const {
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
  } = useNotes();
  
  const { labels, addLabel, deleteLabel } = useLabels();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('notes');
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewChange = (mode: ViewMode, labelId?: string) => {
    setViewMode(mode);
    setSelectedLabelId(labelId || null);
    setIsSidebarOpen(false);
  };

  // Calculate note counts
  const noteCounts = useMemo(() => {
    const labelCounts: Record<string, number> = {};
    labels.forEach(label => {
      labelCounts[label.id] = activeNotes.filter(n => n.labels.includes(label.id)).length;
    });
    return {
      notes: activeNotes.length,
      archive: archivedNotes.length,
      labels: labelCounts,
    };
  }, [activeNotes, archivedNotes, labels]);

  // Get notes based on view mode
  const displayNotes = useMemo(() => {
    let notes = viewMode === 'archive' ? archivedNotes : activeNotes;
    
    if (viewMode === 'label' && selectedLabelId) {
      notes = notes.filter(n => n.labels.includes(selectedLabelId));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      notes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.checklist.some(item => item.text.toLowerCase().includes(query))
      );
    }

    return notes;
  }, [viewMode, selectedLabelId, activeNotes, archivedNotes, searchQuery]);

  const displayPinned = viewMode === 'notes' ? displayNotes.filter(n => n.isPinned) : [];
  const displayOther = viewMode === 'notes' ? displayNotes.filter(n => !n.isPinned) : displayNotes;

  const selectedLabel = labels.find(l => l.id === selectedLabelId);
  const pageTitle = viewMode === 'archive' ? 'Archive' : viewMode === 'label' && selectedLabel ? selectedLabel.name : null;

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar - desktop */}
        <div className="hidden md:block">
          <AppSidebar
            labels={labels}
            viewMode={viewMode}
            selectedLabelId={selectedLabelId}
            onViewChange={handleViewChange}
            onAddLabel={addLabel}
            onDeleteLabel={deleteLabel}
            noteCounts={noteCounts}
          />
        </div>

        {/* Sidebar - mobile overlay */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity',
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={cn(
            'fixed left-0 top-[73px] z-50 h-[calc(100vh-73px)] bg-card border-r border-border transition-transform md:hidden',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <AppSidebar
            labels={labels}
            viewMode={viewMode}
            selectedLabelId={selectedLabelId}
            onViewChange={handleViewChange}
            onAddLabel={addLabel}
            onDeleteLabel={deleteLabel}
            noteCounts={noteCounts}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 py-8 min-w-0">
          <div className="max-w-6xl mx-auto">
            {/* Page title */}
            {pageTitle && (
              <div className="flex items-center gap-2 mb-6">
                {viewMode === 'archive' && <Archive className="w-5 h-5 text-muted-foreground" />}
                {viewMode === 'label' && selectedLabel && (
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${selectedLabel.color})` }} />
                )}
                <h2 className="text-2xl font-bold">{pageTitle}</h2>
              </div>
            )}

            {/* Create Note - show on notes view and label view */}
            {(viewMode === 'notes' || viewMode === 'label') && (
              <div className="mb-10 animate-slide-up">
                <CreateNote onAdd={addNote} defaultLabelId={selectedLabelId || undefined} />
              </div>
            )}

            {displayNotes.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-16 animate-fade-in">
                  <p className="text-xl text-muted-foreground">No notes matching "{searchQuery}"</p>
                </div>
              ) : viewMode === 'archive' ? (
                <div className="text-center py-16 animate-fade-in">
                  <Archive className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-xl text-muted-foreground">No archived notes</p>
                </div>
              ) : (
                <EmptyState />
              )
            ) : (
              <div className="space-y-8">
                {/* Pinned Notes */}
                {displayPinned.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Pin className="w-4 h-4 text-muted-foreground" />
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pinned</h2>
                    </div>
                    <NotesGrid
                      notes={displayPinned}
                      labels={labels}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                      onToggleArchive={toggleArchive}
                      onAddLabel={addLabelToNote}
                      onRemoveLabel={removeLabelFromNote}
                      onToggleChecklistItem={toggleChecklistItem}
                      onReorder={reorderNotes}
                    />
                  </section>
                )}

                {/* Other Notes */}
                {displayOther.length > 0 && (
                  <section>
                    {displayPinned.length > 0 && viewMode === 'notes' && (
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Others</h2>
                    )}
                    <NotesGrid
                      notes={displayOther}
                      labels={labels}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                      onToggleArchive={toggleArchive}
                      onAddLabel={addLabelToNote}
                      onRemoveLabel={removeLabelFromNote}
                      onToggleChecklistItem={toggleChecklistItem}
                      onReorder={reorderNotes}
                    />
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
