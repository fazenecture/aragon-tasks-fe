export interface User {
  id: number | null;
  name: string | null;
  email: string | null;
}

export interface Board {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
  created_by: User;
  updated_at: string;
  updated_by: User;
  task_count: string;
}

export interface Task {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: TaskStatus;
  board_id: number;
  created_at: string;
  created_by: User;
  updated_at: string;
  updated_by: User;
}

export type ApiTaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface CreateBoardInput {
  name: string;
  description: string;
  user_id: number;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  board_id: number;
  assignee_id?: number;
  user_id: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee_id?: number;
}
