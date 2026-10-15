export function mountApp(root: HTMLElement): void {
  const main = document.createElement('main');
  main.className = 'catalog';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'catalog__eyebrow';
  eyebrow.textContent = 'CONTRIBUTE';

  const heading = document.createElement('h1');
  heading.textContent = 'A little support. A lasting difference.';

  const introduction = document.createElement('p');
  introduction.textContent = 'A home for memberships, donations, and recurring contributions.';

  const status = document.createElement('p');
  status.className = 'catalog__status';
  status.textContent = 'We’re getting ready. Offerings will appear here once configured.';

  main.append(eyebrow, heading, introduction, status);
  root.replaceChildren(main);
}
