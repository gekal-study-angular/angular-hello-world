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
      <h1>Todo App</h1>

      <div class="add-todo">
        <input
          type="text"
          [(ngModel)]="newTodoTitle"
          placeholder="Add a new task..."
          (keyup.enter)="addTodo()"
        />
        <button (click)="addTodo()">Add</button>
      </div>

      <div class="todo-list">
        @if (todos.length === 0) {
          <p class="empty-message">No tasks yet. Add one above!</p>
        } @else {
          @for (todo of todos; track todo.id) {
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
  `,
  styles: `
    .todo-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #333;
    }

    .add-todo {
      display: flex;
      margin-bottom: 20px;
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

    .todo-list {
      margin-top: 20px;
    }

    .empty-message {
      text-align: center;
      color: #666;
      font-style: italic;
    }
  `
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';

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
