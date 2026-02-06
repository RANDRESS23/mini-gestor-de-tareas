import axiosClient from './axiosClient';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'done';
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
}

export interface UpdateTaskData {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: {
    task: Task;
  };
}

export const tasksApi = {
  getTasks: async (): Promise<TasksResponse> => {
    const response = await axiosClient.get('/tasks');
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<TaskResponse> => {
    const response = await axiosClient.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskData): Promise<TaskResponse> => {
    const response = await axiosClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await axiosClient.delete(`/tasks/${id}`);
  },
};
