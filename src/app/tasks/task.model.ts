export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  icon?: string;
  dueDate?: string; // ISO date string
}
