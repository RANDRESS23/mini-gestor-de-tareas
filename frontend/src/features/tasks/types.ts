import type { Task } from '../../api/tasksApi';

export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}
