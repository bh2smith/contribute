# Offering configuration (version 1)

`parseCatalogConfig(unknown)` in `src/core/config.ts` validates JSON-shaped public configuration. It returns either `{ success: true, config }` or `{ success: false, issues }`; each issue contains a field path and a corrective message. Invalid input never returns a partially usable catalog. Validation does not coerce values or echo input values in errors.

The schema and parser have no runtime dependencies. The UI validates the catalog selected in `src/config/site.ts` before rendering; invalid configuration shows an unavailable state. The [provider resolver](providers.md) validates checkout destinations separately.

## Fields

| Object | Fields |
| --- | --- |
| Catalog | `version: 1`, non-empty `title`, `offerings` array (may be empty) |
| Offering | `id`, non-empty `title` and `description`, `kind: membership or donation`, non-empty `options` array |
| Payment option | `id`, non-empty `label`, optional `price`, `billing`, `provider`, `providerConfig` |
| Price | Positive safe integer `amountMinor`, uppercase three-letter `currency` |
| Billing | `interval: once, month, or year` |
| Provider settings | `checkoutUrl`: absolute HTTPS URL without credentials, query parameters, or fragments |

Unknown fields are rejected at every level. IDs begin with a lowercase letter and use lowercase letters, digits, and single hyphens between segments. Offering IDs are unique across the catalog; option IDs are unique within their offering. Use `(offering.id, option.id)` as the stable option identity. IDs should remain unchanged when display copy is translated or edited.

## Money and billing

Display copy may be a plain string or `{ en: 'English', de: 'Deutsch' }`. English is required; omitted German falls back to English. See [localization](localization.md). ID and provider fields remain plain identifiers.

Amounts use the currency's smallest unit, avoiding decimal arithmetic: EUR 60.00 is `6000`; JPY 6000 is `6000`. Currency validation checks code syntax, not whether the provider supports or recognizes the currency. Operators must verify actual currency, amount, and billing interval against hosted checkout.

Omit the entire `price` object when an amount is selected or disclosed at checkout. Never use zero or an incomplete price as a substitute. Billing remains explicit even when price is omitted. A recurring interval does not create a subscription; the provider's checkout must already be configured accordingly. Membership and donation offerings can each contain one-time or recurring options.

## Provider and privacy boundaries

`provider` is a stable provider identifier, independent of display data. A syntactically valid but unregistered provider passes schema validation; the provider layer must mark it unavailable. The current public provider settings are deliberately limited to `checkoutUrl`; future settings require an explicit schema extension rather than an unrestricted metadata bag.

The parser checks generic URL safety only. Provider adapters must separately enforce their own allowed hosts and link formats before navigation. Schema-valid does not mean checkout-ready.

No customer fields or secret-key fields are supported. Query parameters and fragments are rejected to prevent prefilling personal data through those channels. The parser cannot infer whether human-authored display text or a URL path contains sensitive information: operators must supply public copy and public hosted-checkout links only. This is not a general-purpose personal-data detector.

## Examples

`src/config/example.ts` contains generic annual membership, one-time donation, and monthly donation examples. All URLs use `example.com` placeholders and cannot accept payments. Replace them with validated provider links before enabling checkout. The starter site imports these examples so the catalog can be previewed without enabling payments. Replace the selected configuration in `src/config/site.ts` for a real consumer.
