import type { LocalizedText, PaymentOption } from './core/config';

export type Locale = 'en' | 'de';
export const messages = {
  en: {
    language: 'Language',
    unavailableTitle: 'Offerings are unavailable',
    unavailableIntro: 'Please check back later. The catalog configuration needs attention.',
    intro: 'Choose how you’d like to support the community. Every contribution makes a difference.',
    membership: 'Membership',
    donation: 'Donation',
    checkout: 'Continue to checkout',
    unavailable: 'Currently unavailable',
    amount: 'See amount at checkout',
    once: 'One-time contribution',
    month: 'Every month',
    year: 'Every year',
    empty: 'We’re getting ready. Offerings will appear here once configured.',
    footer: 'Available options take you to an external checkout to complete your contribution.',
    reasons: {
      'unsupported-provider': 'This payment provider is not available.',
      'invalid-settings': 'Checkout is unavailable because its payment link is not supported.',
      'provider-error': 'This checkout option is temporarily unavailable.',
    },
  },
  de: {
    language: 'Sprache',
    unavailableTitle: 'Angebote sind nicht verfügbar',
    unavailableIntro:
      'Bitte versuche es später erneut. Die Katalogkonfiguration muss überprüft werden.',
    intro:
      'Wähle, wie du die Gemeinschaft unterstützen möchtest. Jeder Beitrag macht einen Unterschied.',
    membership: 'Mitgliedschaft',
    donation: 'Spende',
    checkout: 'Weiter zur Zahlung',
    unavailable: 'Derzeit nicht verfügbar',
    amount: 'Betrag auf der Zahlungsseite ansehen',
    once: 'Einmaliger Beitrag',
    month: 'Monatlich',
    year: 'Jährlich',
    empty: 'Wir bereiten alles vor. Die Angebote erscheinen hier, sobald sie eingerichtet sind.',
    footer:
      'Verfügbare Angebote führen zu einer externen Zahlungsseite, auf der du deinen Beitrag abschließen kannst.',
    reasons: {
      'unsupported-provider': 'Dieser Zahlungsanbieter ist nicht verfügbar.',
      'invalid-settings':
        'Die Zahlung ist nicht verfügbar, da der Zahlungslink nicht unterstützt wird.',
      'provider-error': 'Diese Zahlungsmöglichkeit ist vorübergehend nicht verfügbar.',
    },
  },
} satisfies Record<Locale, Record<string, string | Record<string, string>>>;

export function translate(value: LocalizedText, locale: Locale): string {
  return typeof value === 'string' ? value : (value[locale] ?? value.en);
}

export function priceLabel(option: PaymentOption, locale: Locale): string {
  const copy = messages[locale];
  const interval = copy[option.billing.interval];
  if (!option.price) return `${copy.amount} · ${interval}`;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: option.price.currency,
  });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return `${formatter.format(option.price.amountMinor / 10 ** digits)} · ${interval}`;
}
