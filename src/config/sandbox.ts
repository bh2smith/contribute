import { exampleConfig } from './example';
import type { CatalogConfig } from '../core/config';

// Public test-only Payment Links, created in the operator's Stripe sandbox.
const links: Record<string, string> = {
  'membership/annual': 'https://buy.stripe.com/test_00w00i9sx2b5g213MGdIA00',
  'donation/monthly': 'https://buy.stripe.com/test_eVq5kCdIN6rl3fffvodIA01',
  'donation/one-time': 'https://buy.stripe.com/test_00w8wOcEJ8zt1774QKdIA02',
};

export function createSandboxConfig(): CatalogConfig {
  return {
    ...exampleConfig,
    title: { en: 'Sandbox — test contributions only', de: 'Sandbox — nur Testbeiträge' },
    offerings: exampleConfig.offerings.map((offering) => ({
      ...offering,
      options: offering.options.map((option) => {
        const checkoutUrl = links[`${offering.id}/${option.id}`];
        if (!checkoutUrl) throw new Error('Missing sandbox payment link.');
        return { ...option, providerConfig: { checkoutUrl } };
      }),
    })),
  };
}
