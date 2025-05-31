import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
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
