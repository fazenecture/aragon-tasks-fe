import { Board } from '@/types';
import { LayoutDashboard, Plus, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SidebarProps {
  boards: Board[];
  selectedBoardId: number | string | null;
  onSelectBoard: (id: number | string) => void;
  onCreateBoard: () => void;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (id: number | string) => void;
}

export const Sidebar = ({
  boards,
  selectedBoardId,
  onSelectBoard,
  onCreateBoard,
  onEditBoard,
  onDeleteBoard,
}: SidebarProps) => {
  const [menuBoardId, setMenuBoardId] = useState<number | string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuBoardId(null);
      }
    };

    if (menuBoardId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuBoardId]);

  return (
    <aside className="w-[280px] bg-sidebar border-r border-border flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <div className="w-1.5 h-6 bg-primary/70 rounded-full" />
            <div className="w-1.5 h-6 bg-primary/40 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">kanban</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-text-muted text-xs font-semibold tracking-wider uppercase mb-4">
          All Boards ({boards.length})
        </p>
        
        <div className="space-y-1">
          {boards.map((board) => (
            <div
              key={board.id}
              className="relative group"
            >
              <button
                onClick={() => onSelectBoard(board.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-r-full text-left transition-smooth
                  ${
                    selectedBoardId === board.id
                      ? 'bg-sidebar-active text-primary-foreground'
                      : 'text-text-muted hover:bg-sidebar-hover hover:text-primary'
                  }
                `}
              >
                <LayoutDashboard size={18} />
                <span className="font-medium flex-1">{board.name}</span>
              </button>
              
              {selectedBoardId === board.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={menuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuBoardId(menuBoardId === board.id ? null : board.id);
                    }}
                    className="text-primary-foreground hover:text-white transition-smooth p-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {menuBoardId === board.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-modal-bg rounded-lg shadow-xl border border-border overflow-hidden z-10">
                      <button
                        onClick={() => {
                          onEditBoard(board);
                          setMenuBoardId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-sidebar-hover transition-smooth"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDeleteBoard(board.id);
                          setMenuBoardId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-sidebar-hover transition-smooth"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <button
            onClick={onCreateBoard}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-r-full text-left transition-smooth text-primary hover:bg-sidebar-hover"
          >
            <LayoutDashboard size={18} />
            <span className="font-medium">+ Create New Board</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
