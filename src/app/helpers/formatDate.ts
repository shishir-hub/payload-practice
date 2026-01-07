export const formatDate = (preDate: string) => {
  const date = new Date(preDate)

  const customFormat = date.toLocaleDateString('en-us', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return customFormat
}
