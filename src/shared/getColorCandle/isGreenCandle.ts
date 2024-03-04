import { DataType } from '@/shared/api/getKlines'

export const isGreenCandle = (candle: DataType) => candle.open < candle.close
