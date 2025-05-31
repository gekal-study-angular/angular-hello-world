import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  template: `
    <div class="todo-container">
      <h1>Todo Management App</h1>

      <div class="add-todo">
        <input
          type="text"
          [(ngModel)]="newTodoTitle"
          placeholder="Add a new task..."
          (keyup.enter)="addTodo()"
        />
        <button (click)="addTodo()">Add</button>
      </div>

      <div class="todo-section">
        <h2>Tasks To Do</h2>
        <div class="todo-list">
          @if (incompleteTodos.length === 0) {
            <p class="empty-message">No tasks to do. All caught up!</p>
          } @else {
            @for (todo of incompleteTodos; track todo.id) {
              <app-todo-item
                [todo]="todo"
                (toggle)="toggleTodo($event)"
                (delete)="deleteTodo($event)"
                (update)="updateTodo($event.id, $event.title)"
              ></app-todo-item>
            }
          }
        </div>
      </div>

      <div class="todo-section">
        <h2>Completed Tasks</h2>
        <div class="todo-list">
          @if (completedTodos.length === 0) {
            <p class="empty-message">No completed tasks yet.</p>
          } @else {
            @for (todo of completedTodos; track todo.id) {
              <app-todo-item
                [todo]="todo"
                (toggle)="toggleTodo($event)"
                (delete)="deleteTodo($event)"
                (update)="updateTodo($event.id, $event.title)"
              ></app-todo-item>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .todo-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }

    h2 {
      color: #4285f4;
      border-bottom: 2px solid #4285f4;
      padding-bottom: 5px;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    .add-todo {
      display: flex;
      margin-bottom: 30px;
    }

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      font-size: 16px;
    }

    button {
      padding: 10px 15px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      font-size: 16px;
    }

    button:hover {
      background-color: #3367d6;
    }

    .todo-section {
      margin-bottom: 30px;
    }

    .todo-list {
      margin-top: 10px;
    }

    .empty-message {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
    }
  `
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';

  get incompleteTodos(): Todo[] {
    // Filter incomplete todos and sort by creation time (ascending)
    return this.todos
      .filter(todo => !todo.completed)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  get completedTodos(): Todo[] {
    // Filter completed todos and sort by completion time (ascending)
    return this.todos
      .filter(todo => todo.completed)
      .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));
  }

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  updateTodo(id: number, title: string): void {
    this.todoService.updateTodo(id, title);
  }
}
