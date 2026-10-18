import { describe, expect, it } from 'vitest';
import { exampleConfig } from '../config/example';
import { createCheckoutResolver, resolveCheckout } from './registry';
import { stripeProvider } from './stripe';
import type { PaymentProvider } from './types';

describe('Stripe hosted checkout', () => {
  it.each(['https://buy.stripe.com/aB123cD', 'https://buy.stripe.com/test_aB123cD'])(
    'resolves standard and test-mode link formats without changing them: %s',
    (url) => {
      expect(resolveCheckout({ provider: 'stripe', providerConfig: { checkoutUrl: url } })).toEqual(
        { available: true, url },
      );
    },
  );

  it.each([
    'javascript:alert(1)',
    'http://buy.stripe.com/abc',
    '//buy.stripe.com/abc',
    'https://buy.stripe.com.evil.example/abc',
    'https://evilbuy.stripe.com/abc',
    'https://buy.stripe.com@evil.example/abc',
    'https://user@buy.stripe.com/abc',
    'https://buy.stripe.com:8443/abc',
    'https://buy.stripe.com:443/abc',
    'https://buy.stripe.com./abc',
    'https://checkout.stripe.com/abc',
    'https://billing.stripe.com/abc',
    'https://pay.example.com/abc',
    'https://buy.stripe.com/',
    'https://buy.stripe.com/test_',
    'https://buy.stripe.com/abc/more',
    'https://buy.stripe.com/abc/',
    'https://buy.stripe.com/abc?prefilled_email=private',
    'https://buy.stripe.com/abc#private',
    'https://buy.stripe.com/abc?',
    'https://buy.stripe.com/abc#',
    ' https://buy.stripe.com/abc',
    'https://buy.stripe.com/abc\n',
    'https://buy.stripe.com/old/../abc',
    'https://buy.stripe.com/%61bc',
    'https://buy.stripe.com\\abc',
    'https://BUY.STRIPE.COM/abc',
  ])('rejects unsupported or ambiguous destination %s', (checkoutUrl) => {
    expect(stripeProvider.resolveCheckout({ checkoutUrl })).toMatchObject({
      available: false,
      reason: 'invalid-settings',
    });
    expect(stripeProvider.resolveCheckout({ checkoutUrl })).not.toHaveProperty('url');
  });

  it.each([
    null,
    undefined,
    [],
    {},
    { checkoutUrl: 42 },
    { checkoutUrl: 'https://buy.stripe.com/abc', secretKey: 'private' },
  ])('rejects malformed settings without throwing or exposing values', (settings) => {
    const result = stripeProvider.resolveCheckout(settings);
    expect(result).toMatchObject({ available: false, reason: 'invalid-settings' });
    expect(JSON.stringify(result)).not.toContain('private');
  });

  it('keeps the generic example destinations unavailable', () => {
    for (const offering of exampleConfig.offerings) {
      for (const option of offering.options) expect(resolveCheckout(option).available).toBe(false);
    }
  });
});

describe('provider registry', () => {
  const option = {
    provider: 'test-provider',
    providerConfig: { checkoutUrl: 'https://example.com/checkout' },
  };
  const adapter: PaymentProvider = {
    id: 'test-provider',
    resolveCheckout: () => ({ available: true, url: 'https://example.com/checkout' }),
  };

  it('allows substitution without changing core configuration or presentation', () => {
    expect(createCheckoutResolver([adapter])(option)).toEqual({
      available: true,
      url: 'https://example.com/checkout',
    });
    expect(resolveCheckout(option)).toMatchObject({
      available: false,
      reason: 'unsupported-provider',
    });
  });

  it.each(['missing', 'constructor', '__proto__', 'toString'])(
    'fails safely for unknown provider %s',
    (provider) => {
      expect(resolveCheckout({ ...option, provider })).toMatchObject({
        available: false,
        reason: 'unsupported-provider',
      });
    },
  );

  it('rejects duplicate and invalid registry identifiers', () => {
    expect(() => createCheckoutResolver([adapter, adapter])).toThrow('unique');
    expect(() => createCheckoutResolver([{ ...adapter, id: '' }])).toThrow('valid');
  });

  it('contains adapter errors and does not expose exception details', () => {
    const resolve = createCheckoutResolver([
      {
        ...adapter,
        resolveCheckout: () => {
          throw new Error('private');
        },
      },
    ]);
    const result = resolve(option);
    expect(result).toMatchObject({ available: false, reason: 'provider-error' });
    expect(JSON.stringify(result)).not.toContain('private');
  });

  it.each([
    'javascript:alert(1)',
    'https://example.com/checkout?email=private',
    'https://user@example.com/checkout',
  ])('rejects adapter output that violates shared URL rules: %s', (url) => {
    const resolve = createCheckoutResolver([
      { ...adapter, resolveCheckout: () => ({ available: true, url }) },
    ]);
    expect(resolve(option)).toMatchObject({ available: false, reason: 'invalid-settings' });
  });

  it('preserves an adapter unavailable result', () => {
    const result = {
      available: false,
      reason: 'invalid-settings',
      message: 'Unavailable.',
    } as const;
    expect(createCheckoutResolver([{ ...adapter, resolveCheckout: () => result }])(option)).toEqual(
      result,
    );
  });
});
