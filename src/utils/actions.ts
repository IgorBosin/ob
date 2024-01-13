import {dataType} from "shared/api/getKlines";

export const isRedCandle = (candle: dataType) => candle.open > candle.close

export const isGreenCandle = (candle: dataType) => candle.open < candle.close
