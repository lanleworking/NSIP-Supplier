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
