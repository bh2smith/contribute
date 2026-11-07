import { createNmsPreviewConfig } from './config';
import { sandboxDonationUrl } from '../../src/config/sandbox';
import type { CatalogConfig } from '../../src/core/config';

// Public test-only links with amounts and billing intervals matching the preview.
const links: Record<string, string> = {
  'basic/annual': 'https://buy.stripe.com/test_dRm28q8ot2b53ffab4dIA03',
  'basic/monthly': 'https://buy.stripe.com/test_eVqfZg48d3f9033erkdIA04',
  'plus/annual': 'https://buy.stripe.com/test_9B64gy7kp171dTTbf8dIA05',
  'plus/monthly': 'https://buy.stripe.com/test_fZu4gydIN4jd9DDcjcdIA06',
  'builder/annual': 'https://buy.stripe.com/test_14A28q48d4jd3ff1EydIA07',
  'builder/monthly': 'https://buy.stripe.com/test_eVqfZg8oteXRg21bf8dIA08',
  'alumni/annual': 'https://buy.stripe.com/test_fZubJ048d8zt9DDbf8dIA09',
  'donation/one-time': sandboxDonationUrl,
};

/** Working test checkouts for the consumer website demonstration. */
export function createNmsSandboxConfig(): CatalogConfig {
  const preview = createNmsPreviewConfig();
  return {
    ...preview,
    title: {
      en: 'Sandbox demo — Friends of NMS (no real payments)',
      de: 'Sandbox-Demo — Friends of NMS (keine echten Zahlungen)',
    },
    offerings: preview.offerings.map((offering) => ({
      ...offering,
      options: offering.options.map((option) => {
        const checkoutUrl = links[`${offering.id}/${option.id}`];
        if (!checkoutUrl) throw new Error('Missing consumer sandbox payment link.');
        return { ...option, providerConfig: { checkoutUrl } };
      }),
    })),
  };
}
