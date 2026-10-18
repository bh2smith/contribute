import { parseCatalogConfig } from './core/config';
import { messages, translate, priceLabel } from './i18n';
import type { Locale } from './i18n';
import { resolveCheckout } from './providers/registry';

export type Theme = 'meadow' | 'midnight';

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function mountApp(
  root: HTMLElement,
  input: unknown = { version: 1, title: 'A little support. A lasting difference.', offerings: [] },
  theme: Theme = 'meadow',
  locale: Locale = 'en',
): void {
  const copy = messages[locale];
  document.documentElement.lang = locale;
  const main = element('main', 'catalog');
  main.dataset['theme'] = theme;
  const container = element('div', 'catalog__container');
  main.append(container);
  const parsed = parseCatalogConfig(input);
  const header = element('div', 'catalog__header');
  const languageLabel = element('label', 'catalog__language', copy.language);
  const language = element('select', 'catalog__language-select');
  for (const [value, name] of [
    ['en', 'English'],
    ['de', 'Deutsch'],
  ] as const) {
    const choice = element('option', '', name);
    choice.value = value;
    choice.selected = value === locale;
    language.append(choice);
  }
  language.addEventListener('change', () => {
    mountApp(root, input, theme, language.value === 'de' ? 'de' : 'en');
    root.querySelector<HTMLSelectElement>('select')?.focus();
  });
  languageLabel.append(language);
  header.append(element('p', 'catalog__eyebrow', 'CONTRIBUTE'), languageLabel);
  container.append(header);
  if (!parsed.success) {
    document.title = `${copy.unavailableTitle} · Contribute`;
    container.append(
      element('h1', 'catalog__title', copy.unavailableTitle),
      element('p', 'catalog__intro', copy.unavailableIntro),
    );
    root.replaceChildren(main);
    return;
  }
  document.title = `${translate(parsed.config.title, locale)} · Contribute`;
  container.append(
    element('h1', 'catalog__title', translate(parsed.config.title, locale)),
    element('p', 'catalog__intro', copy.intro),
  );
  const grid = element('div', 'catalog__grid');
  for (const offering of parsed.config.offerings) {
    const card = element('section', 'catalog__card');
    const title = element('h2', 'catalog__card-title', translate(offering.title, locale));
    title.id = `offering-${offering.id}`;
    card.setAttribute('aria-labelledby', title.id);
    card.append(
      element('p', 'catalog__kind', copy[offering.kind]),
      title,
      element('p', 'catalog__description', translate(offering.description, locale)),
    );
    const options = element('ul', 'catalog__options');
    for (const option of offering.options) {
      const item = element('li', 'catalog__option');
      item.append(
        element('h3', 'catalog__option-title', translate(option.label, locale)),
        element('p', 'catalog__price', priceLabel(option, locale)),
      );
      const checkout = resolveCheckout(option);
      if (checkout.available) {
        const link = element('a', 'catalog__checkout', copy.checkout);
        link.href = checkout.url;
        link.rel = 'noreferrer';
        link.setAttribute(
          'aria-label',
          `${copy.checkout}: ${translate(offering.title, locale)}, ${translate(option.label, locale)}`,
        );
        item.append(link);
      } else {
        item.append(
          element('span', 'catalog__unavailable', copy.unavailable),
          element('p', 'catalog__reason', copy.reasons[checkout.reason]),
        );
      }
      options.append(item);
    }
    card.append(options);
    grid.append(card);
  }
  if (parsed.config.offerings.length === 0) {
    container.append(element('p', 'catalog__empty', copy.empty));
  } else {
    container.append(grid);
    container.append(element('p', 'catalog__footer', copy.footer));
  }
  root.replaceChildren(main);
}
