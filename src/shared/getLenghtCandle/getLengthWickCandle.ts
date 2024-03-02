import { DataType } from 'shared/api/getKlines'
import { isRedCandle } from 'shared/getColorCandle/isRedCandle'
import { isGreenCandle } from 'shared/getColorCandle/isGreenCandle'

export const getLengthWickCandle = (candle: DataType) => {
  if (isRedCandle(candle)) {
    return candle.close - candle.low
  }
  if (isGreenCandle(candle)) {
    return candle.high - candle.close
  }
}
