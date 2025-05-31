# AngularHelloWorld

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions. When you push changes to the `main` branch, the application will be built and deployed to GitHub Pages.

### Required GitHub Repository Settings

To enable GitHub Pages deployment:

1. Go to your GitHub repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Build and deployment", select "GitHub Actions" as the source
4. The first workflow run will create the GitHub Pages site

After the workflow runs successfully, your application will be available at `https://[your-username].github.io/angular-hello-world/`

### Manual Deployment

If you want to build and deploy manually:

```bash
# Build for production with the correct base-href
ng build --base-href=/angular-hello-world/ --configuration production --output-mode static
```

The `--base-href` parameter should match your repository name.
