# ADR 0003: CSS-based themes

Status: Accepted

## Context

Different organizations need distinct branding while sharing catalog behavior.

## Decision

Separate structural styles from themes built with CSS custom properties for color, type, spacing, and related visual tokens. Choose the theme through public configuration or build configuration. Keep names, logos, and display copy in consumer configuration; use generic examples in this repository.

## Consequences

The initial implementation needs no CSS-in-JS dependency or runtime theme editor. Themes must preserve keyboard focus, readable contrast, responsive layout, and reduced-motion preferences. Theme overrides must not change checkout behavior.
