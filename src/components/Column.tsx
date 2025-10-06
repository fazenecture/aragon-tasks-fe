import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  count: number;
  color: 'todo' | 'doing' | 'done';
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}

const colorClasses = {
  todo: 'bg-todo',
  doing: 'bg-doing',
  done: 'bg-done',
};

export const Column = ({ title, count, color, tasks, onEditTask, onDeleteTask }: ColumnProps) => {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-4 h-4 rounded-full ${colorClasses[color]}`} />
        <h2 className="text-text-secondary text-sm font-semibold tracking-wider uppercase">
          {title} ({count})
        </h2>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
