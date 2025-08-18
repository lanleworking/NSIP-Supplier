import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  NumberInput,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Empty, Image, Pagination, Skeleton } from 'antd'
import { useDebouncedState, useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import useRequest, { type RequestSearchParams } from '@/hooks/query/useRequest'
import { APPROVAL_STATUS, REQUEST_TABLE_HEADERS } from './constants'
import styles from './RequestList.module.scss'
import step from '@/assets/step/step.png'

import { AiOutlineNumber } from 'react-icons/ai'
import { MdOutlinePriceCheck } from 'react-icons/md'
import { IoText } from 'react-icons/io5'
import clsx from 'clsx'
import PieChartJS from '@/components/Chart/PieChart'
import { GrStatusGood } from 'react-icons/gr'

type RequestListProps = {
  chartData?: any[]
}

function RequestList({ chartData }: RequestListProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const navigate = useNavigate()
  const search = useSearch({ from: '/' }) as RequestSearchParams
  const [requestFilter, setRequestFilter] = useState<RequestSearchParams>({
    current: search?.current || 1,
    limit: search?.limit || 10,
    requestId: search?.requestId,
    request: search?.request,
    timeLimit: search?.timeLimit || 'desc',
  })

  // Debounced local filter input
  const [filterSearch, setFilterSearch] =
    useDebouncedState<RequestSearchParams>({}, 500)

  const { requestListQuery } = useRequest()
  const { data: requestListData, isFetching } = requestListQuery(requestFilter)

  const { page, requests } = useMemo(() => {
    return {
      page: requestListData?.page,
      requests: requestListData?.requests || [],
    }
  }, [requestListData])

  const handlePageChange = (page: number, pageSize?: number) => {
    setRequestFilter((prev) => ({
      ...prev,
      current: page,
      limit: pageSize ?? prev.limit,
    }))
  }

  const handleNavigateToRequest = (requestId: number) => {
    navigate({
      to: '/request/$requestId',
      params: {
        requestId: requestId.toString(),
      },
    })
  }

  // Apply filter changes with debounce
  useEffect(() => {
    setRequestFilter((prev) => ({
      ...prev,
      ...filterSearch,
      current: 1,
    }))
  }, [filterSearch])

  return (
    <Stack className={clsx(styles.container)} p={20}>
      <Title order={2}>Danh sách Yêu cầu</Title>

      <Grid>
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <NumberInput
            placeholder="ID Yêu cầu"
            leftSection={<AiOutlineNumber />}
            hideControls
            onChange={(value) =>
              setFilterSearch((prev) => ({
                ...prev,
                requestId: value ? Number(value) : undefined,
              }))
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <TextInput
            placeholder="Yêu cầu"
            leftSection={<IoText />}
            onChange={(e) =>
              setFilterSearch((prev) => ({
                ...prev,
                request: e?.target?.value || undefined,
              }))
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 6, sm: 3 }}>
          <Select
            clearable
            placeholder="Trạng thái gửi"
            leftSection={<MdOutlinePriceCheck />}
            data={[
              {
                value: 'false',
                label: '❌ - Chưa gửi',
              },
              {
                value: 'true',
                label: '✅ - Đã gửi',
              },
            ]}
            onChange={(e) =>
              setFilterSearch((prev) => ({
                ...prev,
                isConfirmed: e ? Number(e === 'true') : undefined,
              }))
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 6, sm: 3 }}>
          <Select
            clearable
            placeholder="Trạng thái duyệt"
            leftSection={<GrStatusGood />}
            data={[
              {
                value: '0',
                label: '🔵 - Chờ duyệt',
              },
              {
                value: '1',
                label: '✅ - Đã duyệt',
              },
              {
                value: '8',
                label: '❌ - Từ chối',
              },
            ]}
            onChange={(e) =>
              setFilterSearch((prev) => ({
                ...prev,
                approvalStatus: e ? Number(e) : undefined,
              }))
            }
          />
        </Grid.Col>
      </Grid>

      {isFetching ? (
        <Skeleton />
      ) : requests.length === 0 ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {REQUEST_TABLE_HEADERS.map((header, index) => (
                  <Table.Th key={index}>{header.label}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {requests.map((r, index) => (
                <Table.Tr
                  className={clsx(styles.tableRow)}
                  onClick={() => handleNavigateToRequest(r.Id_Request)}
                  key={`${r.Id_Request}-${index}`}
                >
                  <Table.Td>{r.Request}</Table.Td>
                  <Table.Td w={110}>
                    {r?.RequestConfirms?.[0]?.IsConfirmed ? (
                      <Badge color="green">Đã gửi</Badge>
                    ) : (
                      <Badge color={'gray'}>Chưa gửi</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {r?.TimeLimit
                      ? dayjs(r.TimeLimit).format('HH:mm:ss DD/MM/YYYY')
                      : '-'}
                  </Table.Td>

                  <Table.Td w={120}>
                    {r?.RequestConfirms?.[0]?.ApprovalStatus !== undefined &&
                      APPROVAL_STATUS.hasOwnProperty(
                        r?.RequestConfirms?.[0]?.ApprovalStatus,
                      ) && (
                        <Badge
                          color={
                            (
                              APPROVAL_STATUS as Record<
                                number,
                                { label: string; color: string }
                              >
                            )[r?.RequestConfirms?.[0]?.ApprovalStatus]?.color ||
                            'gray'
                          }
                        >
                          {(
                            APPROVAL_STATUS as Record<
                              number,
                              { label: string; color: string }
                            >
                          )[r?.RequestConfirms?.[0]?.ApprovalStatus]?.label ||
                            'Không xác định'}
                        </Badge>
                      )}
                  </Table.Td>
                  <Table.Td>
                    {r?.RequestConfirms?.[0]?.confirmAt &&
                      dayjs(r?.RequestConfirms?.[0]?.confirmAt).format(
                        'HH:mm:ss DD/MM/YYYY',
                      )}
                  </Table.Td>
                  <Table.Td>{r.Id_Request}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      {requests.length > 0 && (
        <Flex className={styles.pagination} justify="center">
          <Pagination
            defaultCurrent={page?.current || 1}
            current={page?.current}
            pageSize={page?.limit || 10}
            total={page?.total || 0}
            showSizeChanger
            onChange={handlePageChange}
          />
        </Flex>
      )}

      {chartData && !isFetching && (
        <Stack>
          <Divider />
          <Title order={3}>Biểu đồ tổng quan yêu cầu</Title>
          <Center>
            <Stack>
              <Flex
                direction={isMobile ? 'column-reverse' : 'row'}
                gap={{ base: 20, sm: 80 }}
                align={'center'}
              >
                <Box
                  style={{
                    maxWidth: '400px',
                  }}
                >
                  {isMobile && <Divider mb={20} />}

                  <PieChartJS
                    data={{
                      labels: chartData.map((item) => item.name),
                      datasets: [
                        {
                          data: chartData.map((item) => item.value),
                          backgroundColor: chartData.map((item) => item.color),
                        },
                      ],
                    }}
                  />
                </Box>
                <Image
                  style={{
                    maxWidth: '800px',
                  }}
                  src={step}
                  alt="stepper"
                />
              </Flex>
            </Stack>
          </Center>
        </Stack>
      )}
    </Stack>
  )
}

export default RequestList
