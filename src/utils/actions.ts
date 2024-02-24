import {DataType} from "shared/api/getKlines";

export const isRedCandle = (candle: DataType) => candle.open > candle.close
export const isGreenCandle = (candle: DataType) => candle.open < candle.close
export const getLengthCandle = (candle: DataType, factorOB: number) => {
  return (candle.high - candle.low) * factorOB
}

export const getLengthWickCandle = (candle: DataType) => {
  if (isRedCandle(candle)) {
    return candle.close - candle.low
  }
  if (isGreenCandle(candle)) {
    return candle.high - candle.close
  }
}

export const getLengthBodyCandle = (candle: DataType) => {
  if (isRedCandle(candle)) {
    return candle.close - candle.open
  }
  if (isGreenCandle(candle)) {
    return candle.open - candle.close
  }
}
