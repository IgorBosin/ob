import { findBuyside } from '@/features/findLiquidityStrategy/actions/findLiquidity/findBuyside'
import { findSellside } from '@/features/findLiquidityStrategy/actions/findLiquidity/findSellside'
import { DataType, getKline } from '@/shared/api/getKlines'

export const findSellsideAndBuyside = async (
  symbols: string,
  initialTime: null | number,
  timeFrame: string
) => {
  const res: Liquidity = {
    buyside: {},
    sellside: {},
  }

  const data: DataType[] = await getKline(symbols, timeFrame, initialTime)

  const buysideData = findBuyside(data)

  if (buysideData.length > 0) {
    res.buyside = buysideData.reduce((prev, current) => {
      return prev.high <= current.high ? prev : current
    })
  }

  const sellsideData = findSellside(data)

  if (sellsideData.length > 0) {
    res.sellside = sellsideData.reduce((prev, current) => {
      return prev.low >= current.low ? prev : current
    })
  }

  // console.log(res)
  return res
}

export type Liquidity = {
  buyside: Partial<DataType>
  sellside: Partial<DataType>
}
