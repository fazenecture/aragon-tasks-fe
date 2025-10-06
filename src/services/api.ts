import { Board, Task, CreateBoardInput, CreateTaskInput, UpdateTaskInput, TaskStatus, ApiTaskStatus } from '@/types';

const API_BASE_URL = 'http://localhost:4000/api';

// Helper to map API status to UI status
const mapApiStatusToUI = (apiStatus: ApiTaskStatus): TaskStatus => {
  switch (apiStatus) {
    case 'pending': return 'todo';
    case 'in_progress': return 'in_progress';
    case 'completed': return 'done';
  }
};

const mapUIStatusToApi = (uiStatus: TaskStatus): ApiTaskStatus => {
  switch (uiStatus) {
    case 'todo': return 'pending';
    case 'in_progress': return 'in_progress';
    case 'done': return 'completed';
  }
};

// Board APIs
export const boardApi = {
  async fetchBoards(userId: number): Promise<Board[]> {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch boards');
    const result = await response.json();
    return result.data;
  },

  async createBoard(data: CreateBoardInput): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create board');
  },

  async updateBoard(id: number | string, data: Partial<CreateBoardInput>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update board');
  },

  async deleteBoard(id: number | string, userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error('Failed to delete board');
  },
};

// Task APIs
export const taskApi = {
  async fetchTasks(boardId: number | string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/${boardId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const result = await response.json();
    const { pending = [], in_progress = [], completed = [] } = result.data;
    
    // Combine all tasks and map status
    return [...pending, ...in_progress, ...completed].map(task => ({
      ...task,
      status: mapApiStatusToUI(task.status)
    }));
  },

  async createTask(data: CreateTaskInput): Promise<void> {
    const apiData = { ...data, status: mapUIStatusToApi(data.status) };
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });
    if (!response.ok) throw new Error('Failed to create task');
  },

  async updateTask(id: number, data: UpdateTaskInput & { user_id: number }): Promise<void> {
    const apiData = data.status ? { ...data, status: mapUIStatusToApi(data.status) } : data;
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });
    if (!response.ok) throw new Error('Failed to update task');
  },

  async updateTaskStatus(id: number, status: TaskStatus, userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/status/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: mapUIStatusToApi(status), user_id: userId }),
    });
    if (!response.ok) throw new Error('Failed to update task status');
  },

  async deleteTask(id: number, userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};
