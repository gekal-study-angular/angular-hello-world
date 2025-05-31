import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
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
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
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

  /**
   * Download completed todos as CSV file
   */
  downloadCompletedTodosAsCsv(): void {
    if (this.completedTodos.length === 0) {
      alert('No completed tasks to download.');
      return;
    }

    // Define CSV headers
    const headers = ['ID', 'Title', 'Created Date', 'Completed Date'];

    // Convert todos to CSV rows
    const csvRows = this.completedTodos.map(todo => {
      const createdDate = this.datePipe.transform(todo.createdAt, 'yyyy-MM-dd HH:mm:ss') || '';
      const completedDate = todo.completedAt ?
        this.datePipe.transform(todo.completedAt, 'yyyy-MM-dd HH:mm:ss') || '' : '';

      // Escape any commas in the title
      const escapedTitle = todo.title.includes(',') ? `"${todo.title}"` : todo.title;

      return [todo.id, escapedTitle, createdDate, completedDate].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `completed-tasks-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';

    // Add to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
