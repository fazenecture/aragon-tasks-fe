import { useState, useEffect } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types';
import { taskApi } from '@/services/api';
import { toast } from 'sonner';

export const useTasks = (boardId: number | string | null, userId: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!boardId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await taskApi.fetchTasks(boardId);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: CreateTaskInput) => {
    try {
      await taskApi.createTask(data);
      await fetchTasks(); // Refetch to get the new task
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: number, data: UpdateTaskInput) => {
    try {
      await taskApi.updateTask(id, { ...data, user_id: userId });
      await fetchTasks(); // Refetch to get updated data
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  };

  const updateTaskStatus = async (id: number, status: TaskStatus) => {
    try {
      await taskApi.updateTaskStatus(id, status, userId);
      await fetchTasks(); // Refetch to get updated data
    } catch (err) {
      toast.error('Failed to update task status');
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskApi.deleteTask(id, userId);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
  };
};
