export function toSafeFileName(value: string): string {
  const safeName = value
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return safeName || 'scenario';
}
