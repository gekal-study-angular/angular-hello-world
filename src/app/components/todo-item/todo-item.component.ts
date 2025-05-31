import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements AfterViewInit {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<{id: number, title: string}>();
  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  editing = false;
  editTitle = '';

  // Sample todos have IDs < 1001
  get isSampleTodo(): boolean {
    return this.todo.id < 1001;
  }

  ngAfterViewInit(): void {
    // This lifecycle hook is called after the view is initialized
    // We can use it to focus the input when it becomes visible
    this.focusEditInput();
  }

  private focusEditInput(): void {
    if (this.editing && this.editInput) {
      setTimeout(() => {
        this.editInput.nativeElement.focus();
      });
    }
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
    // Focus will be handled by ngAfterViewInit or when the view is checked
    this.focusEditInput();
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
