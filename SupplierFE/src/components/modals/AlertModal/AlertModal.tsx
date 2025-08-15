import { Button, Divider, Group, Modal, type ButtonProps } from '@mantine/core'

type AlertModalProps = {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  title: string
  children: React.ReactNode
  submitBtnText?: string
  submitBtnProps?: ButtonProps
}

function AlertModal({
  opened,
  onClose,
  onConfirm,
  isLoading,
  title,
  children,
  submitBtnText,
  submitBtnProps = {},
}: AlertModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Modal.Body>
        {children}
        <Divider my={12} />
        <Group justify="end">
          <Button disabled={isLoading} variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button {...submitBtnProps} loading={isLoading} onClick={onConfirm}>
            {submitBtnText || 'Xác nhận'}
          </Button>
        </Group>
      </Modal.Body>
    </Modal>
  )
}

export default AlertModal
