import { Task } from '@/types';
import { MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-card rounded-lg p-4 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-smooth group">
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-text-primary font-medium flex-1"
          onClick={() => onEdit(task)}
        >
          {task.title}
        </h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-text-muted hover:text-text-primary transition-smooth p-1 rounded opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-modal-bg rounded-lg shadow-xl border border-border overflow-hidden z-10">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-sidebar-hover transition-smooth"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-sidebar-hover transition-smooth"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-text-muted text-sm mt-2 line-clamp-2">{task.description}</p>
      )}
    </div>
  );
};
