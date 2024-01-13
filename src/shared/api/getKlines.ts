import axios from "axios";

export async function getKline(pair: string, interval: string, startTime: number, limit = 1000) {
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=${limit}&startTime=${startTime}`;
  const data = await axios.get<BaseResponseType[]>(url);

  const transformedData: dataType[] = data.data.map((series) => ({
    openTime: series[0],
    open: parseFloat(series[1]),
    high: parseFloat(series[2]),
    low: parseFloat(series[3]),
    close: parseFloat(series[4]),
    volume: parseFloat(series[5]),
    closeTime: series[6],
    quoteAssetVolume: parseFloat(series[7]),
    trades: series[8],
    takerBaseAssetVolume: parseFloat(series[9]),
    takerQuoteAssetVolume: parseFloat(series[10]),
    ignored: parseFloat(series[11])
  }));

  return transformedData;
}

type BaseResponseType = [
  number,    // Время открытия (тип LONG)
  string,    // Цена открытия (тип STRING)
  string,    // Наивысшая цена (тип STRING)
  string,    // Наименьшая цена (тип STRING)
  string,    // Цена закрытия (тип STRING)
  string,    // Объем (тип STRING)
  number,    // Время закрытия (тип LONG)
  string,    // Объем валюты (тип STRING)
  number,    // Количество сделок (тип NUMBER)
  string,    // Тактильный объем (тип STRING)
  string,    // Объем валюты (тип STRING)
  string     // Неизвестное поле (тип STRING)
];

export type dataType = {
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number
  quoteAssetVolume: number
  trades: number
  takerBaseAssetVolume: number
  takerQuoteAssetVolume: number
  ignored: number
}
