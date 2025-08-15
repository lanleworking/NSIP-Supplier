import useSupplier from '@/hooks/query/useSupplier'
import { fetchErrorRes } from '@/utils/fetch'
import { formValidateMessage } from '@/utils/validate'
import { Button, Group, Modal, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import toast from 'react-hot-toast'

type ChangePasswordModalProps = {
  opened: boolean
  onClose: () => void
}

function ChangePasswordModal({ opened, onClose }: ChangePasswordModalProps) {
  const { updateSupplierPass } = useSupplier()
  const { mutate: updateSupplierPassMutate, isPending } = updateSupplierPass
  const { reset, onSubmit, isDirty, key, getInputProps } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: {
      oldPassword: (value: any) =>
        formValidateMessage({
          value,
          minLength: 6,
          maxLength: 50,
        }),
      newPassword: (value: any) =>
        formValidateMessage({
          value,
          minLength: 6,
          maxLength: 50,
        }),
      confirmNewPassword: (value: any, values) =>
        value === values.newPassword ? null : 'Mật khẩu không khớp',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (values: any) => {
    updateSupplierPassMutate(
      {
        oldPass: values.oldPassword,
        newPass: values.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Đổi mật khẩu thành công')
          handleClose()
        },
        onError: (error) => fetchErrorRes(error),
      },
    )
  }
  return (
    <Modal title="Đổi mật khẩu" opened={opened} centered onClose={handleClose}>
      <Modal.Body>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Stack>
            <PasswordInput
              key={key('oldPassword')}
              {...getInputProps('oldPassword')}
              label="Mật khẩu cũ"
              placeholder="Mật khẩu cũ"
              withAsterisk
              min={6}
              max={50}
            />
            <PasswordInput
              key={key('newPassword')}
              {...getInputProps('newPassword')}
              label="Mật khẩu mới"
              placeholder="Mật khẩu mới"
              withAsterisk
              min={6}
              max={50}
            />
            <PasswordInput
              key={key('confirmNewPassword')}
              {...getInputProps('confirmNewPassword')}
              label="Nhập lại mật khẩu mới"
              placeholder="Mật khẩu mới"
              withAsterisk
              min={6}
              max={50}
            />
            <Group justify="end">
              <Button
                disabled={isPending}
                variant="default"
                onClick={handleClose}
              >
                Hủy
              </Button>
              <Button loading={isPending} disabled={!isDirty()} type="submit">
                Lưu
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ChangePasswordModal
