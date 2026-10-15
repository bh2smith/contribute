# contribute

A generic, client-side, configuration-driven application for presenting memberships, donations, and recurring payment offerings through hosted checkout.

**Status: in development.** The static Vite + TypeScript shell, offering configuration validation, and hosted-checkout resolver are implemented. Configuration-driven catalog rendering follows in the issue backlog.

## Development

Use Node.js 24 (`nvm use`) and npm.

```sh
npm ci
npm run dev
```

Run `npm run check` before submitting changes. It runs strict TypeScript checks, type-aware ESLint with zero warnings allowed, Vitest tests, and a production build. CI runs the same checks on pull requests and pushes to main. The lockfile is committed for reproducible installs. The development server binds to localhost.

`npm run build` emits static files to `dist/`; `npm run preview` previews that build locally. Relative asset paths support subdirectory hosting. There are no runtime dependencies or backend services. Build-time environment values are public if bundled; never add secrets.

The initial shell has an empty state only, with no payment links or data-entry forms. Vite handles bundling, TypeScript enforces strict types, ESLint checks unsafe operations and unhandled promises, and Vitest uses a DOM environment for UI tests. No UI framework is needed for the initial catalog.

## Principles

- Static hosting; no application backend, payment processing, or secrets.
- Interchangeable hosted-checkout providers, starting with Stripe Payment Links.
- Reusable offering configuration and CSS themes, with no organization-specific assumptions in core code.
- No personal-data collection or storage by the application. Checkout providers handle their own customer and payment information.

## Documentation

- [Implementation plan](PLAN.md)
- [Architecture](docs/architecture.md)
- [Offering configuration](docs/configuration.md)
- [Hosted-checkout providers](docs/providers.md)
- [Architecture decisions](docs/adr/)
- [Implementation issues](https://github.com/bh2smith/contribute/issues)

Repository visibility is private. Deployment and any visibility changes require a separate decision.
