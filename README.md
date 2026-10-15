# contribute

A generic, client-side, configuration-driven application for presenting memberships, donations, and recurring payment offerings through hosted checkout.

**Status: in development.** The configuration-driven catalog, validated hosted-checkout links, and two CSS themes are implemented. Starter links are placeholders and remain unavailable until configured.

## Development

Use Node.js 24 (`nvm use`) and npm.

```sh
npm ci
npm run dev
```

Run `npm run check` before submitting changes. It runs strict TypeScript checks, type-aware ESLint with zero warnings allowed, Vitest tests, and a production build. CI runs the same checks on pull requests and pushes to main. The lockfile is committed for reproducible installs. The development server binds to localhost.

`npm run build` emits static files to `dist/`; `npm run preview` previews that build locally. Relative asset paths support subdirectory hosting. There are no runtime dependencies or backend services. Build-time environment values are public if bundled; never add secrets.

Edit `src/config/site.ts` to select the catalog and theme. Vite handles bundling, TypeScript enforces strict types, and ESLint checks unsafe operations and unhandled promises. Vitest covers configuration and checkout URL validation only; UI changes receive a brief manual browser check, without a UI behavior-test framework. There is no UI framework or personal-data form.

## Principles

- Static hosting; no application backend, payment processing, or secrets.
- Interchangeable hosted-checkout providers, starting with Stripe Payment Links.
- Reusable offering configuration and CSS themes, with no organization-specific assumptions in core code.
- No personal-data collection or storage by the application. Checkout providers handle their own customer and payment information.

## Documentation

- [Operator guide: configure, build, and hand off](docs/operator-guide.md)
- [Implementation plan](PLAN.md)
- [Architecture](docs/architecture.md)
- [Offering configuration](docs/configuration.md)
- [Hosted-checkout providers](docs/providers.md)
- [CSS themes](docs/themes.md)
- [MVP readiness review](docs/readiness-review.md)
- [Architecture decisions](docs/adr/)
- [Implementation issues](https://github.com/bh2smith/contribute/issues)

Repository visibility is private. Deployment and any visibility changes require a separate decision.

The intended final handoff is a lightweight, self-contained HTML file. Single-file packaging is tracked in #7; the current build still requires the complete `dist/` directory.
