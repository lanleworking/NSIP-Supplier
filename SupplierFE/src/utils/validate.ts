import {
  emailRegex,
  nonSpaceRegex,
  phoneNumberOnlyRegex,
  URLRegex,
} from './string'

/**
 * Validation rule for a form field.
 */
type FormValidateType = {
  value: any
  /**
   * Maximum length of the input value
   * @default 255
   */
  maxLength?: number
  minLength?: number
  isEmail?: boolean
  /**
   * Whether the field is required
   * @default true
   */
  isRequired?: boolean
  isPhoneNumber?: boolean

  /**
   * Whether the field should not contain spaces
   * @default false
   */
  isNonSpace?: boolean
  isUrl?: boolean
}

export const formValidateMessage = ({
  isUrl = false,
  value,
  maxLength = 255,
  minLength,
  isEmail,
  isPhoneNumber,
  isRequired = true,
  isNonSpace = false,
}: FormValidateType): string | null => {
  const val = String(value || '').trim()

  if (isRequired && !val) {
    return 'Trường này là bắt buộc'
  }

  if (val && minLength !== undefined && val.length < minLength) {
    return `Trường này phải có ít nhất ${minLength} ký tự`
  }

  if (val.length > maxLength) {
    return `Trường này không được quá ${maxLength} ký tự`
  }

  if (val && isEmail && !emailRegex.test(val)) {
    return 'Email không hợp lệ'
  }
  if (val && isPhoneNumber && !phoneNumberOnlyRegex.test(val)) {
    return 'Số điện thoại không hợp lệ'
  }

  if (val && isNonSpace && nonSpaceRegex.test(val)) {
    return 'Trường này không được chứa khoảng trắng'
  }

  if (val && isUrl && !URLRegex.test(val)) {
    return 'URL không hợp lệ'
  }

  return null
}
