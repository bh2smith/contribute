# Implementation plan

The static foundation (#1) and configuration validation (#2) are complete. The provider layer (#3) is complete; catalog rendering and themes (#4) are the current increment. Issues are the source of truth for progress; milestones have no committed delivery dates. Deferred requirements are tracked in issue #7.

## Milestone 1: Static catalog foundation

1. Establish static application tooling and checks. Choose a lightweight stack and produce only static build artifacts.
2. Define and validate offering configuration. Cover memberships, donations, one-time and recurring options, and provider-specific public configuration.
3. Implement hosted-checkout abstraction and Stripe Payment Links adapter. Validate destinations and fail safely for invalid or unsupported options.

## Milestone 2: Themeable MVP readiness

4. Build an accessible catalog and CSS theme system. Keep provider details out of presentation components.
5. Add generic examples and operator documentation. Explain configuration, themes, Stripe setup, and static hosting without deploying.
6. Verify checkout boundaries, accessibility, and privacy. Keep automated tests focused on configuration and destination validation; use brief manual browser checks for UI behavior, accessibility, and responsive layout.

## Dependencies and scope

- Issue 2 follows 1; issue 3 follows 2; issue 4 follows 2 and 3; issue 5 follows 3 and 4; issue 6 follows 3–5.
- No backend, accounts, analytics, customer database, embedded payment fields, webhook processing, or membership administration.
- No live charges or public deployment are part of this plan.
- Additional providers and localization can follow the initial MVP when requested.
- Displayed amounts and intervals must match the provider's configured checkout; the application cannot verify payment completion or enforce subscription state.
