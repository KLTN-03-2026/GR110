export const getInitials = (name = '') => {
  if (!name || typeof name !== 'string') return ''

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
