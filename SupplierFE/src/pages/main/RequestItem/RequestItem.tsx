import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Grid,
  NumberFormatter,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import styles from './RequestItem.module.scss'
import { useDebouncedState, useDisclosure } from '@mantine/hooks'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'

import { FiEdit } from 'react-icons/fi'
import { IoIosSearch } from 'react-icons/io'
import { FaArrowLeft } from 'react-icons/fa6'
import useRequest, {
  type RequestItemFilterType,
} from '@/hooks/query/useRequest'
import type { IRequestItem, IPayment } from '@/interfaces/data'
import { SupplyEditModal } from '@/components/modals/SupplyEditModal'
import { FileUpload } from '@/components/FileUpload'
import { UploadFileModal } from '@/components/modals/UploadFileModal'
import AlertModal from '@/components/modals/AlertModal/AlertModal'
import { Skeleton } from 'antd'
import useConfirm from '@/hooks/query/useConfirm'
import { fetchErrorRes } from '@/utils/fetch'
import toast from 'react-hot-toast'

type RequestItemProps = {
  paymentList: IPayment[]
}

function RequestItem({ paymentList }: RequestItemProps) {
  const navigate = useNavigate()
  const [selectedRequestItem, setSelectedRequestItem] =
    useState<IRequestItem | null>(null)
  const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false)
  const [
    openedUploadModal,
    { open: openUploadModal, close: closeUploadModal },
  ] = useDisclosure(false)
  const [
    openedFinalSubmitModal,
    { open: openFinalSubmitModal, close: closeFinalSubmitModal },
  ] = useDisclosure(false)
  const { requestId } = useParams({ from: '/request/$requestId/' })
  const search = useSearch({
    from: '/request/$requestId/',
  }) as RequestItemFilterType
  const [filterSearch, setFilterSearch] =
    useDebouncedState<RequestItemFilterType>(
      {
        item: search?.item,
      },
      500,
    )

  const { requestItemListQuery } = useRequest()
  const { confirmRequestPrice } = useConfirm()
  const {
    data: requestItemData,
    refetch: refetchRequestItemData,
    isLoading,
  } = requestItemListQuery(
    requestId ? Number(requestId) : undefined,
    filterSearch,
  )
  const { mutate: confirmMutate, isPending: isConfirmPending } =
    confirmRequestPrice(requestId ? Number(requestId) : undefined)

  const handleSelectRequestItem = (item: IRequestItem) => {
    setSelectedRequestItem(item)
    openEditModal()
  }

  const handleConfirmRequestPrice = () => {
    confirmMutate(Number(requestId), {
      onSuccess: () => {
        refetchRequestItemData()
        closeFinalSubmitModal()
        toast.success('Xác nhận giá hàng thành công')
      },
      onError: (error) => fetchErrorRes(error),
    })
  }

  const rows = useMemo(() => {
    return requestItemData?.data?.map((r, index) => (
      <Table.Tr key={index}>
        {!requestItemData?.isDisable && (
          <Table.Td className={clsx(styles.stickyCol, styles.editCol)}>
            <ActionIcon
              onClick={() => handleSelectRequestItem(r)}
              variant="outline"
              color="blue"
            >
              <FiEdit />
            </ActionIcon>
          </Table.Td>
        )}
        <Table.Td>{r.Item}</Table.Td>
        <Table.Td>{r.Quantity}</Table.Td>
        <Table.Td>{r.Unit}</Table.Td>
        <Table.Td>{r.Brand}</Table.Td>
        <Table.Td>{r.Size}</Table.Td>
        <Table.Td>
          <NumberFormatter value={r.prices?.[0]?.Price} thousandSeparator />
        </Table.Td>
        <Table.Td>{r.prices?.[0]?.Tax}</Table.Td>
        <Table.Td>
          {
            <NumberFormatter
              value={r.prices?.[0]?.TotalPrice}
              thousandSeparator
            />
          }
        </Table.Td>
        <Table.Td>{r.prices?.[0]?.DeliveryTime}</Table.Td>
        <Table.Td>
          {
            paymentList?.find((i) => i.PaymentID === r.prices?.[0]?.PaymentType)
              ?.PaymentName
          }
        </Table.Td>
      </Table.Tr>
    ))
  }, [requestItemData])

  useEffect(() => {
    document.title = `Danh sách hàng hóa - ${requestId} - VasPort`
  }, [])

  return (
    <>
      <Stack m={{ base: 12, sm: 32 }}>
        <Flex gap={8} align={'center'} style={{ flex: 1 }}>
          <ActionIcon
            onClick={() => {
              navigate({
                to: '..',
              })
            }}
            title="Quay lại"
            variant="subtle"
          >
            <FaArrowLeft />
          </ActionIcon>
          <Title order={2}>Danh sách hàng hóa</Title>
        </Flex>
        {/* filters */}
        <Grid>
          <Grid.Col span={4}>
            <TextInput
              leftSection={<IoIosSearch />}
              placeholder="Tìm kiếm tên"
              onChange={(e) =>
                setFilterSearch((prev) => ({
                  ...prev,
                  item: e?.target?.value,
                }))
              }
            />
          </Grid.Col>
        </Grid>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <Table.ScrollContainer minWidth={1600}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    {!requestItemData?.isDisable && (
                      <Table.Th
                        className={clsx(styles.stickyCol, styles.editCol)}
                      ></Table.Th>
                    )}

                    <Table.Th>Tên</Table.Th>
                    <Table.Th>Số lượng</Table.Th>
                    <Table.Th>Đơn vị</Table.Th>
                    <Table.Th>Hãng</Table.Th>
                    <Table.Th>Kích cỡ</Table.Th>
                    <Table.Th>Giá đơn vị</Table.Th>
                    <Table.Th>Thuế (%)</Table.Th>
                    <Table.Th>Tổng (bao gồm thuế)</Table.Th>
                    <Table.Th>Thời gian chuyển hàng</Table.Th>
                    <Table.Th>Kiểu thanh toán</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <Divider />
            <FileUpload
              refetch={refetchRequestItemData}
              files={requestItemData?.files}
              onClickOpenUploadModal={openUploadModal}
              isDisabled={requestItemData?.isDisable}
            />
            {/* <Divider /> */}
            {!requestItemData?.isDisable && (
              <Flex justify={'end'}>
                <Button onClick={openFinalSubmitModal}>Gửi toàn bộ</Button>
              </Flex>
            )}
          </>
        )}
      </Stack>

      {/* modals */}
      <SupplyEditModal
        opened={openedEditModal}
        title={selectedRequestItem?.Item || 'Chỉnh sửa hàng hóa'}
        onClose={closeEditModal}
        requestItemData={selectedRequestItem}
        refetch={refetchRequestItemData}
      />
      <UploadFileModal
        files={requestItemData?.files}
        onClose={closeUploadModal}
        opened={openedUploadModal}
        refetch={refetchRequestItemData}
      />

      <AlertModal
        title="Xác nhận gửi?"
        onClose={closeFinalSubmitModal}
        opened={openedFinalSubmitModal}
        onConfirm={handleConfirmRequestPrice}
        isLoading={isConfirmPending}
      >
        <Text>Bạn có chắc chắn xác nhận hoàn tất nhập giá hàng?</Text>
        <Text c={'red'}>Lưu ý: Một khi xác nhận sẽ không thể chỉnh sửa</Text>
      </AlertModal>
    </>
  )
}

export default RequestItem
