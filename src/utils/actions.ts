import {DataType} from "shared/api/getKlines";

export const isRedCandle = (candle: DataType) => candle.open > candle.close
export const isGreenCandle = (candle: DataType) => candle.open < candle.close
export const getLengthCandle = (candle: DataType, factorOB: number) => {
  return (candle.high - candle.low) * factorOB
}
