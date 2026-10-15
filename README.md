# contribute

A generic, client-side, configuration-driven application for presenting memberships, donations, and recurring payment offerings through hosted checkout.

**Status: planning only.** This repository contains architecture decisions and an implementation backlog; no application has been implemented.

## Principles

- Static hosting; no application backend, payment processing, or secrets.
- Interchangeable hosted-checkout providers, starting with Stripe Payment Links.
- Reusable offering configuration and CSS themes, with no organization-specific assumptions in core code.
- No personal-data collection or storage by the application. Checkout providers handle their own customer and payment information.

## Documentation

- [Implementation plan](PLAN.md)
- [Architecture](docs/architecture.md)
- [Architecture decisions](docs/adr/)
- [Implementation issues](https://github.com/bh2smith/contribute/issues)

Repository visibility is private. Deployment and any visibility changes require a separate decision.
