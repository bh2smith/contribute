import { describe, expect, it } from 'vitest';
import { exampleConfig } from '../config/example';
import { parseCatalogConfig } from './config';

function catalog(option: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    version: 1,
    title: 'Community',
    offerings: [
      {
        id: 'membership',
        title: 'Membership',
        description: 'Support activities.',
        kind: 'membership',
        options: [
          {
            id: 'annual',
            label: 'Annual membership',
            price: { amountMinor: 6000, currency: 'EUR' },
            billing: { interval: 'year' },
            provider: 'stripe',
            providerConfig: { checkoutUrl: 'https://example.com/checkout' },
            ...option,
          },
        ],
      },
    ],
  };
}

function expectIssue(input: unknown, path: string): void {
  const result = parseCatalogConfig(input);
  expect(result.success).toBe(false);
  if (!result.success) expect(result.issues.some((issue) => issue.path === path)).toBe(true);
}

const optionPath = '$.offerings[0].options[0]';

describe('catalog configuration', () => {
  it('accepts English fallback copy but rejects malformed translations', () => {
    expect(parseCatalogConfig({ ...catalog(), title: { en: 'Community' } }).success).toBe(true);
    expectIssue({ ...catalog(), title: { de: 'Gemeinschaft' } }, '$.title.en');
    expectIssue(catalog({ label: { en: 'Annual', de: '' } }), `${optionPath}.label.de`);
    expectIssue({ ...catalog(), title: { en: 'Community', fr: 'Communauté' } }, '$.title');
  });
  it('accepts generic membership, donation, and recurring examples', () => {
    expect(parseCatalogConfig(exampleConfig)).toEqual({ success: true, config: exampleConfig });
  });

  it('supports an empty catalog and does not require a registered provider', () => {
    expect(parseCatalogConfig({ version: 1, title: 'Community', offerings: [] }).success).toBe(
      true,
    );
    expect(parseCatalogConfig(catalog({ provider: 'another-provider' })).success).toBe(true);
  });

  it.each([null, [], 'catalog', 1, undefined])('rejects malformed root %s', (input) => {
    expectIssue(input, '$');
  });

  it('reports missing fields, wrong versions, and empty copy', () => {
    expectIssue({}, '$.offerings');
    expectIssue({ ...catalog(), version: 2 }, '$.version');
    expectIssue({ ...catalog(), title: ' ' }, '$.title');
    expectIssue(catalog({ label: '' }), `${optionPath}.label`);
    expectIssue(catalog({ provider: undefined }), `${optionPath}.provider`);
  });

  it.each([0, -1, 1.5, '6000', NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    'rejects invalid amount %s',
    (amountMinor) => {
      expectIssue(
        catalog({ price: { amountMinor, currency: 'EUR' } }),
        `${optionPath}.price.amountMinor`,
      );
    },
  );

  it.each(['eur', 'EU', 'EURO', '', undefined])('rejects malformed currency %s', (currency) => {
    expectIssue(catalog({ price: { amountMinor: 100, currency } }), `${optionPath}.price.currency`);
  });

  it.each(['week', '', null, undefined])('rejects unsupported billing interval %s', (interval) => {
    expectIssue(catalog({ billing: { interval } }), `${optionPath}.billing.interval`);
  });

  it.each(['Invalid ID', '1-option', 'trailing-', 'double--hyphen'])(
    'rejects unstable ID %s',
    (id) => {
      expectIssue(catalog({ id }), `${optionPath}.id`);
    },
  );

  it('rejects duplicate offering IDs and option IDs within an offering', () => {
    const first = exampleConfig.offerings[0];
    if (!first) throw new Error('Membership example is missing.');
    expectIssue({ ...exampleConfig, offerings: [first, first] }, '$.offerings[1].id');
    const repeated = { ...first, options: [first.options[0], first.options[0]] };
    expectIssue({ ...exampleConfig, offerings: [repeated] }, '$.offerings[0].options[1].id');
  });

  it('allows the same option ID in different offerings', () => {
    const first = exampleConfig.offerings[0];
    expect(
      parseCatalogConfig({ ...exampleConfig, offerings: [first, { ...first, id: 'second' }] })
        .success,
    ).toBe(true);
  });

  it('rejects empty options, invalid kinds, and malformed nested objects', () => {
    const first = exampleConfig.offerings[0];
    expectIssue(
      { ...exampleConfig, offerings: [{ ...first, options: [] }] },
      '$.offerings[0].options',
    );
    expectIssue(
      { ...exampleConfig, offerings: [{ ...first, kind: 'other' }] },
      '$.offerings[0].kind',
    );
    expectIssue(catalog({ billing: null }), `${optionPath}.billing`);
    expectIssue(catalog({ price: undefined }), `${optionPath}.price`);
    expectIssue(catalog({ providerConfig: [] }), `${optionPath}.providerConfig`);
  });

  it.each([
    'http://example.com/pay',
    'javascript:alert(1)',
    '/relative',
    'https://user:password@example.com/pay',
    'https://example.com/pay?email=private',
    'https://example.com/pay#private',
  ])('rejects unsafe or personalized checkout URL %s', (checkoutUrl) => {
    expectIssue(
      catalog({ providerConfig: { checkoutUrl } }),
      `${optionPath}.providerConfig.checkoutUrl`,
    );
  });

  it('rejects unsupported data fields without including their contents in errors', () => {
    const input = catalog({
      providerConfig: { checkoutUrl: 'https://example.com/pay', secretKey: 'do-not-echo' },
    });
    expectIssue(input, `${optionPath}.providerConfig`);
    expectIssue({ ...catalog(), customerEmail: 'do-not-echo' }, '$');
    expectIssue(catalog({ customer: 'do-not-echo' }), optionPath);
    expect(JSON.stringify(parseCatalogConfig(input))).not.toContain('do-not-echo');
  });

  it('returns a detached validated result rather than the original mutable object', () => {
    const result = parseCatalogConfig(exampleConfig);
    if (!result.success) throw new Error('Example should be valid.');
    expect(result.config).not.toBe(exampleConfig);
    expect(result.config.offerings[0]?.options[0]?.providerConfig).not.toBe(
      exampleConfig.offerings[0]?.options[0]?.providerConfig,
    );
  });
});
