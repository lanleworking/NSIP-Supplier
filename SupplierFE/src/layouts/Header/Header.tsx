import { Avatar, Button, Flex, Image, Menu, NavLink, Text } from '@mantine/core'
import { Link, useNavigate } from '@tanstack/react-router'
import vasLogo from '@/assets/logo/vasPortLogo.png'
import useAuth from '@/hooks/query/useAuth'
import { useContext } from 'react'
import { AuthContext } from '@/providers/Auth/AuthContext'
import { fetchErrorRes } from '@/utils/fetch'
import clsx from 'clsx'
import styles from './Header.module.scss'
import { HEADER_HEIGHT, PADDING_X } from '@/constants/layout'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { ChangePasswordModal } from '@/components/modals/ChangePasswordModal'

import { FiKey } from 'react-icons/fi'
import { IoExitOutline } from 'react-icons/io5'
import { BsPersonFillGear } from 'react-icons/bs'

function Header() {
  const path = window.location.pathname
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { curSupplier, setCurSupplier } = useContext(AuthContext)
  const { logOutMutation } = useAuth()
  const navigate = useNavigate()
  const [
    openedChangePasswordModal,
    { open: openChangePassModal, close: closeChangePassModal },
  ] = useDisclosure(false)

  const handleLogout = async () => {
    await logOutMutation
      .mutateAsync()
      .then(() => {
        setCurSupplier(null)
        navigate({ to: '/login' })
      })
      .catch((error) => {
        fetchErrorRes(error)
      })
  }
  return (
    <>
      <Flex
        px={PADDING_X}
        h={HEADER_HEIGHT}
        align={'center'}
        justify={'space-between'}
      >
        <Link to="/">
          <Image w={88} src={vasLogo} alt="vasLogo" />
        </Link>

        {isMobile ? (
          <Menu>
            <Menu.Target>
              <Flex
                className={clsx(styles.userContainer)}
                align={'center'}
                gap={8}
              >
                <Text>{curSupplier?.LoginName}</Text>
                <Avatar>
                  <Image fit="contain" src={vasLogo} alt="vasLogo" />
                </Avatar>
              </Flex>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                to="/supplier/edit"
                leftSection={<BsPersonFillGear />}
              >
                Cập nhật thông tin
              </Menu.Item>
              <Menu.Item onClick={openChangePassModal} leftSection={<FiKey />}>
                Đổi mật khẩu
              </Menu.Item>
              <Menu.Item
                disabled={logOutMutation.isPending}
                onClick={handleLogout}
                color="red"
                leftSection={<IoExitOutline />}
              >
                Đăng xuất
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Flex gap={8} align={'center'}>
            <NavLink
              mb={2}
              className={styles.navLink}
              href="/supplier/edit"
              label="Cập nhật thông tin"
              active={path.includes('/supplier/edit')}
            />
            <Button
              onClick={openChangePassModal}
              fw={100}
              c="black"
              variant="subtle"
            >
              Đổi mật khẩu
            </Button>
            <Button
              variant="subtle"
              color="red"
              onClick={handleLogout}
              disabled={logOutMutation.isPending}
              leftSection={<IoExitOutline />}
            >
              Đăng xuất
            </Button>
          </Flex>
        )}
      </Flex>
      <ChangePasswordModal
        opened={openedChangePasswordModal}
        onClose={closeChangePassModal}
      />
    </>
  )
}

export default Header
