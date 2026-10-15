# ADR 0002: Minimal hosted-checkout provider abstraction

Status: Accepted

## Context

Stripe Payment Links is the first integration, while the application must support other hosted-checkout providers without coupling presentation to Stripe.

## Decision

Use a small provider registry and adapter contract: resolve validated public provider settings to an HTTPS checkout destination or an explicit unavailable result. Keep provider-specific settings separate from generic offering fields. Implement only the Stripe Payment Links adapter initially; add no dynamic plugin framework or speculative providers.

Validate URLs using parsed scheme and host rules per adapter. Unknown providers or invalid destinations must not produce active checkout links. Stripe links are created outside the application, with no secret keys or payment API calls.

## Consequences

Shared UI remains provider-independent. Only client-side hosted checkout integrations fit this contract. Displayed price metadata can drift from provider configuration, so operator verification is required. No adapter can assert that a payment completed merely from browser navigation.
