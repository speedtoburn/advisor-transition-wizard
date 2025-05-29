# Getting Started with Advisor Transition Wizard

This guide will help you get started with the Advisor Transition Wizard application.

## Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Visit `http://localhost:3000` in your browser

## Project Architecture

The project follows a modern Next.js 14 architecture with the following key features:

- App Router for improved routing and layouts
- Server Components for optimal performance
- Tailwind CSS for styling
- TypeScript for type safety
- ShadcnUI components for consistent UI elements

## Best Practices

- Follow the branch strategy:
  - `main` for production
  - `development` for staging
  - `feature/*` for new features
- Write clean, maintainable code
- Add proper documentation for new features
- Follow TypeScript best practices
- Use Tailwind CSS utility classes for styling

## Deployment

The application can be deployed to various platforms that support Next.js applications:

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
