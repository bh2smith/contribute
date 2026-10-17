import type { CatalogConfig } from '../core/config';

/** Documentation-only destinations; these do not accept payments. */
export const exampleConfig = {
  version: 1,
  title: { en: 'Support our community', de: 'Unterstütze unsere Gemeinschaft' },
  offerings: [
    {
      id: 'membership',
      title: { en: 'Become a member', de: 'Werde Mitglied' },
      description: { en: 'Support community activities throughout the year.', de: 'Unterstütze das ganze Jahr über die Aktivitäten der Gemeinschaft.' },
      kind: 'membership',
      options: [
        {
          id: 'annual', label: { en: 'Annual membership', de: 'Jahresmitgliedschaft' },
          price: { amountMinor: 6000, currency: 'EUR' },
          billing: { interval: 'year' }, provider: 'stripe',
          providerConfig: { checkoutUrl: 'https://example.com/replace-with-membership-link' },
        },
      ],
    },
    {
      id: 'donation', title: { en: 'Make a donation', de: 'Spende für die Gemeinschaft' },
      description: { en: 'Help fund the next community project.', de: 'Hilf mit, das nächste Gemeinschaftsprojekt zu finanzieren.' }, kind: 'donation',
      options: [
        {
          id: 'one-time', label: { en: 'Choose your contribution at checkout', de: 'Wähle deinen Beitrag auf der Zahlungsseite' },
          billing: { interval: 'once' }, provider: 'stripe',
          providerConfig: { checkoutUrl: 'https://example.com/replace-with-donation-link' },
        },
        {
          id: 'monthly', label: { en: 'Monthly support', de: 'Monatliche Unterstützung' },
          price: { amountMinor: 1000, currency: 'EUR' },
          billing: { interval: 'month' }, provider: 'stripe',
          providerConfig: { checkoutUrl: 'https://example.com/replace-with-monthly-link' },
        },
      ],
    },
  ],
} satisfies CatalogConfig;
