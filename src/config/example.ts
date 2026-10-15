import type { CatalogConfig } from '../core/config';

/** Documentation-only destinations; these do not accept payments. */
export const exampleConfig = {
  version: 1,
  title: 'Support our community',
  offerings: [
    {
      id: 'membership',
      title: 'Become a member',
      description: 'Support community activities throughout the year.',
      kind: 'membership',
      options: [
        {
          id: 'annual', label: 'Annual membership',
          price: { amountMinor: 6000, currency: 'EUR' },
          billing: { interval: 'year' }, provider: 'stripe',
          providerConfig: { checkoutUrl: 'https://example.com/replace-with-membership-link' },
        },
      ],
    },
    {
      id: 'donation', title: 'Make a donation',
      description: 'Help fund the next community project.', kind: 'donation',
      options: [
        {
          id: 'one-time', label: 'Choose your contribution at checkout',
          billing: { interval: 'once' }, provider: 'stripe',
          providerConfig: { checkoutUrl: 'https://example.com/replace-with-donation-link' },
        },
        {
          id: 'monthly', label: 'Monthly support',
          price: { amountMinor: 1000, currency: 'EUR' },
          billing: { interval: 'month' }, provider: 'stripe',
          providerConfig: { checkoutUrl: 'https://example.com/replace-with-monthly-link' },
        },
      ],
    },
  ],
} satisfies CatalogConfig;
