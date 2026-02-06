import axiosClient from './axiosClient';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosClient.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosClient.post('/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/logout');
  },
};
