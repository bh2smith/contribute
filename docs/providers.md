# Hosted-checkout providers

`resolveCheckout(option)` in `src/providers/registry.ts` dispatches by provider ID. Call it with a validated payment option; the UI must use only the returned URL, never the raw configured URL.

The result is a discriminated union:

- `{ available: true, url }`: a locally validated destination suitable for a normal navigation link.
- `{ available: false, reason, message }`: no URL; render an unavailable option with explanatory text. Reasons are `unsupported-provider`, `invalid-settings`, and `provider-error`.

Resolution is synchronous and performs no network requests, API calls, navigation, or payment processing. Availability means the URL passed local checks, not that the provider has confirmed the link is active, belongs to the intended account, or matches the displayed price. Operators must verify those facts separately. Returning from checkout is never proof of payment.

## Stripe support

The initial adapter accepts canonical HTTPS URLs on exactly `buy.stripe.com`, with one alphanumeric path segment, optionally prefixed by `test_`. Both standard and test-mode link formats are supported. No link-length assumption is made.

Credentials, non-default ports, query parameters, fragments, additional path segments, encoded path characters, and URLs requiring normalization are rejected. Explicit default ports, trailing whitespace, uppercase hostnames, and dot segments are also rejected; paste the canonical link copied from Stripe. Checkout Session and billing portal links are outside scope.

Stripe also supports [custom domains](https://support.stripe.com/questions/custom-domain-on-stripe-hosted-surfaces-faq). This initial adapter deliberately does not accept them: support requires explicit approved-host configuration and tests in a future change. Never relax the exact-host rule to a substring check.

Copy links created through [Stripe Payment Links](https://docs.stripe.com/payment-links) into `providerConfig.checkoutUrl`. Do not include secret keys, customer details, or prefill/tracking parameters. The generic examples remain unavailable because they use `example.com` placeholders.

## Adding an adapter

Implement `PaymentProvider` with a stable `id` and `resolveCheckout(settings: unknown)`. Validate the public settings, host allowlist, and provider-specific path rules within that adapter. Return an unavailable result for unsupported input without echoing configuration values.

Register the adapter through `createCheckoutResolver`. Duplicate or invalid provider identifiers fail at registry construction. Unknown providers produce unavailable results, and thrown adapter errors are contained without exposing exception details. The registry also checks successful adapter URLs against the shared HTTPS/privacy rules. Shared UI and core offering models need no provider-specific branches.

Only Stripe is registered in production. A test-only adapter proves substitution. No dynamic plugin loading or provider SDK is required.
