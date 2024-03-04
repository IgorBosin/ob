import { TradeEntryAndOrderBlockIndexes } from '@/features/orderBlockStrategy/closingTrade/ClosingTrade'
import { DataType } from '@/shared/api/getKlines'
import { isGreenCandle } from '@/shared/getColorCandle/isGreenCandle'
import { isRedCandle } from '@/shared/getColorCandle/isRedCandle'
import { getLengthCandle } from '@/shared/getLenghtCandle/getLengthCandle'

export const enteringTrade = (
  data: DataType[],
  orderBlocksIndexes: number[],
  candlesNumberForInitializeOB: number,
  factorOB: number
): TradeEntryAndOrderBlockIndexes[] => {
  const enteringCandleIndexes = []

  for (const ob of orderBlocksIndexes) {
    // зайти в сделку может только на следующей свече после candlesNumberForInitializeOB
    for (let i = ob + candlesNumberForInitializeOB + 1; i < data.length; i++) {
      if (isValidEntry(data[ob], data[i], factorOB)) {
        enteringCandleIndexes.push({
          entering: i,
          fee: (1000 / (((data[ob].high - data[ob].low) / data[ob].low) * 100)) * 0.00063,
          orderBlock: ob,
        })
        break
      }
    }
  }

  return enteringCandleIndexes
}

export const isValidEntry = (candleOb: DataType, candleIter: DataType, factorOB: number) => {
  if (isRedCandle(candleOb)) {
    const a = candleOb.low + getLengthCandle(candleOb, factorOB)

    return a >= candleIter.low
  } else {
    const a = candleOb.high - getLengthCandle(candleOb, factorOB)

    return a <= candleIter.high
  }
}
export const isValidEntry_ = (candleOb: DataType, candleIter: DataType, factorOB: number) => {
  if (isRedCandle(candleOb)) {
    return candleOb.low + getLengthCandle(candleOb, factorOB) >= candleIter.low
  }
  if (isGreenCandle(candleOb)) {
    return candleOb.high - getLengthCandle(candleOb, factorOB) <= candleIter.high
  }
}

export const enteringTrade_ = () => {}
