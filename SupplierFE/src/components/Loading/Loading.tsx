import { Flex, Image } from '@mantine/core'
import vasLogo from '@/assets/logo/vasPortLogo.png'
import clsx from 'clsx'
import styles from './Loading.module.scss'

function Loading() {
  return (
    <Flex
      className={clsx(styles.loader)}
      align={'center'}
      justify="center"
      style={{ height: '100vh' }}
    >
      <Image
        className={clsx(styles.loaderLogo)}
        src={vasLogo}
        alt="Loading..."
        w={200}
      />
    </Flex>
  )
}

export default Loading
