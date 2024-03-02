import { DataType } from 'shared/api/getKlines'

export const isRedCandle = (candle: DataType) => candle.open > candle.close
