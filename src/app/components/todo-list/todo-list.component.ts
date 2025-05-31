import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private todoService: TodoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.cdr.markForCheck();
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim()).subscribe({
        next: () => {
          this.newTodoTitle = '';
          this.cdr.markForCheck();
        },
        error: (error) => console.error('Error adding todo:', error)
      });
    }
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id).subscribe({
      error: (error) => console.error('Error toggling todo:', error)
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      error: (error) => console.error('Error deleting todo:', error)
    });
  }

  updateTodo(id: number, title: string): void {
    this.todoService.updateTodo(id, title).subscribe({
      error: (error) => console.error('Error updating todo:', error)
    });
  }
}
