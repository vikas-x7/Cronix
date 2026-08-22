# Contributing to Cronix

Thank you for your interest in contributing to Cronix! This document provides guidelines and steps for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork (`git clone https://github.com/your-username/cronix.git`)
3. Create a branch (`git checkout -b feat/amazing-feature`)
4. Install dependencies (`pnpm install`)
5. Make your changes
6. Test your changes (`pnpm dev`)
7. Commit (`git commit -m 'feat: add amazing feature'`)
8. Push (`git push origin feat/amazing-feature`)
9. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- pnpm 9+

### Environment Variables

Copy the example env files and fill in your values:

```bash
cp apps/server/example.env apps/server/.env
cp packages/database/.env.example packages/database/.env
```

### Running Locally

```bash
pnpm install
pnpm --filter database db:generate
pnpm --filter database db:migrate
pnpm dev
```

## Code Conventions

- Follow the existing code style
- Use TypeScript throughout
- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- Keep PRs focused on a single change
- Write clear commit messages

## Pull Request Process

1. Update documentation if needed
2. Ensure no TypeScript errors (`pnpm check-types`)
3. Ensure no lint errors (`pnpm lint`)
4. Request a review from a maintainer

## Reporting Issues

Use the [GitHub Issues](https://github.com/vikas-x7/cronix/issues) tracker to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
