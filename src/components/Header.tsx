import { StickyNote, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ searchQuery, onSearchChange, isSidebarOpen, onToggleSidebar }: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center fab-shadow">
              <StickyNote className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold hidden sm:block">Keep Notes</h1>
          </div>

          {/* Search */}
          <div className={cn('flex-1 max-w-2xl relative transition-all duration-200', isSearchFocused && 'scale-[1.02]')}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search notes..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
