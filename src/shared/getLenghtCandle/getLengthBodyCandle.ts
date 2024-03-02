import { DataType } from 'shared/api/getKlines'
import { isRedCandle } from 'shared/getColorCandle/isRedCandle'
import { isGreenCandle } from 'shared/getColorCandle/isGreenCandle'

export const getLengthBodyCandle = (candle: DataType) => {
  if (isRedCandle(candle)) {
    return candle.close - candle.open
  }
  if (isGreenCandle(candle)) {
    return candle.open - candle.close
  }
}
