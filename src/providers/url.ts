/** Reject ambiguous/normalized URLs, credentials, and personal-data parameters. */
export function parseCheckoutUrl(value: unknown): URL | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash ||
      value.includes('?') ||
      value.includes('#') ||
      url.href !== value
    )
      return undefined;
    return url;
  } catch {
    return undefined;
  }
}
