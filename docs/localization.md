# English and German

Both languages are included in the single HTML deliverable. `siteLocale` in `src/config/site.ts` chooses the initial language (`en` or `de`); the default is English. Visitors can change language using the labelled native selector. Selection lasts for the current page only: no cookies, storage, network calls, or browser-language detection. Reloading returns to the configured default.

## Offering content

Catalog titles, offering titles/descriptions, and option labels accept either an existing plain string or a translation object:

```ts
title: { en: 'Become a member', de: 'Werde Mitglied' }
```

English is required in translation objects. German is optional and falls back to English when omitted. Supplied translations must be non-empty; unknown language keys are rejected. A plain string is displayed unchanged in either language. This is a backward-compatible extension of schema version 1; IDs, prices, provider settings, and URLs are never translated.

The example catalog supplies both languages. Interface copy, billing labels, empty/error states, and checkout accessible names live in `src/i18n.ts`. Configuration text continues to render as plain text.

## Formatting and accessibility

`Intl.NumberFormat` formats the configured currency without conversion: EUR 60.00 appears as `€60.00` in English and `60,00 €` in German (with locale-provided spacing). Amounts remain stored in minor units; zero- and three-decimal currencies use their currency-specific scale.

Changing language updates the document language and title and keeps focus on the selector. Native keyboard controls and the existing theme focus outline remain available. The JavaScript-disabled message includes both languages.

The selector controls this catalog only. It does not append locale parameters or personal information to hosted-checkout links; checkout-page language is managed by the provider.
