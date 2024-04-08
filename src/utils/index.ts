export function formatTime(time: Date): string {
  return `${time.getHours().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${time.getMinutes().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`
}

export function formatDate(time: Date): string {
  return `${time.toLocaleString('id-ID', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`
}
