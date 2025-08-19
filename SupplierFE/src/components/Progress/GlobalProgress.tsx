import { Progress } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLoadingStore } from '@/stores/loadingStore'

function GlobalProgress() {
  const [progress, setProgress] = useState(0)
  const isLoading = useLoadingStore((state) => state.isLoading)

  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    if (isLoading) {
      setProgress(0)
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + Math.random() * 10
          }
          return prev
        })
      }, 500)
    } else {
      setProgress(100)
      const resetTimer = setTimeout(() => {
        setProgress(0)
      }, 200)
      return () => clearTimeout(resetTimer)
    }

    return () => clearInterval(progressInterval)
  }, [isLoading])

  if (!isLoading && progress === 0) return null

  return (
    <Progress
      value={progress}
      size="sm"
      transitionDuration={200}
      striped
      animated={isLoading}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
      }}
    />
  )
}

export default GlobalProgress
