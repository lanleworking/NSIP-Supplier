import type { ICategory } from '@/interfaces/field'
import { formValidateMessage } from '@/utils/validate'
import { PasswordInput, TextInput } from '@mantine/core'

// icons
import { BsHouse } from 'react-icons/bs'
import { CiUser, CiMail } from 'react-icons/ci'
import { FaPhone } from 'react-icons/fa'
import { MdKey } from 'react-icons/md'

export const categories: ICategory[] = [
  {
    title: 'Thông tin đăng nhập',
    fields: [
      {
        span: 12,
        Comp: TextInput,
        name: 'LoginName',
        label: 'Tên đăng nhập',
        props: {
          withAsterisk: true,
          leftSection: <BsHouse />,
          description: 'Viết liền không dấu, không có khoảng trắng',
        },
      },
      {
        span: 6,
        Comp: PasswordInput,
        name: 'SupplierPass',
        label: 'Mật khẩu',
        props: {
          withAsterisk: true,
          leftSection: <MdKey />,
        },
      },
      {
        span: 6,
        Comp: PasswordInput,
        name: 'ReenterSupplierPass',
        label: 'Nhập lại Mật khẩu',
        props: {
          withAsterisk: true,
          leftSection: <MdKey />,
        },
      },
    ],
  },
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
        Comp: TextInput,
        name: 'CompanyName',
        label: 'Tên công ty',
        props: {
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
    ],
  },
]

export const registerValuesForm = {
  initialValues: {
    LoginName: '',
    SupplierPass: '',
    CompanyName: '',
    PhoneNumber: '',
    Email: '',
    RepresentativeName: '',
    ReenterSupplierPass: '',
  },
  validate: {
    LoginName: (value: any) =>
      formValidateMessage({
        value,
        minLength: 3,
        maxLength: 50,
        isNonSpace: true,
      }),
    SupplierPass: (value: any) =>
      formValidateMessage({
        value,
        minLength: 6,
        maxLength: 50,
      }),
    CompanyName: (value: any) =>
      formValidateMessage({
        isRequired: false,
        value,
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

    RepresentativeName: (value: any) =>
      formValidateMessage({ value, maxLength: 50, isRequired: false }),
  },
}
