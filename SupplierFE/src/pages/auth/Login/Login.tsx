import vasPortLogo from '@/assets/logo/vasPortLogo.png'
import styles from './Login.module.scss'
import { useContext, useEffect } from 'react'
import clsx from 'clsx'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Flex,
  Image,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'

// icons
import { CiUser } from 'react-icons/ci'
import { IoKeyOutline } from 'react-icons/io5'
import useAuth from '@/hooks/query/useAuth'
import { fetchErrorRes } from '@/utils/fetch'
import { AuthContext } from '@/providers/Auth/AuthContext'
import { AUTH_LOGO_WIDTH } from '@/constants/layout'

type LoginProps = {
  LoginName: string
  SupplierPass: string
}

function Login() {
  const { loginMutation } = useAuth()
  const { setCurSupplier } = useContext(AuthContext)
  const navigate = useNavigate()
  const form = useForm<LoginProps>({
    mode: 'uncontrolled',
    initialValues: {
      LoginName: '',
      SupplierPass: '',
    },
    validate: {
      LoginName: (value) => {
        if (!value) {
          return 'Tài khoản không được để trống'
        }
      },
      SupplierPass: (value) => {
        if (!value) {
          return 'Mật khẩu không được để trống'
        }
      },
    },
  })

  const onSubmit = async (values: LoginProps) => {
    const payload = {
      LoginName: values.LoginName.trim(),
      SupplierPass: values.SupplierPass,
    }
    loginMutation.mutate(payload, {
      onSuccess: (data) => {
        setCurSupplier(data)
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPath = urlParams.get('redirect')
        navigate({
          to: redirectPath || '/',
        })
      },
      onError: (error) => fetchErrorRes(error),
    })
  }

  useEffect(() => {
    document.title = 'Đăng nhập - VasPort'
  }, [])

  return (
    <Flex
      className={clsx(styles.container)}
      direction={'column'}
      align="center"
      justify="center"
    >
      <Box>
        <Image w={AUTH_LOGO_WIDTH} src={vasPortLogo} alt="vas-port-logo" />
      </Box>
      <Title my={8} order={2}>
        Chào mừng quay trở lại
      </Title>

      <Box my={12}>
        <form onSubmit={form.onSubmit(onSubmit)} className={clsx(styles.form)}>
          <Stack>
            <TextInput
              leftSection={<CiUser />}
              placeholder="Nhập tài khoản"
              key={form.key('LoginName')}
              {...form.getInputProps('LoginName')}
            />
            <PasswordInput
              leftSection={<IoKeyOutline />}
              placeholder="Nhập mật khẩu"
              key={form.key('SupplierPass')}
              {...form.getInputProps('SupplierPass')}
            />
            <Button
              disabled={!form.isDirty()}
              loading={loginMutation.isPending}
              type="submit"
            >
              Đăng nhập
            </Button>
          </Stack>
        </form>
      </Box>
      <Stack mt={8} gap={'xs'} ta={'center'}>
        <Link to="/register">Đăng ký</Link>
        <Link to="/recover">Quên mật khẩu</Link>
      </Stack>
    </Flex>
  )
}

export default Login
