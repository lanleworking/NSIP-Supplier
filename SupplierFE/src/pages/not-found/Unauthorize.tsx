import useAuth from '@/hooks/query/useAuth'
import { fetchErrorRes } from '@/utils/fetch'
import { Button, Flex } from '@mantine/core'
import { Result } from 'antd'
import { useEffect } from 'react'

function Unauthorize() {
  const { logOutMutation } = useAuth()

  const { mutate, isPending } = logOutMutation

  useEffect(() => {
    document.title = '403 - Unauthorized'
  }, [])

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/login'
      },
      onError: () =>
        fetchErrorRes('Đăng xuất không thành công, vui lòng thử lại sau'),
    })
  }
  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Tài khoản của bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên"
        extra={
          <Button onClick={handleLogout} loading={isPending}>
            Đăng nhập
          </Button>
        }
      />
    </Flex>
  )
}

export default Unauthorize
