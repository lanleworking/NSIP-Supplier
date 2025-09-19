import { AUTH_LOGO_WIDTH } from '@/constants/layout'
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import vasLogo from '@/assets/logo/vasPortLogo.png'
import { useForm } from '@mantine/form'
import useAuth from '@/hooks/query/useAuth'
import { useEffect, useState } from 'react'
import { fetchErrorRes } from '@/utils/fetch'
import { Link } from '@tanstack/react-router'
import { isEmpty } from 'lodash'

import { MdOutlineMarkEmailRead } from 'react-icons/md'
import { maskString } from '@/utils/string'

function ForgotPassword() {
  const [mailRecover, setMailRecover] = useState(null)
  const { forgotPasswordMutation } = useAuth()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      LoginName: '',
    },
    validate: {
      LoginName: (value) => (value ? null : 'Vui lòng nhập tên đăng nhập'),
    },
  })

  const { mutate: resetPasswordMutate, isPending } = forgotPasswordMutation
  const { onSubmit, isDirty, key, getInputProps } = form

  const handleResetPassword = (value: { LoginName: string }) => {
    resetPasswordMutate(
      { LoginName: value.LoginName.toLowerCase() },
      {
        onSuccess: (data) => {
          form.reset()
          setMailRecover(data?.email)
        },
        onError: (error) => {
          fetchErrorRes(error)
        },
      },
    )
  }

  useEffect(() => {
    document.title = 'Lấy lại mật khẩu - VasPort'

    return () => {
      setMailRecover(null)
    }
  }, [])

  return (
    <Box px={40} pt={40}>
      <Flex direction={'column'} gap={8} justify="center" align="center">
        <Image w={AUTH_LOGO_WIDTH} alt="vasLogo" src={vasLogo} />
        <Title order={2}>Lấy lại mật khẩu</Title>
      </Flex>
      <Divider my={28} />

      {isEmpty(mailRecover) ? (
        <form onSubmit={onSubmit(handleResetPassword)} autoComplete="off">
          <TextInput
            key={key('LoginName')}
            placeholder="Nhập ID - SDT - Tên đăng nhập - Mã số thuế - Email"
            label={'Tên đăng nhập'}
            withAsterisk
            {...getInputProps('LoginName')}
          />
          <Flex justify={'center'} mt={20} gap={8}>
            <Button component={Link} to="/login" variant="default">
              Quay lại
            </Button>
            <Button type="submit" disabled={!isDirty()} loading={isPending}>
              Xác nhận
            </Button>
          </Flex>
        </form>
      ) : (
        <Center>
          <Stack ta={'center'}>
            <Text>Yêu cầu đặt lại mật khẩu đã được gửi đến mail của bạn</Text>
            <Text fw={'bold'}>{maskString(mailRecover)}</Text>
            <Center>
              <MdOutlineMarkEmailRead color="#096fce" size={80} />
            </Center>
            <Button component={Link} to="/login">
              Quay lại đăng nhập
            </Button>
          </Stack>
        </Center>
      )}
    </Box>
  )
}

export default ForgotPassword
