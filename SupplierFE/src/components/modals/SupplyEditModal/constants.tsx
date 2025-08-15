import type { IField } from '@/interfaces/field'
import { NumberInput } from '@mantine/core'

import { RiMoneyDollarBoxLine } from 'react-icons/ri'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { DatePickerInput } from '@mantine/dates'
import { formValidateMessage } from '@/utils/validate'
import type { IRequestItem } from '@/interfaces/data'

export const fields: IField[] = [
  {
    span: 6,
    Comp: NumberInput,
    name: 'Price',
    label: 'Giá',
    props: {
      min: 0,
      thousandSeparator: true,
      withAsterisk: true,
      hideControls: true,
      leftSection: <RiMoneyDollarBoxLine />,
    },
  },
  {
    span: 6,
    Comp: NumberInput,
    name: 'Tax',
    label: 'Thuế (%)',
    props: {
      min: 0,
      max: 10,
      withAsterisk: true,
      hideControls: true,
      leftSection: <MdOutlineAttachMoney />,
    },
  },
  {
    span: 6,
    Comp: DatePickerInput,
    name: 'DeliveryTime',
    label: 'Ngày giao hàng',
    props: {
      valueFormat: 'DD/MM/YYYY',
      clearable: true,
      withAsterisk: true,
      placeholder: 'Chọn ngày giao hàng',
      minDate: new Date(),
    },
  },
]

export const editValuesForm = (supplyData?: IRequestItem | null) => ({
  initialValues: {
    Price: supplyData?.prices?.[0]?.Price,
    Tax: supplyData?.prices?.[0]?.Tax,
    DeliveryTime: supplyData?.prices?.[0]?.DeliveryTime || null,
    PaymentType: supplyData?.prices?.[0]?.PaymentType || '',
  },
  validate: {
    Price: (value: any) =>
      formValidateMessage({
        value,
        minLength: 0,
      }),
    Tax: (value: any) =>
      formValidateMessage({
        isRequired: false,
        value,
        minLength: 0,
        maxLength: 10,
      }),
    DeliveryTime: (value: any) =>
      formValidateMessage({
        value,
      }),

    PaymentType: (value: any) =>
      formValidateMessage({
        value,
      }),
  },
})
