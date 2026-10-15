import { invalidSettings } from './types';
import type { PaymentProvider } from './types';
import { parseCheckoutUrl } from './url';

export const stripeProvider: PaymentProvider = {
  id: 'stripe',
  resolveCheckout(settings) {
    if (typeof settings !== 'object' || settings === null || Array.isArray(settings)) return invalidSettings();
    const values = settings as Record<string, unknown>;
    if (Object.keys(values).length !== 1 || !Object.hasOwn(values, 'checkoutUrl')) return invalidSettings();
    const url = parseCheckoutUrl(values['checkoutUrl']);
    if (!url || url.hostname !== 'buy.stripe.com' || !/^\/(?:test_)?[A-Za-z0-9]+$/.test(url.pathname)) {
      return invalidSettings();
    }
    return { available: true, url: url.href };
  },
};
