export type CheckoutResult =
  | { available: true; url: string }
  | {
      available: false;
      reason: 'unsupported-provider' | 'invalid-settings' | 'provider-error';
      message: string;
    };

/** Adapters validate their own public settings and destination host rules. */
export interface PaymentProvider {
  readonly id: string;
  resolveCheckout(settings: unknown): CheckoutResult;
}

export function invalidSettings(): CheckoutResult {
  return {
    available: false,
    reason: 'invalid-settings',
    message: 'Checkout is unavailable because its payment link is not supported.',
  };
}
