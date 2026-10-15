# Operator guide

Contribute is a static catalog that sends visitors to hosted checkout. An operator configures public offerings and builds the deliverable; visitors do not need Node.js, a login, or an application backend.

## Configure the catalog

1. Start with `src/config/example.ts`. It includes annual membership, a one-time donation with an amount chosen at checkout, and fixed monthly support. Its `example.com` links are deliberately unavailable placeholders, not test payment links.
2. Copy the example to a consumer configuration file, keeping organization-specific copy out of shared components. Import that configuration as `siteConfig` in `src/config/site.ts`.
3. Set titles, descriptions, option labels, and stable IDs. Set fixed prices in minor currency units: EUR 60.00 is `6000`. Use `once`, `month`, or `year` for billing. Omit `price` for a choose-your-amount one-time donation.
4. Replace placeholder `checkoutUrl` values with links created in the intended payment-provider account. The initial provider ID is `stripe`.
5. Select `siteTheme` as `meadow` or `midnight`. Theme selection happens before building; there is no visitor preference storage. See [themes](themes.md) for visual customization.

Keep all configuration public: no customer information, API keys, account credentials, or private operational notes. See the [configuration reference](configuration.md) for validation rules.

## Create Stripe links

Use the Stripe Dashboard to create Payment Links; this project needs no Stripe API key or SDK. Choose a fixed product/price for fixed contributions, a recurring price for subscriptions, or the customer-chosen amount model for one-time donations. Stripe's customer-chosen amount model does not currently support recurring payments. See [Stripe's creation guide](https://docs.stripe.com/payment-links/create).

For the initial adapter, copy the standard `https://buy.stripe.com/...` URL. Custom domains, query parameters, and fragments are unsupported. Test-mode links use the same host with a `test_` path prefix; use links from your own test environment during verification rather than inventing a token.

Check that each destination belongs to the intended account and matches the displayed amount, currency, and billing interval. Review any provider-side tax, currency conversion, or extra options that could change the final total. Local validation checks URL structure only; it cannot determine ownership, activity, or pricing.

Stripe handles checkout, recurring billing, receipts, and payment status. Membership here is an offering label, not entitlement management. A visitor returning from checkout is not proof of payment. Confirm payments and handle refunds or cancellations in the provider's system.

## Build and review

With Node.js 24 and npm installed on the build machine:

```sh
npm ci
npm run check
npm run preview
```

The check command runs strict type checking, linting, focused configuration/provider validation tests, and the production build. Open the local address printed by the preview command. Briefly review the configured text, mobile and desktop layout, keyboard focus, and the intended test-mode destinations. There is no UI behavior-test framework. Creating production links or performing live charges is separate release work.

An invalid catalog shows an unavailable page. An invalid or unsupported checkout destination shows a non-clickable option. Check [configuration](configuration.md) and [provider rules](providers.md) when troubleshooting.

## Compiled handoff and hosting

The intended handoff is a lightweight compiled deliverable, preferably **one self-contained HTML file** with bundled CSS and JavaScript. It must remain fully client-side and require no runtime CDN, package installation, or application server. Packaging that single-file artifact is tracked in #7 and has not yet been implemented.

**Today**, `npm run build` produces `dist/index.html` plus `dist/assets/`. Keep the entire directory together; sending only the current `index.html` will omit required assets. Preview it through a static server rather than assuming it works when opened directly from disk.

For a conventional static host, serve the contents of `dist/` at the chosen root or subdirectory. Relative asset paths support subdirectory hosting. No server-side routing, database, secret environment variables, or build runtime is required on the host. A CMS that strips scripts is not equivalent to static hosting; confirm the recipient's embedding constraints before final packaging. A strict content-security policy may also need an agreed approach for inlined assets.

Deploy only after the release decision; keep the GitHub repository private. Hosted checkout still needs an internet connection even if the final catalog is delivered as one local HTML file. Configuration changes require a rebuild and replacement of the compiled deliverable. Retain the previous deliverable for rollback.

## Privacy boundary

The catalog has no identity/payment forms, cookies, analytics, or customer-data storage. Checkout navigation uses a no-referrer link. The host may retain access logs, and the checkout provider collects the information needed for payment. Review those services' settings and policies separately; a static catalog does not make the entire payment journey anonymous.
