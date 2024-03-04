import { useSelector } from 'react-redux'

import { TradeEntryAndOrderBlockIndexes } from '@/features/orderBlockStrategy/closingTrade/ClosingTrade'
import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import { isGreenCandle } from '@/shared/getColorCandle/isGreenCandle'
import { isRedCandle } from '@/shared/getColorCandle/isRedCandle'

type Props = {
  enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  orderBlocksIndexes: number[]
}

const NotEnteringOrderBlocks = ({ enteringCandleIndexes, orderBlocksIndexes }: Props) => {
  const data = useSelector(selectData)

  if (!data.length) {
    return <div></div>
  }

  function findNotEnteringOrderBlocksIndexes(
    enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[],
    orderBlocksIndexes: number[]
  ): number[] {
    const result: number[] = []

    const enteringOrderBlocks = enteringCandleIndexes.map(el => el.orderBlock)

    for (const orderBlockIndex of orderBlocksIndexes) {
      if (enteringOrderBlocks.includes(orderBlockIndex)) {
        continue
      }
      result.push(orderBlockIndex)
    }

    return result
  }

  const notEnteringOrderBlocksIndexes = findNotEnteringOrderBlocksIndexes(
    enteringCandleIndexes,
    orderBlocksIndexes
  )

  const nearestOB = (notEnteringOrderBlocksIndexes: number[]): PercentToEntryPoint => {
    const bearOB: number[] = []
    const bullOB: number[] = []
    const currentPrice = data[data.length - 1].close
    const percentToEntryPoint: PercentToEntryPoint = {
      nearestBearOB: 0,
      nearestBullOB: 0,
    }

    notEnteringOrderBlocksIndexes.forEach(el => {
      const candle = data[el]

      if (isRedCandle(candle)) {
        const nearestBullOB = ((candle.high - currentPrice) / currentPrice) * 100

        bullOB.push(nearestBullOB)
        // console.log('bull OB', nearestBullOB)
      }
      if (isGreenCandle(candle)) {
        const nearestBearOB: number = ((candle.low - currentPrice) / currentPrice) * 100

        bearOB.push(nearestBearOB)
        // console.log('bear OB', nearestBearOB)
      }
    })
    percentToEntryPoint.nearestBullOB = Math.max(...bullOB)
    percentToEntryPoint.nearestBearOB = Math.min(...bearOB)

    return percentToEntryPoint
  }

  nearestOB(notEnteringOrderBlocksIndexes)

  return <div></div>
}

export default NotEnteringOrderBlocks

export type PercentToEntryPoint = {
  nearestBearOB: number
  nearestBullOB: number
}
