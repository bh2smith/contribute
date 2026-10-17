export type LocalizedText = string | { en: string; de?: string };

/** All configuration is public. Amounts use the currency's smallest unit. */
export interface PaymentOption {
  id: string;
  label: LocalizedText;
  price?: { amountMinor: number; currency: string };
  billing: { interval: 'once' | 'month' | 'year' };
  provider: string;
  providerConfig: { checkoutUrl: string };
}

export interface Offering {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  kind: 'membership' | 'donation';
  options: PaymentOption[];
}

export interface CatalogConfig {
  version: 1;
  title: LocalizedText;
  offerings: Offering[];
}

export interface ConfigIssue { path: string; message: string }
export type ConfigResult =
  | { success: true; config: CatalogConfig }
  | { success: false; issues: ConfigIssue[] };

/** Validate untrusted JSON without coercion or echoing potentially sensitive values. */
export function parseCatalogConfig(input: unknown): ConfigResult {
  const issues: ConfigIssue[] = [];
  const fail = (path: string, message: string): void => { issues.push({ path, message }); };
  const object = (value: unknown, path: string, keys: string[]): Record<string, unknown> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      fail(path, 'Expected an object.');
      return {};
    }
    const record = value as Record<string, unknown>;
    if (Object.keys(record).some((key) => !keys.includes(key))) {
      fail(path, 'Unexpected fields. Only documented public configuration fields are allowed.');
    }
    return record;
  };
  const string = (value: unknown, path: string): string => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      fail(path, 'Expected a non-empty string.');
      return '';
    }
    return value;
  };
  const localized = (value: unknown, path: string): LocalizedText => {
    if (typeof value === 'string') return string(value, path);
    const translations = object(value, path, ['en', 'de']);
    const result: { en: string; de?: string } = { en: string(translations['en'], `${path}.en`) };
    if ('de' in translations) result.de = string(translations['de'], `${path}.de`);
    return result;
  };
  const id = (value: unknown, path: string): string => {
    const result = string(value, path);
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(result)) {
      fail(path, 'Use a lowercase identifier beginning with a letter, with optional hyphens.');
    }
    return result;
  };
  const array = (value: unknown, path: string): unknown[] => {
    if (!Array.isArray(value)) { fail(path, 'Expected an array.'); return []; }
    return value as unknown[];
  };
  const unique = (value: string, seen: Set<string>, path: string): void => {
    if (seen.has(value)) fail(path, 'Duplicate identifier in this collection.');
    seen.add(value);
  };
  const root = object(input, '$', ['version', 'title', 'offerings']);
  if (root['version'] !== 1) fail('$.version', 'Expected schema version 1.');
  const title = localized(root['title'], '$.title');
  const offeringIds = new Set<string>();
  const offerings = array(root['offerings'], '$.offerings').map((value, index): Offering => {
    const path = `$.offerings[${String(index)}]`;
    const entry = object(value, path, ['id', 'title', 'description', 'kind', 'options']);
    const offeringId = id(entry['id'], `${path}.id`);
    unique(offeringId, offeringIds, `${path}.id`);
    const kind = entry['kind'];
    if (kind !== 'membership' && kind !== 'donation') fail(`${path}.kind`, 'Expected membership or donation.');
    const optionIds = new Set<string>();
    const options = array(entry['options'], `${path}.options`).map((raw, optionIndex): PaymentOption => {
      const optionPath = `${path}.options[${String(optionIndex)}]`;
      const option = object(raw, optionPath, ['id', 'label', 'price', 'billing', 'provider', 'providerConfig']);
      const optionId = id(option['id'], `${optionPath}.id`);
      unique(optionId, optionIds, `${optionPath}.id`);
      const billing = object(option['billing'], `${optionPath}.billing`, ['interval']);
      const interval = billing['interval'];
      if (interval !== 'once' && interval !== 'month' && interval !== 'year') {
        fail(`${optionPath}.billing.interval`, 'Expected once, month, or year.');
      }
      const provider = id(option['provider'], `${optionPath}.provider`);
      const settings = object(option['providerConfig'], `${optionPath}.providerConfig`, ['checkoutUrl']);
      const checkoutUrl = string(settings['checkoutUrl'], `${optionPath}.providerConfig.checkoutUrl`);
      try {
        const url = new URL(checkoutUrl);
        if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
          fail(`${optionPath}.providerConfig.checkoutUrl`, 'Use an HTTPS URL without credentials, query parameters, or fragments.');
        }
      } catch {
        fail(`${optionPath}.providerConfig.checkoutUrl`, 'Expected an absolute HTTPS URL.');
      }
      const result: PaymentOption = {
        id: optionId,
        label: localized(option['label'], `${optionPath}.label`),
        billing: { interval: interval === 'month' || interval === 'year' ? interval : 'once' },
        provider,
        providerConfig: { checkoutUrl },
      };
      if ('price' in option) {
        const price = object(option['price'], `${optionPath}.price`, ['amountMinor', 'currency']);
        const amount = price['amountMinor'];
        if (typeof amount !== 'number' || !Number.isSafeInteger(amount) || amount <= 0) {
          fail(`${optionPath}.price.amountMinor`, 'Expected a positive safe integer in minor currency units.');
        }
        const currency = string(price['currency'], `${optionPath}.price.currency`);
        if (!/^[A-Z]{3}$/.test(currency)) fail(`${optionPath}.price.currency`, 'Expected a three-letter uppercase currency code.');
        result.price = { amountMinor: typeof amount === 'number' ? amount : 0, currency };
      }
      return result;
    });
    if (options.length === 0) fail(`${path}.options`, 'Provide at least one payment option.');
    return {
      id: offeringId,
      title: localized(entry['title'], `${path}.title`),
      description: localized(entry['description'], `${path}.description`),
      kind: kind === 'membership' ? 'membership' : 'donation',
      options,
    };
  });
  if (issues.length > 0) return { success: false, issues };
  return { success: true, config: { version: 1, title, offerings } };
}
