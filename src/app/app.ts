import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoListComponent],
  template: `
    <div class="app-container">
      <app-todo-list></app-todo-list>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    .app-container {
      font-family: 'Roboto', Arial, sans-serif;
      background-color: #f5f5f5;
      min-height: 100vh;
      padding: 20px;
    }
  `
})
export class App {
  title = 'Todo App';
}
