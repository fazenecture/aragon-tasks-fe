import { useState, useEffect } from 'react';
import { Board, CreateBoardInput } from '@/types';
import { boardApi } from '@/services/api';
import { toast } from 'sonner';

export const useBoards = (userId: number) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await boardApi.fetchBoards(userId);
      setBoards(data);
      setError(null);
    } catch (err) {
      setError('Failed to load boards');
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (data: CreateBoardInput) => {
    try {
      await boardApi.createBoard(data);
      await fetchBoards(); // Refetch to get the new board
      toast.success('Board created successfully');
    } catch (err) {
      toast.error('Failed to create board');
      throw err;
    }
  };

  const updateBoard = async (id: number | string, data: Partial<CreateBoardInput>) => {
    try {
      await boardApi.updateBoard(id, data);
      await fetchBoards(); // Refetch to get updated data
      toast.success('Board updated successfully');
    } catch (err) {
      toast.error('Failed to update board');
      throw err;
    }
  };

  const deleteBoard = async (id: number | string) => {
    try {
      await boardApi.deleteBoard(id, userId);
      setBoards((prev) => prev.filter((b) => b.id !== id));
      toast.success('Board deleted successfully');
    } catch (err) {
      toast.error('Failed to delete board');
      throw err;
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [userId]);

  return {
    boards,
    loading,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
    refreshBoards: fetchBoards,
  };
};
