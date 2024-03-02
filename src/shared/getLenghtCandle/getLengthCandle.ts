import { DataType } from 'shared/api/getKlines'

export const getLengthCandle = (candle: DataType, factorOB: number) => {
  return (candle.high - candle.low) * factorOB
}
