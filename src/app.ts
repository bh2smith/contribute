import { parseCatalogConfig } from './core/config';
import type { PaymentOption } from './core/config';
import { resolveCheckout } from './providers/registry';

export type Theme = 'meadow' | 'midnight';

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function priceLabel(option: PaymentOption): string {
  const interval = { once: 'One-time contribution', month: 'Every month', year: 'Every year' }[option.billing.interval];
  if (!option.price) return `Amount chosen at checkout · ${interval}`;
  const formatter = new Intl.NumberFormat('en', { style: 'currency', currency: option.price.currency });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return `${formatter.format(option.price.amountMinor / 10 ** digits)} · ${interval}`;
}

export function mountApp(
  root: HTMLElement,
  input: unknown = { version: 1, title: 'A little support. A lasting difference.', offerings: [] },
  theme: Theme = 'meadow',
): void {
  const main = element('main', 'catalog');
  main.dataset['theme'] = theme;
  const container = element('div', 'catalog__container');
  main.append(container);
  const parsed = parseCatalogConfig(input);
  container.append(element('p', 'catalog__eyebrow', 'CONTRIBUTE'));
  if (!parsed.success) {
    container.append(element('h1', 'catalog__title', 'Offerings are unavailable'),
      element('p', 'catalog__intro', 'Please check back later. The catalog configuration needs attention.'));
    root.replaceChildren(main);
    return;
  }
  container.append(element('h1', 'catalog__title', parsed.config.title),
    element('p', 'catalog__intro', 'Choose how you’d like to support the community. Every contribution makes a difference.'));
  const grid = element('div', 'catalog__grid');
  for (const offering of parsed.config.offerings) {
    const card = element('section', 'catalog__card');
    const title = element('h2', 'catalog__card-title', offering.title);
    title.id = `offering-${offering.id}`;
    card.setAttribute('aria-labelledby', title.id);
    card.append(element('p', 'catalog__kind', offering.kind === 'membership' ? 'Membership' : 'Donation'),
      title, element('p', 'catalog__description', offering.description));
    const options = element('ul', 'catalog__options');
    for (const option of offering.options) {
      const item = element('li', 'catalog__option');
      item.append(element('h3', 'catalog__option-title', option.label), element('p', 'catalog__price', priceLabel(option)));
      const checkout = resolveCheckout(option);
      if (checkout.available) {
        const link = element('a', 'catalog__checkout', 'Continue to checkout');
        link.href = checkout.url;
        link.rel = 'noreferrer';
        link.setAttribute('aria-label', `Continue to checkout: ${offering.title}, ${option.label}`);
        item.append(link);
      } else {
        item.append(element('span', 'catalog__unavailable', 'Currently unavailable'),
          element('p', 'catalog__reason', checkout.message));
      }
      options.append(item);
    }
    card.append(options);
    grid.append(card);
  }
  if (parsed.config.offerings.length === 0) {
    container.append(element('p', 'catalog__empty', 'We’re getting ready. Offerings will appear here once configured.'));
  } else {
    container.append(grid);
    container.append(element('p', 'catalog__footer', 'Available options take you to an external checkout to complete your contribution.'));
  }
  root.replaceChildren(main);
}
