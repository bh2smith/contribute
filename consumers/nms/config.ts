import type { CatalogConfig, PaymentOption } from '../../src/core/config';

function membershipOption(
  tier: string,
  interval: 'month' | 'year',
  amountMinor: number,
): PaymentOption {
  return {
    id: interval === 'year' ? 'annual' : 'monthly',
    label:
      interval === 'year'
        ? { en: 'Annual contribution', de: 'Jährlicher Beitrag' }
        : { en: 'Monthly contribution', de: 'Monatlicher Beitrag' },
    price: { amountMinor, currency: 'EUR' },
    billing: { interval },
    provider: 'stripe',
    providerConfig: {
      checkoutUrl: `https://example.com/nms-${tier}-${interval}-not-configured`,
    },
  };
}

/** Review preview only: no approved branding or production payment links. */
export function createNmsPreviewConfig(): CatalogConfig {
  return {
    version: 1,
    title: {
      en: 'Draft — Friends of NMS memberships',
      de: 'Entwurf — Mitgliedschaften bei Friends of NMS',
    },
    offerings: [
      {
        id: 'basic',
        title: { en: 'Basic · per family', de: 'Basic · pro Familie' },
        description: {
          en: 'Support school activities and the IT/library fund.',
          de: 'Unterstütze Schulaktivitäten und den IT-/Bibliotheksfonds.',
        },
        kind: 'membership',
        options: [
          membershipOption('basic', 'year', 12000),
          membershipOption('basic', 'month', 1100),
        ],
      },
      {
        id: 'plus',
        title: { en: 'Plus · per family', de: 'Plus · pro Familie' },
        description: {
          en: 'Add support for children who need help joining trips and events.',
          de: 'Hilf zusätzlich Kindern bei der Teilnahme an Klassenfahrten und Veranstaltungen.',
        },
        kind: 'membership',
        options: [membershipOption('plus', 'year', 16000), membershipOption('plus', 'month', 1500)],
      },
      {
        id: 'builder',
        title: { en: 'Builder · per family', de: 'Builder · pro Familie' },
        description: {
          en: 'Support school improvements and staff development; includes a yearbook.',
          de: 'Fördere Schulverbesserungen und Fortbildungen; ein Jahrbuch ist enthalten.',
        },
        kind: 'membership',
        options: [
          membershipOption('builder', 'year', 22000),
          membershipOption('builder', 'month', 2000),
        ],
      },
      {
        id: 'alumni',
        title: { en: 'Alumni support', de: 'Unterstützung durch Ehemalige' },
        description: {
          en: 'Stay connected and support the school after leaving.',
          de: 'Bleibe nach der Schulzeit verbunden und unterstütze die Schule.',
        },
        kind: 'membership',
        options: [membershipOption('alumni', 'year', 1000)],
      },
      {
        id: 'donation',
        title: { en: 'One-time donation', de: 'Einmalige Spende' },
        description: {
          en: 'Choose a one-time contribution.',
          de: 'Wähle einen einmaligen Beitrag.',
        },
        kind: 'donation',
        options: [
          {
            id: 'one-time',
            label: {
              en: 'Choose your amount at checkout',
              de: 'Betrag auf der Zahlungsseite wählen',
            },
            billing: { interval: 'once' },
            provider: 'stripe',
            providerConfig: { checkoutUrl: 'https://example.com/nms-donation-not-configured' },
          },
        ],
      },
    ],
  };
}
