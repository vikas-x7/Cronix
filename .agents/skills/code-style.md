# Code Style Guidelines

## TypeScript

- Use TypeScript strict mode
- Prefer `interface` for object types, `type` for unions/intersections
- Use named exports, avoid default exports except for React components
- Prefix hooks with `use`

## React Components

- Use `'use client'` directive for client components
- One component per file
- Props interface defined in same file or in types/ folder
- Use functional components only, no class components

## File Naming

- Components: `kebab-case.tsx` (e.g., `job-detail.tsx`)
- Hooks: `use-*.ts` (e.g., `use-auth.ts`)
- Types: `*.types.ts` (e.g., `job.types.ts`)
- API files: `*.api.ts`
- Utilities: `*.ts` (e.g., `utils.ts`)

## Imports

- Use `@/` path alias for src imports
- Group imports: external libs, internal modules, types, styles
- Use barrel exports from index.ts

## Error Handling

- Use try/catch for async operations
- Show toast notifications for user-facing errors
- Log errors to console in development

## Git Commits

- Format: `type: description`
- Types: feat, fix, docs, refactor, chore, style, test
- Keep commits atomic and focused
