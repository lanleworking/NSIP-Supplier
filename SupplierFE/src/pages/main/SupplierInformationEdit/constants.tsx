import type { ISupplier } from '@/interfaces/data'
import type { ICategory } from '@/interfaces/field'
import { formValidateMessage } from '@/utils/validate'
import { Select, TextInput } from '@mantine/core'
import { AiOutlineNumber } from 'react-icons/ai'

import { BsHouse } from 'react-icons/bs'
import { CiMail, CiUser, CiBarcode } from 'react-icons/ci'
import { FaPhone, FaRoad } from 'react-icons/fa'
import { LuUserRoundCog } from 'react-icons/lu'
import { PiBankDuotone } from 'react-icons/pi'
import { SlNotebook } from 'react-icons/sl'
export const categories: ICategory[] = [
  {
    title: 'Thông tin cơ bản',
    fields: [
      {
        name: 'PhoneNumber',
        label: 'Số điện thoại',
        Comp: TextInput,
        props: {
          withAsterisk: true,
          leftSection: <FaPhone />,
        },
      },
      {
        name: 'Email',
        label: 'Email',
        Comp: TextInput,
        props: {
          withAsterisk: true,
          leftSection: <CiMail />,
        },
      },
      {
        name: 'Website',
        label: 'Website',
        Comp: TextInput,
        props: {
          leftSection: <CiMail />,
        },
      },
      {
        Comp: TextInput,
        name: 'CompanyName',
        label: 'Tên công ty/doanh nghiệp',
        props: {
          leftSection: <BsHouse />,
        },
      },
      {
        Comp: TextInput,
        name: 'TaxCode',
        label: 'Mã số thuế',
        props: {
          leftSection: <CiBarcode />,
        },
      },
      {
        Comp: Select,
        name: 'BusinessType',
        label: 'Loại hình doanh nghiệp',
        props: {
          clearable: true,
          searchable: true,
          leftSection: <BsHouse />,
        },
      },

      {
        name: 'RepresentativeName',
        label: 'Người đại diện pháp lý',
        Comp: TextInput,
        props: {
          leftSection: <CiUser />,
        },
      },
      {
        name: 'RepresentativePosition',
        label: 'Chức vụ người đại diện',
        Comp: TextInput,
        props: {
          leftSection: <LuUserRoundCog />,
        },
      },
      {
        name: 'Address',
        label: 'Địa chỉ',
        Comp: TextInput,
        props: {
          leftSection: <FaRoad />,
        },
      },
    ],
  },
  {
    title: 'Thông tin thanh toán',
    fields: [
      {
        name: 'BankAccount',
        label: 'Số tài khoản ngân hàng',
        Comp: TextInput,
        props: {
          leftSection: <AiOutlineNumber />,
        },
      },
      {
        name: 'BankID',
        label: 'Ngân hàng',
        Comp: Select,
        props: {
          clearable: true,
          searchable: true,
          leftSection: <PiBankDuotone />,
        },
      },
      {
        name: 'PaymentTerms',
        label: 'Điều khoản thanh toán',
        Comp: TextInput,
        props: {
          leftSection: <SlNotebook />,
        },
      },
      {
        name: 'DeliveryTerms',
        label: 'Điều khoản giao hàng',
        Comp: TextInput,
        props: {
          leftSection: <SlNotebook />,
        },
      },
    ],
  },
]

export const supplierValuesForm = (supplier: ISupplier) => {
  return {
    initialValues: {
      LoginName: supplier.LoginName || '',
      PhoneNumber: supplier.PhoneNumber || '',
      Email: supplier.Email || '',
      Website: supplier.Website || '',
      CompanyName: supplier.CompanyName || '',
      TaxCode: supplier.TaxCode || '',
      BusinessType: supplier.BusinessType || '',
      RepresentativeName: supplier.RepresentativeName || '',
      RepresentativePosition: supplier.RepresentativePosition || '',
      Address: supplier.Address || '',
      BankAccount: supplier.BankAccount || '',
      BankID: supplier.BankID || '',
      PaymentTerms: supplier.PaymentTerms || '',
      DeliveryTerms: supplier.DeliveryTerms || '',
    },
    validate: {
      LoginName: (value: any) =>
        formValidateMessage({
          value,
          minLength: 3,
          maxLength: 50,
          isNonSpace: true,
        }),

      PhoneNumber: (value: any) =>
        formValidateMessage({
          value,
          isPhoneNumber: true,
          minLength: 6,
          maxLength: 15,
        }),
      Email: (value: any) =>
        formValidateMessage({
          value,
          isEmail: true,
          maxLength: 255,
        }),
      Website: (value: any) =>
        formValidateMessage({
          value,
          isUrl: true,
          maxLength: 255,
          isRequired: false,
        }),
      CompanyName: (value: any) =>
        formValidateMessage({
          isRequired: false,
          value,
        }),
      BusinessType: (value: any) =>
        formValidateMessage({
          isRequired: false,
          value,
        }),
      TaxCode: (value: any) =>
        formValidateMessage({
          value,
          maxLength: 13,
          isRequired: false,
          minLength: 10,
        }),
      RepresentativePosition: (value: any) =>
        formValidateMessage({
          value,
          maxLength: 100,
          isRequired: false,
        }),

      RepresentativeName: (value: any) =>
        formValidateMessage({ value, maxLength: 100, isRequired: false }),
      Address: (value: any) =>
        formValidateMessage({ value, maxLength: 255, isRequired: false }),
      Country: (value: any) =>
        formValidateMessage({ value, maxLength: 100, isRequired: false }),
      BankAccount: (value: any) =>
        formValidateMessage({
          value,
          maxLength: 50,
          isRequired: false,
        }),
      BankID: (value: any) =>
        formValidateMessage({
          value,
          isRequired: false,
        }),
      PaymentTerms: (value: any) =>
        formValidateMessage({
          value,
          maxLength: 255,
          isRequired: false,
        }),

      DeliveryTerms: (value: any) =>
        formValidateMessage({
          value,
          maxLength: 255,
          isRequired: false,
        }),
    },
  }
}
