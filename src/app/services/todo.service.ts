import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor() {
    // Initialize with some sample todos
    this.addTodo('Learn Angular');
    this.addTodo('Build a TODO App');
    this.addTodo('Master RxJS');
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false
    };
    this.todos = [...this.todos, newTodo];
    this.todosSubject.next(this.todos);
  }

  toggleTodo(id: number): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todosSubject.next(this.todos);
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todosSubject.next(this.todos);
  }

  updateTodo(id: number, title: string): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    );
    this.todosSubject.next(this.todos);
  }
}
