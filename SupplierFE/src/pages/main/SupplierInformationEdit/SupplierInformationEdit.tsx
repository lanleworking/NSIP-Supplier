import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { categories, supplierValuesForm } from './constants'
import clsx from 'clsx'
import styles from './SupplierInfoEdit.module.scss'
import { Link } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/providers/Auth/AuthContext'
import { useForm } from '@mantine/form'
import useSupplier from '@/hooks/query/useSupplier'
import toast from 'react-hot-toast'
import { fetchErrorRes } from '@/utils/fetch'
import useBusiness from '@/hooks/query/useBusiness'
import type { IOptions } from '@/interfaces/data'
import useBank from '@/hooks/query/useBank'

function SupplierInformationEdit() {
  const [isDisabled, setIsDisabled] = useState(false)
  const { updateSupplierInfo } = useSupplier()
  const { getBusinessOptions } = useBusiness()
  const { getBankOptions } = useBank()
  const { curSupplier, setCurSupplier } = useContext(AuthContext)
  const { key, getInputProps, onSubmit, isDirty } = useForm({
    mode: 'uncontrolled',
    initialValues: curSupplier
      ? supplierValuesForm(curSupplier).initialValues
      : {},
    validate: curSupplier ? supplierValuesForm(curSupplier).validate : {},
  })

  const { mutate: updateSupplierInfoMutate, isPending } = updateSupplierInfo
  const { data: businessOptions } = getBusinessOptions
  const { data: bankOptions } = getBankOptions
  const handleSubmit = (values: any) => {
    updateSupplierInfoMutate(values, {
      onSuccess: (data) => {
        toast.success('Cập nhật thông tin thành công')
        setCurSupplier(data)
        setIsDisabled(true)
      },
      onError: (error) => fetchErrorRes(error),
    })
  }

  const handleOptionsData = (fieldName: string): IOptions | [] => {
    switch (fieldName) {
      case 'BusinessType':
        return businessOptions
      case 'BankID':
        return bankOptions
      default:
        return []
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIsDisabled(false)
    }, 5000)
  }, [isDisabled])

  useEffect(() => {
    document.title = 'Cập nhật thông tin - VasPort'
  }, [])

  return (
    <Box px={40} pt={40}>
      <Flex direction={'column'} gap={8} justify="center" align="center">
        <Title order={2}>Cập nhật thông tin</Title>
      </Flex>
      <Divider my={28} />

      <form onSubmit={onSubmit(handleSubmit)} autoComplete="off">
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
                      disabled={isPending}
                      key={key(field.name)}
                      {...field.props}
                      style={{ width: '100%' }}
                      placeholder={field.placeholder || field.label}
                      label={field.label}
                      {...getInputProps(field.name)}
                      {...(field.Comp === Select
                        ? { data: handleOptionsData(field.name) }
                        : {})}
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
            to=".."
            w={{ base: '45%', sm: 'auto' }}
            disabled={isPending}
            variant="default"
          >
            <Text c={'black'}>Quay lại</Text>
          </Button>
          <Button
            w={{ base: '45%', sm: 'auto' }}
            loading={isPending}
            disabled={isDisabled || !isDirty()}
            type="submit"
          >
            Cập nhật
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default SupplierInformationEdit
