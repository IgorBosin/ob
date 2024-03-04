import axios from 'axios'

export async function getKline(
  pair: string,
  interval: string,
  startTime: null | number,
  limit = 1000
) {
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${pair}USDT&interval=${interval}&limit=${limit}&startTime=${startTime}`
  const data = await axios.get<BaseResponseType[]>(url)

  const transformedData: DataType[] = data.data.map(series => ({
    close: parseFloat(series[4]),
    closeTime: series[6],
    high: parseFloat(series[2]),
    ignored: parseFloat(series[11]),
    low: parseFloat(series[3]),
    open: parseFloat(series[1]),
    openTime: series[0],
    quoteAssetVolume: parseFloat(series[7]),
    takerBaseAssetVolume: parseFloat(series[9]),
    takerQuoteAssetVolume: parseFloat(series[10]),
    trades: series[8],
    volume: parseFloat(series[5]),
  }))

  return transformedData
}

type BaseResponseType = [
  number, // Время открытия (тип LONG)
  string, // Цена открытия (тип STRING)
  string, // Наивысшая цена (тип STRING)
  string, // Наименьшая цена (тип STRING)
  string, // Цена закрытия (тип STRING)
  string, // Объем (тип STRING)
  number, // Время закрытия (тип LONG)
  string, // Объем валюты (тип STRING)
  number, // Количество сделок (тип NUMBER)
  string, // Тактильный объем (тип STRING)
  string, // Объем валюты (тип STRING)
  string, // Неизвестное поле (тип STRING)
]

export type DataType = {
  close: number
  closeTime: number
  high: number
  ignored: number
  low: number
  open: number
  openTime: number
  quoteAssetVolume: number
  takerBaseAssetVolume: number
  takerQuoteAssetVolume: number
  trades: number
  volume: number
}
