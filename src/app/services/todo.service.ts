import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // Sample todos with fixed IDs (1-1000 range reserved for samples)
  private sampleTodos: Todo[] = [
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build a TODO App', completed: false },
    { id: 3, title: 'Master RxJS', completed: false }
  ];

  // User todos will have IDs starting from 1001
  private userTodos: Todo[] = [];

  // Combined todos for display
  private todos: Todo[] = [...this.sampleTodos];

  private todosSubject = new BehaviorSubject<Todo[]>(this.todos);

  constructor() {
    // No initialization needed here as todos are already initialized
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      // Ensure user todo IDs start from 1001 to distinguish from sample todos
      id: 1001 + this.userTodos.length,
      title,
      completed: false
    };
    this.userTodos = [...this.userTodos, newTodo];
    this.todos = [...this.sampleTodos, ...this.userTodos];
    this.todosSubject.next(this.todos);
  }

  toggleTodo(id: number): void {
    if (id >= 1001) {
      // Toggle user todos
      this.userTodos = this.userTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
    } else {
      // Toggle sample todos
      this.sampleTodos = this.sampleTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
    }
    this.todos = [...this.sampleTodos, ...this.userTodos];
    this.todosSubject.next(this.todos);
  }

  deleteTodo(id: number): void {
    // Only delete user todos (IDs >= 1001)
    if (id >= 1001) {
      this.userTodos = this.userTodos.filter(todo => todo.id !== id);
      this.todos = [...this.sampleTodos, ...this.userTodos];
      this.todosSubject.next(this.todos);
    }
  }

  updateTodo(id: number, title: string): void {
    // Only update user todos (IDs >= 1001)
    if (id >= 1001) {
      this.userTodos = this.userTodos.map(todo =>
        todo.id === id ? { ...todo, title } : todo
      );
      this.todos = [...this.sampleTodos, ...this.userTodos];
      this.todosSubject.next(this.todos);
    }
  }
}
