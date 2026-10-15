# CSS themes

Set `siteTheme` in `src/config/site.ts` to `meadow` (default, light) or `midnight` (dark). Both theme files are imported by the entry point; selection is a build-time configuration value, with no storage, preference tracking, or theme picker.

`src/style.css` defines the shared layout. Theme files in `src/themes/` set colors through custom properties on `.catalog[data-theme="..."]`. Component selectors are scoped beneath `.catalog`; the only global rule removes the body's margin.

| Token | Purpose |
| --- | --- |
| `--catalog-background`, `--catalog-surface` | Page and card backgrounds |
| `--catalog-text`, `--catalog-muted` | Primary and secondary text |
| `--catalog-border` | Card boundaries and separators |
| `--catalog-accent`, `--catalog-on-accent` | Checkout link colors |
| `--catalog-focus` | Visible keyboard focus outline |
| `--catalog-font`, `--catalog-radius` | Typography and card corner radius |

To add a theme, create a scoped CSS file, import it in `src/main.ts`, and extend the `Theme` union. Keep payment behavior in the provider layer. Configuration text is rendered as plain text, never HTML.

The grid collapses to one column on narrow screens. Standard links support keyboard navigation and have explicit focus outlines and descriptive accessible names. Unavailable options contain explanatory text and no link. There are no animations or transitions.

For UI changes, briefly check narrow and wide layouts, readable contrast, and keyboard focus in the browser. Do not add a UI behavior-test framework for this simple catalog. Automated tests remain focused on configuration and checkout validation. English/German localization remains tracked in #7.
