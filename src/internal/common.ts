export function uuid(): string {
  const toReplacedString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

  return toReplacedString.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
