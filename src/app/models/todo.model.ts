export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number;  // Timestamp when the todo was created
  completedAt?: number;  // Optional timestamp when the todo was completed
}
