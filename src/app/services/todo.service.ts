import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Todo } from '../models/todo.model';

/**
 * Service for managing todo items
 * Follows the repository pattern for data management
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // Constants for todo IDs
  private readonly SAMPLE_ID_THRESHOLD = 1001;

  // Sample todos with fixed IDs (1-1000 range reserved for samples)
  private sampleTodos: Todo[] = [
    { id: 1, title: 'Learn Angular', completed: false, createdAt: Date.now() - 300000, completedAt: undefined },
    { id: 2, title: 'Build a TODO App', completed: false, createdAt: Date.now() - 200000, completedAt: undefined },
    { id: 3, title: 'Master RxJS', completed: false, createdAt: Date.now() - 100000, completedAt: undefined }
  ];

  // User todos will have IDs starting from 1001
  private userTodos: Todo[] = [];

  // BehaviorSubject to store and emit the current state of todos
  private todosSubject = new BehaviorSubject<Todo[]>([...this.sampleTodos]);

  constructor() {
    // Load any saved todos from localStorage
    this.loadTodos();
  }

  /**
   * Get an observable of all todos
   */
  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  /**
   * Add a new todo
   * @param title The title of the new todo
   * @returns Observable of the updated todos list
   */
  addTodo(title: string): Observable<Todo[]> {
    try {
      if (!title.trim()) {
        throw new Error('Todo title cannot be empty');
      }

      const newTodo: Todo = {
        // Ensure user todo IDs start from 1001 to distinguish from sample todos
        id: this.SAMPLE_ID_THRESHOLD + this.userTodos.length,
        title: title.trim(),
        completed: false,
        createdAt: Date.now(),
        completedAt: undefined
      };

      this.userTodos = [...this.userTodos, newTodo];
      this.updateState();
      this.saveTodos();

      return this.todosSubject.asObservable().pipe(
        tap(() => console.log('Todo added successfully')),
        catchError(error => {
          console.error('Error adding todo:', error);
          return of([...this.sampleTodos, ...this.userTodos]);
        })
      );
    } catch (error) {
      console.error('Error adding todo:', error);
      return of([...this.sampleTodos, ...this.userTodos]);
    }
  }

  /**
   * Toggle the completed status of a todo
   * @param id The ID of the todo to toggle
   * @returns Observable of the updated todos list
   */
  toggleTodo(id: number): Observable<Todo[]> {
    try {
      if (id >= this.SAMPLE_ID_THRESHOLD) {
        // Toggle user todos
        this.userTodos = this.userTodos.map(todo => {
          if (todo.id === id) {
            const newCompleted = !todo.completed;
            return {
              ...todo,
              completed: newCompleted,
              completedAt: newCompleted ? Date.now() : undefined
            };
          }
          return todo;
        });
      } else {
        // Toggle sample todos
        this.sampleTodos = this.sampleTodos.map(todo => {
          if (todo.id === id) {
            const newCompleted = !todo.completed;
            return {
              ...todo,
              completed: newCompleted,
              completedAt: newCompleted ? Date.now() : undefined
            };
          }
          return todo;
        });
      }

      this.updateState();
      this.saveTodos();

      return this.todosSubject.asObservable().pipe(
        catchError(error => {
          console.error('Error toggling todo:', error);
          return of([...this.sampleTodos, ...this.userTodos]);
        })
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      return of([...this.sampleTodos, ...this.userTodos]);
    }
  }

  /**
   * Delete a todo
   * @param id The ID of the todo to delete
   * @returns Observable of the updated todos list
   */
  deleteTodo(id: number): Observable<Todo[]> {
    try {
      // Only delete user todos (IDs >= 1001)
      if (id >= this.SAMPLE_ID_THRESHOLD) {
        this.userTodos = this.userTodos.filter(todo => todo.id !== id);
        this.updateState();
        this.saveTodos();
      }

      return this.todosSubject.asObservable().pipe(
        catchError(error => {
          console.error('Error deleting todo:', error);
          return of([...this.sampleTodos, ...this.userTodos]);
        })
      );
    } catch (error) {
      console.error('Error deleting todo:', error);
      return of([...this.sampleTodos, ...this.userTodos]);
    }
  }

  /**
   * Update a todo's title
   * @param id The ID of the todo to update
   * @param title The new title
   * @returns Observable of the updated todos list
   */
  updateTodo(id: number, title: string): Observable<Todo[]> {
    try {
      if (!title.trim()) {
        throw new Error('Todo title cannot be empty');
      }

      // Only update user todos (IDs >= 1001)
      if (id >= this.SAMPLE_ID_THRESHOLD) {
        this.userTodos = this.userTodos.map(todo =>
          todo.id === id ? { ...todo, title: title.trim() } : todo
        );
        this.updateState();
        this.saveTodos();
      }

      return this.todosSubject.asObservable().pipe(
        catchError(error => {
          console.error('Error updating todo:', error);
          return of([...this.sampleTodos, ...this.userTodos]);
        })
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      return of([...this.sampleTodos, ...this.userTodos]);
    }
  }

  /**
   * Update the internal state and notify subscribers
   * @private
   */
  private updateState(): void {
    const updatedTodos = [...this.sampleTodos, ...this.userTodos];
    this.todosSubject.next(updatedTodos);
  }

  /**
   * Save user todos to localStorage
   * @private
   */
  private saveTodos(): void {
    try {
      localStorage.setItem('userTodos', JSON.stringify(this.userTodos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }

  /**
   * Load user todos from localStorage
   * @private
   */
  private loadTodos(): void {
    try {
      const savedTodos = localStorage.getItem('userTodos');
      if (savedTodos) {
        this.userTodos = JSON.parse(savedTodos);
        this.updateState();
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      this.userTodos = [];
      this.updateState();
    }
  }
}
