import { DataType } from 'shared/api/getKlines'
import { isRedCandle } from 'shared/getColorCandle/isRedCandle'

export const filterOBByLiquidityWithdrawal = (data: DataType[], orderBlockList: DataType[], prevNumberCandleForLiquidityWithdrawal: number): DataType[] => {
  if (!prevNumberCandleForLiquidityWithdrawal) return orderBlockList

  const redCandle: DataType[] = []
  const greenCandle: DataType[] = []

  orderBlockList.forEach((el) => {
    isRedCandle(el) ? redCandle.push(el) : greenCandle.push(el)
  })

  const filteredBull = filterBullOBByLiquidityWithdrawal(data, redCandle, prevNumberCandleForLiquidityWithdrawal)
  const filteredBear = filterBearOBByLiquidityWithdrawal(data, greenCandle, prevNumberCandleForLiquidityWithdrawal)

  return [...filteredBull, ...filteredBear].sort((a, b) => a.openTime - b.openTime)
}

export const filterBearOBByLiquidityWithdrawal = (data: DataType[], orderBlockList: DataType[], prevNumberCandleForLiquidityWithdrawal: number) => {
  if (!prevNumberCandleForLiquidityWithdrawal) return orderBlockList
  const sortOB = []

  for (const orderBlock of orderBlockList) {
    const obIndex = data.indexOf(orderBlock)
    let isValid = true

    for (let i = 1; i <= prevNumberCandleForLiquidityWithdrawal; i++) {
      if (!data[obIndex - i]) {
        isValid = false
        break
      }

      if (!(data[obIndex].high > data[obIndex - i].high)) {
        isValid = false
        break
      }
    }
    if (isValid) {
      sortOB.push(orderBlock)
    }
  }

  return sortOB
}

export const filterBullOBByLiquidityWithdrawal = (data: DataType[], orderBlockList: DataType[], prevNumberCandleForLiquidityWithdrawal: number) => {
  if (!prevNumberCandleForLiquidityWithdrawal) return orderBlockList
  const sortOB = []
  for (const orderBlock of orderBlockList) {
    const obIndex = data.indexOf(orderBlock)
    let isValid = true

    for (let i = 1; i <= prevNumberCandleForLiquidityWithdrawal; i++) {
      if (!data[obIndex - i]) {
        isValid = false
        break
      }

      if (!(data[obIndex].low < data[obIndex - i].low)) {
        isValid = false
        break
      }
    }
    if (isValid) {
      sortOB.push(orderBlock)
    }
  }
  return sortOB
}
