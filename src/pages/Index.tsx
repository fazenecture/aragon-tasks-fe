import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Column } from '@/components/Column';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { BoardForm } from '@/components/BoardForm';
import { TaskForm } from '@/components/TaskForm';
import { useBoards } from '@/hooks/useBoards';
import { useTasks } from '@/hooks/useTasks';
import { Board, Task } from '@/types';
import { Plus, MoreVertical } from 'lucide-react';

// Mock user ID - in production this would come from authentication
const MOCK_USER_ID = 1;

const Index = () => {
  const [selectedBoardId, setSelectedBoardId] = useState<number | string | null>(null);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { boards, loading: boardsLoading, createBoard, updateBoard, deleteBoard } = useBoards(MOCK_USER_ID);
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(selectedBoardId, MOCK_USER_ID);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  const handleCreateBoard = () => {
    setEditingBoard(null);
    setIsBoardModalOpen(true);
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setIsBoardModalOpen(true);
  };

  const handleBoardSubmit = async (data: any) => {
    if (editingBoard) {
      await updateBoard(editingBoard.id, data);
    } else {
      await createBoard(data);
      // Select the first board if none selected, or keep current selection
      if (!selectedBoardId && boards.length > 0) {
        setSelectedBoardId(boards[0].id);
      }
    }
    setIsBoardModalOpen(false);
    setEditingBoard(null);
  };

  const handleDeleteBoard = async (id: number) => {
    if (confirm('Are you sure you want to delete this board?')) {
      await deleteBoard(id);
      if (selectedBoardId === id) {
        setSelectedBoardId(boards.length > 1 ? boards[0].id : null);
      }
    }
  };

  const handleCreateTask = () => {
    if (!selectedBoardId) {
      alert('Please select a board first');
      return;
    }
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
        onCreateBoard={handleCreateBoard}
        onEditBoard={handleEditBoard}
        onDeleteBoard={handleDeleteBoard}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedBoard ? (
          <>
            <header className="border-b border-border px-6 py-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-text-primary">{selectedBoard.name}</h1>
              <div className="flex items-center gap-3">
                <Button onClick={handleCreateTask} variant="primary">
                  <Plus size={18} className="mr-2" />
                  Add New Task
                </Button>
                <button className="text-text-muted hover:text-text-primary transition-smooth p-2">
                  <MoreVertical size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex gap-6 p-6 h-full">
                <Column
                  title="TODO"
                  count={todoTasks.length}
                  color="todo"
                  tasks={todoTasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
                <Column
                  title="DOING"
                  count={inProgressTasks.length}
                  color="doing"
                  tasks={inProgressTasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
                <Column
                  title="DONE"
                  count={doneTasks.length}
                  color="done"
                  tasks={doneTasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-secondary text-lg mb-4">
                {boards.length === 0 ? 'Create your first board to get started' : 'Select a board to view tasks'}
              </p>
              {boards.length === 0 && (
                <Button onClick={handleCreateBoard} variant="primary">
                  <Plus size={18} className="mr-2" />
                  Create Board
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={isBoardModalOpen}
        onClose={() => {
          setIsBoardModalOpen(false);
          setEditingBoard(null);
        }}
        title={editingBoard ? 'Edit Board' : 'Create New Board'}
      >
        <BoardForm
          board={editingBoard}
          userId={MOCK_USER_ID}
          onSubmit={handleBoardSubmit}
          onCancel={() => {
            setIsBoardModalOpen(false);
            setEditingBoard(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          boardId={selectedBoardId!}
          userId={MOCK_USER_ID}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Index;
