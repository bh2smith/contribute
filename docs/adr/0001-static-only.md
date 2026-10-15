# ADR 0001: Static-only architecture

Status: Accepted

## Context

The application is a reusable catalog that links to hosted checkout. It does not need to process payments or maintain customer state.

## Decision

Ship static HTML, CSS, JavaScript, and public configuration only. Do not introduce a runtime backend, serverless functions, API secrets, webhooks, or a database. Build-time tooling is allowed but must not embed secrets in outputs.

## Consequences

Static hosting is sufficient. Payment confirmation, entitlement management, and subscription state are outside scope. Return-page navigation cannot establish payment success. A provider requiring a backend requires a new architectural decision.
