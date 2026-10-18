# contribute

A generic, client-side, configuration-driven application for presenting memberships, donations, and recurring payment offerings through hosted checkout.

**Status: in development.** The configuration-driven catalog, validated hosted-checkout links, and two CSS themes are implemented. Starter links are placeholders and remain unavailable until configured.

## Development

Use Node.js 24 (`nvm use`) and Bun 1.4.2 (pinned in `package.json`). Bun manages dependencies and runs package scripts; the build tools and packaging script use Node. Commit `bun.lock` and use frozen installs to reproduce the dependency versions.

```sh
bun install --frozen-lockfile
bun run dev
```

Run `bun run check` before submitting changes. It checks Prettier formatting, strict TypeScript types, type-aware ESLint with zero warnings allowed, Vitest validation tests, and the production build. Run `bun run format` to apply formatting before committing. Use `bun run test` to run the existing Vitest suite. CI runs the same checks on pull requests and pushes to main. The lockfile is committed for reproducible installs. The development server binds to localhost.

`bun run build` emits one self-contained `dist/index.html` with CSS and JavaScript included; `bun run preview` previews it locally. Open the HTML directly in a modern browser or serve it on static hosting. There are no runtime dependencies or backend services. Build-time environment values are public if bundled; never add secrets.

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
- [English/German localization](docs/localization.md)
- [MVP readiness review](docs/readiness-review.md)
- [Stripe sandbox links and verification](docs/sandbox-verification.md)
- [Architecture decisions](docs/adr/)
- [Implementation issues](https://github.com/bh2smith/contribute/issues)

Repository visibility is private. Deployment and any visibility changes require a separate decision.

The handoff is `dist/index.html` (approximately 14 KB with the bilingual starter configuration). CI publishes it as the `contribute-html` artifact. No runtime CDN or package installation is required; checkout still needs internet access.
