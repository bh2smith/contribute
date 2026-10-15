# ADR 0004: No personal-data collection by the application

Status: Accepted

## Context

The catalog only needs public offering configuration. Hosted checkout handles the customer relationship and payment information.

## Decision

Do not collect, transmit, or persist personal data through application forms, analytics, cookies, local storage, accounts, or logs. Do not accept customer information in configuration or forward personal information through checkout URL parameters. Use ordinary navigation to hosted checkout, where the provider collects necessary details.

## Consequences

There is no application customer database, personalization, donation history, or membership administration. Hosting and checkout services may independently process IP addresses or customer information; operators must review their policies and logging settings. This decision describes the application's boundary and is not a claim that external services collect no data. Any expansion requires a new decision.
