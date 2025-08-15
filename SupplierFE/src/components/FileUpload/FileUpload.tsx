import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Table,
  Text,
  Title,
} from '@mantine/core'

import { GrUpload } from 'react-icons/gr'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { FaRegTrashAlt } from 'react-icons/fa'
import type { IRequestFile } from '@/interfaces/data'
import { Link } from '@tanstack/react-router'
import { API_URL } from '@/constants/config'
import useFile from '@/hooks/query/useFile'
import toast from 'react-hot-toast'
import { fetchErrorRes } from '@/utils/fetch'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'
import AlertModal from '../modals/AlertModal/AlertModal'

type FileUploadProps = {
  onClickOpenUploadModal?: () => void
  files?: IRequestFile[]
  refetch?: () => void
  isDisabled?: boolean
}

function FileUpload({
  onClickOpenUploadModal,
  files,
  refetch,
  isDisabled = false,
}: FileUploadProps) {
  const { removeFileMutation } = useFile()
  const [
    openedDeleteAlertModal,
    { open: openDeleteAlertModal, close: closeDeleteAlertModal },
  ] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState<number | null>(null)
  const { mutate: removeFileMutate, isPending } = removeFileMutation

  const handleClickDelete = (fileId: number) => {
    setSelectedFile(fileId)
    openDeleteAlertModal()
  }

  const handleClose = () => {
    setSelectedFile(null)
    closeDeleteAlertModal()
  }

  const handleSubmitRemoveFile = () => {
    if (!selectedFile) return toast.error('Không tìm thấy ID file')
    removeFileMutate(selectedFile, {
      onSuccess: () => {
        toast.success('Xóa file thành công')
        refetch?.()
        closeDeleteAlertModal()
      },
      onError: (error) => fetchErrorRes(error),
    })
  }

  return (
    <Box>
      <Flex justify={'space-between'}>
        <Title order={3}>File đính kèm</Title>
        {!isDisabled && (
          <Button
            onClick={onClickOpenUploadModal}
            leftSection={<GrUpload />}
            variant="outline"
          >
            Upload File
          </Button>
        )}
      </Flex>
      {isEmpty(files) ? (
        <Empty description="Chưa file nào được tải lên" />
      ) : (
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Thao tác</Table.Th>
              <Table.Th>Tên file</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {files?.map((file) => (
              <Table.Tr key={file.ID}>
                <Table.Td>
                  <Group>
                    <ActionIcon
                      component={Link}
                      target="_blank"
                      to={API_URL + file.filePath}
                      variant="subtle"
                      rel="noopener noreferrer"
                      c={'blue'}
                    >
                      <MdOutlineRemoveRedEye />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleClickDelete(file.ID)}
                      variant="subtle"
                      c={'red'}
                    >
                      <FaRegTrashAlt />
                    </ActionIcon>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <a
                    style={{
                      textDecoration: 'underline',
                      color: 'blue',
                    }}
                    href={API_URL + file.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.fileName}
                  </a>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <AlertModal
        opened={openedDeleteAlertModal}
        onClose={handleClose}
        onConfirm={handleSubmitRemoveFile}
        isLoading={isPending}
        title="Xóa file"
        submitBtnText="Xóa"
        submitBtnProps={{ color: 'red' }}
      >
        <Text>Bạn chắc chắn xóa file này không?</Text>
      </AlertModal>
    </Box>
  )
}

export default FileUpload
