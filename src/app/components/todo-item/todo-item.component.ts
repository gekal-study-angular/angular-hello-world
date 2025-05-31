import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed" [class.sample-todo]="isSampleTodo">
      @if (editing) {
        <div class="edit-mode">
          <input
            type="text"
            [(ngModel)]="editTitle"
            (keyup.enter)="saveEdit()"
            (keyup.escape)="cancelEdit()"
            #editInput
          />
          <div class="edit-actions">
            <button class="save" (click)="saveEdit()">Save</button>
            <button class="cancel" (click)="cancelEdit()">Cancel</button>
          </div>
        </div>
      } @else {
        <div class="view-mode">
          <div class="todo-content">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="toggleTodo()"
            />
            <span class="todo-title" (dblclick)="startEdit()">
              {{ todo.title }}
              @if (isSampleTodo) {
                <span class="sample-label">(Sample)</span>
              }
              <div class="timestamp">
                @if (todo.completed) {
                  <span class="completed-time">Completed: {{ formatTime(todo.completedAt) }}</span>
                } @else {
                  <span class="created-time">Created: {{ formatTime(todo.createdAt) }}</span>
                }
              </div>
            </span>
          </div>
          <div class="actions">
            <button class="complete" (click)="toggleTodo()">
              {{ todo.completed ? 'Undo' : 'Complete' }}
            </button>
            <button class="edit" (click)="startEdit()" [disabled]="isSampleTodo">Edit</button>
            <button class="delete" (click)="deleteTodo()" [disabled]="isSampleTodo">Delete</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .todo-item {
      display: flex;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: white;
      transition: all 0.3s ease;
    }

    .todo-item.completed {
      background-color: #f9f9f9;
    }

    .todo-item.completed .todo-title {
      text-decoration: line-through;
      color: #888;
    }

    .todo-item.sample-todo {
      border-left: 3px solid #4285f4;
    }

    .sample-label {
      font-size: 0.8em;
      color: #666;
      font-style: italic;
      margin-left: 5px;
    }

    .view-mode, .edit-mode {
      width: 100%;
    }

    .view-mode {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .todo-content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .todo-title {
      margin-left: 10px;
      word-break: break-word;
    }

    .actions, .edit-actions {
      display: flex;
      gap: 5px;
    }

    button {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button.complete {
      background-color: #28a745;
      color: white;
    }

    button.edit {
      background-color: #ffc107;
      color: #333;
    }

    button.delete {
      background-color: #dc3545;
      color: white;
    }

    button.save {
      background-color: #28a745;
      color: white;
    }

    button.cancel {
      background-color: #6c757d;
      color: white;
    }

    .edit-mode input {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .timestamp {
      display: block;
      font-size: 0.8em;
      color: #666;
      margin-top: 4px;
    }

    .created-time {
      color: #4285f4;
    }

    .completed-time {
      color: #28a745;
    }
  `
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<{id: number, title: string}>();

  editing = false;
  editTitle = '';

  // Sample todos have IDs < 1001
  get isSampleTodo(): boolean {
    return this.todo.id < 1001;
  }

  toggleTodo(): void {
    this.toggle.emit(this.todo.id);
  }

  deleteTodo(): void {
    if (!this.isSampleTodo) {
      this.delete.emit(this.todo.id);
    }
  }

  startEdit(): void {
    if (this.isSampleTodo) {
      return; // Don't allow editing sample todos
    }

    this.editing = true;
    this.editTitle = this.todo.title;
    // Focus the input element after rendering
    setTimeout(() => {
      const editInput = document.querySelector('.edit-mode input') as HTMLInputElement;
      if (editInput) {
        editInput.focus();
      }
    }, 0);
  }

  saveEdit(): void {
    if (!this.isSampleTodo && this.editTitle.trim() && this.editTitle !== this.todo.title) {
      this.update.emit({id: this.todo.id, title: this.editTitle.trim()});
    }
    this.editing = false;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  formatTime(timestamp?: number): string {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}
