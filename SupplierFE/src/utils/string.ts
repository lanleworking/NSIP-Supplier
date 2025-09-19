export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneNumberOnlyRegex = /^[0-9]+$/
export const nonSpaceRegex = /\s/
export const URLRegex = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/

export const trimFormValues = <T extends Record<string, any>>(
  formData: T,
): T => {
  return Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  ) as T
}

export const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export const maskString = (text: string | null) => {
  if (!text || text.length <= 6) return text
  const first3 = text.substring(0, 3)
  const last3 = text.substring(text.length - 3)
  const maskLength = text.length - 6
  const mask = '*'.repeat(Math.max(maskLength, 3))
  return `${first3}${mask}${last3}`
}
