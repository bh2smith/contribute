import { describe, expect, it } from 'vitest';
import { mountApp } from './app';

describe('unconfigured catalog', () => {
  it('renders a readable empty state without collecting data or enabling checkout', () => {
    const root = document.createElement('div');
    mountApp(root);
    expect(root.querySelector('main h1')?.textContent).toBeTruthy();
    expect(root.textContent).toContain('once configured');
    expect(root.querySelectorAll('form, input, iframe, a, button')).toHaveLength(0);
  });

  it('replaces previous content when mounted again', () => {
    const root = document.createElement('div');
    mountApp(root);
    mountApp(root);
    expect(root.querySelectorAll('main')).toHaveLength(1);
  });
});
