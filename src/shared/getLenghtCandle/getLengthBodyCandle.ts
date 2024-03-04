import { DataType } from '@/shared/api/getKlines'
import { isGreenCandle } from '@/shared/getColorCandle/isGreenCandle'
import { isRedCandle } from '@/shared/getColorCandle/isRedCandle'

export const getLengthBodyCandle = (candle: DataType) => {
  if (isRedCandle(candle)) {
    return candle.close - candle.open
  }
  if (isGreenCandle(candle)) {
    return candle.open - candle.close
  }
}
