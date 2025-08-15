import {
  Button,
  Flex,
  Grid,
  Group,
  Modal,
  NumberFormatter,
  Paper,
  Select,
  Text,
} from '@mantine/core'
import { AiOutlineNumber } from 'react-icons/ai'
import { editValuesForm, fields } from './constants'
import usePayment from '@/hooks/query/usePayment'
import styles from './SupplyEditModal.module.scss'
import clsx from 'clsx'
import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'
import toast from 'react-hot-toast'
import { fetchErrorRes } from '@/utils/fetch'
import type { IRequestItem } from '@/interfaces/data'
import useRequest from '@/hooks/query/useRequest'

type SupplyEditModalProps = {
  opened: boolean
  onClose: () => void
  title: string
  requestItemData?: IRequestItem | null
  refetch?: () => void
}

const INFO_FIELDS = [
  {
    name: 'Quantity',
    label: 'Số lượng',
  },
  {
    name: 'Unit',
    label: 'Đơn vị',
  },
]

function SupplyEditModal({
  opened,
  onClose,
  title,
  requestItemData,
  refetch,
}: SupplyEditModalProps) {
  const [totalPrice, setTotalPrice] = useState(0)
  const form = useForm({
    mode: 'controlled',
    initialValues: editValuesForm(requestItemData).initialValues,
    validate: editValuesForm().validate,
  })
  const { migrateRequestItemPrice } = useRequest()
  const { paymentOptionQuery } = usePayment()

  const { mutate: updateRequestItemPrice, isPending } = migrateRequestItemPrice(
    requestItemData?.ID,
  )
  const { data: paymentData } = paymentOptionQuery

  const { values, reset: resetForm, setValues } = form

  useEffect(() => {
    if (requestItemData) {
      setValues(editValuesForm(requestItemData).initialValues)
    }
  }, [requestItemData])

  const handleUpdateSupply = (data: any) => {
    if (isEmpty(data)) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const modifiedData = {
      ...data,
      Tax: Number(data.Tax) || 0,
      TotalPrice: totalPrice,
      Price: Number(data.Price) || 0,
    }
    updateRequestItemPrice(modifiedData, {
      onSuccess: () => {
        toast.success('Cập nhật hàng hóa thành công')
        onClose()
        resetForm()
        refetch?.()
      },
      onError: (error) => fetchErrorRes(error),
    })
  }

  useEffect(() => {
    if (!requestItemData?.Quantity) return
    const price = values.Price || 0
    const tax = values.Tax || 0
    const totalNotVat = price * requestItemData.Quantity
    if (!values.Tax || values.Tax === 0) {
      setTotalPrice(totalNotVat)
      return
    }
    const totalVat = totalNotVat + totalNotVat * (tax / 100)
    setTotalPrice(Number(totalVat.toFixed(3)))
  }, [values.Price, values.Tax])

  if (isEmpty(requestItemData) && opened)
    return <Empty description="Không có dữ liệu" />

  return (
    <Modal
      closeOnClickOutside={false}
      size={'lg'}
      centered
      title={title}
      opened={opened}
      onClose={onClose}
    >
      <Paper shadow="xs" py={12} px={24} withBorder>
        <Grid>
          {INFO_FIELDS.map((field) => (
            <Grid.Col span={4} key={field.name}>
              <Flex align={'center'} gap={4}>
                <AiOutlineNumber />
                <Text>{field.label}</Text>
              </Flex>
              <Text fw={'bold'}>
                {(requestItemData as Record<string, any>)?.[field.name]}
              </Text>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>

      <form
        onSubmit={form.onSubmit(handleUpdateSupply)}
        className={clsx(styles.form)}
      >
        <Grid>
          {fields.map((f, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: f.span || 6 }}>
              <f.Comp
                key={form.key(f.name)}
                {...form.getInputProps(f.name)}
                name={f.name}
                label={f.label}
                placeholder={f?.placeholder || f.label}
                {...f.props}
              />
            </Grid.Col>
          ))}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              key={form.key('PaymentType')}
              label={'Phương thức thanh toán'}
              name="PaymentType"
              withAsterisk
              data={paymentData}
              placeholder="Chọn phương thức thanh toán"
              clearable
              {...form.getInputProps('PaymentType')}
            />
          </Grid.Col>
        </Grid>

        <Text my={12} fw={'bold'}>
          Tổng: <NumberFormatter value={totalPrice} thousandSeparator /> VND
        </Text>

        <Group justify="end">
          <Button
            disabled={isPending}
            onClick={onClose}
            type="button"
            variant="default"
          >
            Hủy
          </Button>
          <Button disabled={isPending} type="submit">
            Xác nhận
          </Button>
        </Group>
      </form>
    </Modal>
  )
}

export default SupplyEditModal
