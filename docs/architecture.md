# Architecture

## Scope

Contribute presents configurable offerings and sends visitors to an external hosted checkout. Memberships are catalog offerings, not managed entitlements. The first provider is Stripe Payment Links; the core model and interface remain provider-independent.

## Data flow

Public configuration → validated offering model → themed catalog → provider adapter → HTTPS hosted checkout.

The browser loads static assets and public configuration. A visitor selects an option and navigates to the provider. Payment details, recurring billing, receipts, and customer support workflows belong to the provider and operator. A return URL is not proof of payment.

## Boundaries

- **Configuration:** offering identifiers, display copy, optional amount/currency and billing interval, provider identifier, and public provider-specific settings. Amount representation and schema will be settled in the configuration issue. Secrets and customer information must never enter configuration or build artifacts.
- **Core:** validated offerings and provider dispatch, independent of Stripe and organization branding.
- **Providers:** minimal adapter resolving public configuration to a validated checkout URL or an explicit unavailable result. Unknown providers and invalid configuration disable checkout with a useful message. No generic plugin framework is needed initially.
- **Stripe:** consumes pre-created Payment Link URLs; does not create links, use secret keys, or call payment APIs. Destination validation must use parsed URLs, HTTPS, and explicit accepted host rules, rejecting deceptive hostnames and unsafe schemes.
- **Presentation:** accessible cards and links displaying the configured offerings; no Stripe-specific branches in shared components.
- **Themes:** shared structural CSS with documented custom properties and separately selectable theme files. Branding is configuration or theme content.

## Privacy and operations

No application forms for identity or payment information, accounts, cookies, tracking, personal-data persistence, or analytics. Do not append personal information to checkout URLs or echo query parameters into the interface. Hosting providers may independently retain access logs, and checkout providers process personal data under their own policies; operators must review those services rather than claim end-to-end anonymity.

All deliverable assets must work on static hosting. There are no runtime servers, serverless functions, webhooks, or customer databases. Configuration changes require validation and a new static release. Hosting selection and deployment are future work; the repository remains private.

## Decisions

- [Static-only architecture](adr/0001-static-only.md)
- [Hosted-checkout provider abstraction](adr/0002-provider-abstraction.md)
- [CSS themes](adr/0003-css-themes.md)
- [No personal-data collection](adr/0004-no-personal-data.md)
