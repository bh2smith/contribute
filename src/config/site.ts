import { exampleConfig } from './example';
import { createSandboxConfig } from './sandbox';
import { createNmsPreviewConfig } from '../../consumers/nms/config';
import { createNmsSandboxConfig } from '../../consumers/nms/sandbox';
import type { Theme } from '../app';
import type { Locale } from '../i18n';

// The default catalog stays inert; sandbox mode explicitly enables test links.
export const siteConfig =
  import.meta.env.MODE === 'nms-sandbox'
    ? createNmsSandboxConfig()
    : import.meta.env.MODE === 'nms-preview'
      ? createNmsPreviewConfig()
      : import.meta.env.MODE === 'sandbox'
        ? createSandboxConfig()
        : exampleConfig;
export const siteTheme: Theme = 'meadow';

// Default language on each visit; no visitor preference is stored.
export const siteLocale: Locale = 'en';
