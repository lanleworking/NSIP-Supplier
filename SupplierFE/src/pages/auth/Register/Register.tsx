import vasLogo from '@/assets/logo/vasPortLogo.png'
import clsx from 'clsx'
import styles from './Register.module.scss'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { categories, registerValuesForm } from './constants'
import { useForm } from '@mantine/form'
import { useContext, useEffect } from 'react'
import useAuth, { type RegisterPayloadType } from '@/hooks/query/useAuth'
import { trimFormValues } from '@/utils/string'
import { AuthContext } from '@/providers/Auth/AuthContext'
import { fetchErrorRes } from '@/utils/fetch'
import { AUTH_LOGO_WIDTH } from '@/constants/layout'

function Register() {
  const { registerMutation } = useAuth()
  const { setCurSupplier } = useContext(AuthContext)
  const navigate = useNavigate()
  const form = useForm<RegisterPayloadType>({
    mode: 'uncontrolled',
    initialValues: registerValuesForm.initialValues,
    validate: registerValuesForm.validate,
  })

  const handleRegister = async (payload: RegisterPayloadType) => {
    const cleanedPayload = trimFormValues<RegisterPayloadType>(payload)
    const { SupplierPass, ReenterSupplierPass, PhoneNumber, LoginName } =
      cleanedPayload

    if (SupplierPass !== ReenterSupplierPass)
      return form.setFieldError('ReenterSupplierPass', 'Mật khẩu không khớp')

    registerMutation.mutate(
      {
        ...cleanedPayload,
        PhoneNumber: PhoneNumber.toString(),
        LoginName: LoginName.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setCurSupplier(data)
          navigate({
            to: '/',
          })
          form.reset()
        },
        onError: (error) => fetchErrorRes(error),
      },
    )
  }

  useEffect(() => {
    document.title = 'Đăng ký - VAS Port'
  }, [])
  return (
    <Box px={40} pt={40}>
      <Flex direction={'column'} gap={8} justify="center" align="center">
        <Image w={AUTH_LOGO_WIDTH} alt="vasLogo" src={vasLogo} />
        <Title order={2}>Đăng ký</Title>
        <Text>Vui lòng nhập đầy đủ thông tin</Text>
      </Flex>
      <Divider my={28} />

      <form onSubmit={form.onSubmit(handleRegister)} autoComplete="off">
        {categories.map((category, index) => (
          <Box key={index}>
            <Stack my={12}>
              <Title order={2}>{category.title}</Title>
              <Grid w={'100%'}>
                {category.fields.map((field) => (
                  <Grid.Col
                    key={field.name}
                    span={{ base: 12, sm: field?.span || 6 }}
                  >
                    <field.Comp
                      {...field.props}
                      style={{ width: '100%' }}
                      placeholder={field.placeholder || field.label}
                      label={field.label}
                      {...form.getInputProps(field.name)}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
            {index !== categories.length - 1 && <Divider my={28} />}
          </Box>
        ))}

        <Flex
          mt={40}
          className={clsx(styles.btnGroup)}
          gap={12}
          direction={{ base: 'row' }}
          justify={{ base: 'space-between', sm: 'flex-end' }}
          wrap="wrap"
        >
          <Button
            component={Link}
            to="/login"
            w={{ base: '45%', sm: 'auto' }}
            disabled={registerMutation.isPending}
            variant="default"
          >
            <Text c={'black'}>Quay lại</Text>
          </Button>
          <Button
            w={{ base: '45%', sm: 'auto' }}
            disabled={registerMutation.isPending}
            loading={registerMutation.isPending}
            type="submit"
          >
            Đăng ký
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default Register
