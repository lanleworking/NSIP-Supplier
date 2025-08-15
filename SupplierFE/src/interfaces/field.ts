import type {
  NumberInputProps,
  SelectProps,
  TextInputProps,
} from '@mantine/core'
import type { DatePickerInputProps } from '@mantine/dates'

export interface IField {
  span?: number
  Comp: React.ElementType
  name: string
  label: string
  props?: TextInputProps | NumberInputProps | DatePickerInputProps | SelectProps
  placeholder?: string
}

export interface ICategory {
  title: string
  fields: IField[]
}
