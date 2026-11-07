import { createNmsPreviewConfig } from './config';
import { sandboxDonationUrl } from '../../src/config/sandbox';
import type { CatalogConfig } from '../../src/core/config';

/** At least one working test checkout for the consumer website demonstration. */
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
      options: offering.options.map((option) =>
        offering.id === 'donation' && option.id === 'one-time'
          ? { ...option, providerConfig: { checkoutUrl: sandboxDonationUrl } }
          : option,
      ),
    })),
  };
}
