import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useEffect, useState } from 'react'

import { MdOutlineUploadFile } from 'react-icons/md'
import { FaRegTrashAlt } from 'react-icons/fa'
import useFile from '@/hooks/query/useFile'
import { useParams } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { fetchErrorRes } from '@/utils/fetch'
import type { IRequestFile } from '@/interfaces/data'

type UploadFileModalProps = {
  files?: IRequestFile[]
  opened: boolean
  onClose: () => void
  refetch?: () => void
}

// accept only pdf and word files
const acceptedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function UploadFileModal({
  opened,
  onClose,
  refetch,
  files,
}: UploadFileModalProps) {
  const { requestId } = useParams({ from: '/request/$requestId/' })
  const { uploadFileMutation } = useFile()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [defaultFiles, setDefaultFiles] = useState<IRequestFile[]>(files || [])
  const [removeFileIds, setRemoveFileIds] = useState<number[]>([])

  const { mutate: uploadFileMutate, isPending } = uploadFileMutation

  const handleClose = () => {
    setSelectedFiles([])
    setRemoveFileIds([])
    setDefaultFiles(files || [])
    onClose()
  }

  const handleSelectFilesToRemove = (fileId: number) => {
    if (!removeFileIds.includes(fileId)) {
      setRemoveFileIds((prev) => [...prev, fileId])
      setDefaultFiles((prev) => prev.filter((file) => file.ID !== fileId))
    }
  }

  const handleUpload = () => {
    if (!requestId) return toast.error('Không tìm thấy ID yêu cầu')
    const payload = {
      files: selectedFiles,
      requestId: Number(requestId),
      removeFileIds: removeFileIds.length > 0 ? removeFileIds : undefined,
    }

    uploadFileMutate(payload, {
      onSuccess: () => {
        handleClose()
        toast.success('Cập nhật file thành công')
        refetch?.()
      },
      onError: (error) => fetchErrorRes(error),
    })
  }

  useEffect(() => {
    setDefaultFiles(files || [])
  }, [files])

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Upload File"
      size="lg"
      centered
    >
      <Stack>
        <Dropzone
          maxFiles={5}
          maxSize={10 * 1024 ** 2}
          accept={acceptedFileTypes}
          onDrop={(files) => setSelectedFiles(files)}
          onReject={(files) =>
            toast.error(
              `File không hợp lệ: ${files.map((file) => file.file.name).join(', ')}`,
            )
          }
        >
          <Flex gap={8} align={'center'}>
            <MdOutlineUploadFile size={60} />
            <Stack gap={'xs'}>
              <Text>Nhấn hoặc kéo thả vào đây để upload file</Text>
              <Text c="dimmed">
                (Chỉ chấp nhận PDF và WORD kích thước tối đa - 10MB)
              </Text>
            </Stack>
          </Flex>
        </Dropzone>

        <Box>
          {selectedFiles.map((file, index) => (
            <Flex py={4} px={4} key={index} justify={'space-between'}>
              <Flex gap={8}>
                <Text>{file.name}</Text>
                <Badge>New</Badge>
              </Flex>
              <ActionIcon
                onClick={() => {
                  setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
                }}
                c={'red'}
                variant="subtle"
              >
                <FaRegTrashAlt />
              </ActionIcon>
            </Flex>
          ))}
        </Box>
        <Box>
          {defaultFiles?.map((file) => (
            <Flex py={4} px={4} key={file.ID} justify={'space-between'}>
              <Text>{file.fileName}</Text>
              <ActionIcon
                onClick={() => handleSelectFilesToRemove(file.ID)}
                c={'red'}
                variant="subtle"
              >
                <FaRegTrashAlt />
              </ActionIcon>
            </Flex>
          ))}
        </Box>

        <Divider />
        <Group justify="end">
          <Button disabled={isPending} variant="default" onClick={handleClose}>
            Đóng
          </Button>
          <Button loading={isPending} onClick={handleUpload}>
            Upload
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default UploadFileModal
