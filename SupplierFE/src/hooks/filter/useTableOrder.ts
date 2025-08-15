import { useState } from 'react'

function useTableOrder(keys: string[]) {
  if (!keys || keys.length === 0) {
    throw new Error('Keys array must be provided and cannot be empty.')
  }
  const defaultOrder = keys.reduce<Record<string, any>>((acc, key) => {
    acc[key] = null
    return acc
  }, {})

  const [order, setOrder] = useState<Record<string, any>>(defaultOrder)

  return { order, setOrder }
}

export default useTableOrder
