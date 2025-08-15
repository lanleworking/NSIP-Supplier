import { AUTH_LOGO_WIDTH } from '@/constants/layout'
import vasLogo from '@/assets/logo/vasPortLogo.png'
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import useAuth from '@/hooks/query/useAuth'
import { fetchErrorRes } from '@/utils/fetch'
import { Link, useSearch } from '@tanstack/react-router'
import { formValidateMessage } from '@/utils/validate'

function ResetPassword() {
  const search = useSearch({ from: '/reset-password' }) as { token?: string }
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPasswordMutation } = useAuth()
  const { onSubmit, isDirty, key, getInputProps } = useForm({
    mode: 'controlled',
    initialValues: {
      SupplierPass: '',
      ReenterSupplierPass: '',
    },
    validate: {
      SupplierPass: (value) =>
        formValidateMessage({
          value,
          minLength: 6,
          maxLength: 50,
        }),
      ReenterSupplierPass: (value, values) =>
        value === values.SupplierPass ? null : 'Mật khẩu không khớp',
    },
  })

  const { mutate: resetPasswordMutate, isPending } = resetPasswordMutation

  const handleResetPass = (value: {
    SupplierPass: string
    ReenterSupplierPass: string
  }) => {
    const token = search?.token
    resetPasswordMutate(
      {
        SupplierPass: value.SupplierPass,
        token: token || '',
      },
      {
        onSuccess: () => {
          setIsSuccess(true)
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
        },
        onError: (error) => fetchErrorRes(error),
      },
    )
  }

  useEffect(() => {
    document.title = 'Đặt lại mật khẩu - VasPort'
    return () => {
      setIsSuccess(false)
    }
  }, [])

  return (
    <Box px={40} pt={40}>
      <Flex direction={'column'} gap={8} justify="center" align="center">
        <Image w={AUTH_LOGO_WIDTH} alt="vasLogo" src={vasLogo} />
        <Title order={2}>Đặt lại mật khẩu</Title>
      </Flex>
      <Divider my={28} />

      {isSuccess ? (
        <Center>
          <Stack ta={'center'}>
            <Text>Đặt lại mật khẩu thành công</Text>
            <Text>Bạn sẽ được tự động chuyển hướng tới trang đăng nhập </Text>
          </Stack>
        </Center>
      ) : (
        <form
          style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}
          onSubmit={onSubmit(handleResetPass)}
          autoComplete="off"
        >
          <Stack>
            <PasswordInput
              min={6}
              max={50}
              key={key('SupplierPass')}
              placeholder="Mật khẩu mới"
              label={'Mật khẩu mới'}
              withAsterisk
              {...getInputProps('SupplierPass')}
            />
            <PasswordInput
              min={6}
              max={50}
              key={key('ReenterSupplierPass')}
              placeholder="Nhập lại mật khẩu"
              label={'Nhập lại mật khẩu'}
              withAsterisk
              {...getInputProps('ReenterSupplierPass')}
            />
            <Flex justify={'center'} gap={8}>
              <Button component={Link} to="/login" variant="default">
                Đăng nhập
              </Button>
              <Button type="submit" disabled={!isDirty()} loading={isPending}>
                Xác nhận
              </Button>
            </Flex>
          </Stack>
        </form>
      )}
    </Box>
  )
}

export default ResetPassword
