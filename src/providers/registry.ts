import type { PaymentOption } from '../core/config';
import { stripeProvider } from './stripe';
import { invalidSettings } from './types';
import type { CheckoutResult, PaymentProvider } from './types';
import { parseCheckoutUrl } from './url';

/** Registry construction is a developer operation; duplicate IDs are errors. */
export function createCheckoutResolver(providers: readonly PaymentProvider[]) {
  const registry = new Map<string, PaymentProvider>();
  for (const provider of providers) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(provider.id) || registry.has(provider.id)) {
      throw new Error('Provider identifiers must be valid and unique.');
    }
    registry.set(provider.id, provider);
  }
  return (option: Pick<PaymentOption, 'provider' | 'providerConfig'>): CheckoutResult => {
    const provider = registry.get(option.provider);
    if (!provider) {
      return { available: false, reason: 'unsupported-provider', message: 'This payment provider is not available.' };
    }
    try {
      const result = provider.resolveCheckout(option.providerConfig);
      // An adapter must never bypass the shared HTTPS/privacy boundary.
      if (result.available && !parseCheckoutUrl(result.url)) return invalidSettings();
      return result;
    } catch {
      return { available: false, reason: 'provider-error', message: 'This checkout option is temporarily unavailable.' };
    }
  };
}

export const resolveCheckout = createCheckoutResolver([stripeProvider]);
