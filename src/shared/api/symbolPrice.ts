import axios from 'axios'

export async function symbolPrice(pair: string) {
  const url = `https://fapi.binance.com/fapi/v1/ticker/price?symbol=${pair}USDT`
  const data = await axios.get<BaseResponseType>(url)

  return +data.data.price
}

type BaseResponseType = {
  price: string
  symbol: string
  tyme: number
}
