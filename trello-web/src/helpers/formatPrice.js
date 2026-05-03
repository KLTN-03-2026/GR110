export function formatPrice(value, locale = 'en-US') {
  let numeric = 0

  if (typeof value === 'number') {
    numeric = value
  }

  if (typeof value === 'string') {
    numeric = Number(String(value).replace(/[^\d.]/g, ''))
  }

  if (Number.isNaN(numeric)) {
    numeric = 0
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD'
  }).format(numeric)
}