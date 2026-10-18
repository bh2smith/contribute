# NMS consumer preview

This folder holds the first consumer's configuration, separate from the generic core, themes, and examples. No consumer-specific behavior is added to reusable components. The repository name and default catalog remain generic.

## Build

```sh
bun run build:nms-preview
bun run preview
```

The result is one `dist/index.html` labelled as a draft. This command replaces the previous build in `dist/`; run `bun run build` to restore the generic catalog. All eight checkout destinations use unsupported `example.com` placeholders and remain non-clickable. The generic sandbox prices are not used as consumer payment links.

## Content basis

The published [membership application](https://www.nelson-mandela-schule.net/en/friends-of-nms/membership-application.html), checked 2026-10-18, is the source for tier names, prices, and summarized benefits. English copy is shortened for the cards; German copy is a draft translation. The pricing direction was confirmed in the implementation conversation. No logos or official design assets have been copied.

Keep the published monthly and annual amounts separate: monthly payments are not an annual amount divided by twelve. Minor currency units and billing intervals are explicit in `config.ts`.

## Before release

- Obtain owner approval of both languages, tier benefits, and current prices, including whether the yearbook benefit still applies.
- Confirm approved branding and whether a dedicated theme or logo is needed. The preview uses the existing Meadow theme.
- Confirm membership terms, cancellation/renewal wording, and the relationship between calendar-year membership and provider subscription billing. The old form's application declaration is not copied into this link-only preview.
- Resolve any additional registration requirements outside this application. It does not collect children's names, classes, or other personal information.
- Configure the intended merchant's production links and validate them against these offerings (#21).
- Verify the recipient environment and final handoff (#20).

Issue #19 stays open for the content/branding approval. This preview is reviewable implementation work, not an official published membership application.
