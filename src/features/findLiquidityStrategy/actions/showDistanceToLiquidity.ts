import { findSellsideAndBuyside } from 'features/findLiquidityStrategy/actions/findSellsideAndBuyside'
import { symbolPrice } from 'shared/api/symbolPrice'
import { showPercentToLowerPrice, showPercentToTopPrice } from 'shared/showPercentBetweenTwoPrices/showPercentBetweenTwoPrices'

export const showDistanceToLiquidity = async (symbols: string, initialTime: number | null) => {
  const res: ShowDistanceToLiquidity = {
    coin: '',
    percentBeforeSellside: 0,
    percentBeforeBuyside: 0,
    percentCurrentPriceBeforeBuyside: 0,
    percentCurrentPriceBeforeSellside: 0,
  }
  const liquid1D = await findSellsideAndBuyside(symbols, initialTime, '1d')
  const liquid4h = await findSellsideAndBuyside(symbols, initialTime, '4h')
  const price = await symbolPrice(symbols)

  res.coin = symbols

  res.percentBeforeSellside = showPercentToLowerPrice(liquid4h.sellside.low!, liquid1D.sellside.low!) || 0

  res.percentBeforeBuyside = showPercentToTopPrice(liquid1D.buyside.high!, liquid4h.buyside.high!) || 0

  res.percentCurrentPriceBeforeBuyside = showPercentToTopPrice(liquid4h.buyside.high!, price) || 0

  res.percentCurrentPriceBeforeSellside = showPercentToLowerPrice(price, liquid4h.sellside.low!) || 0

  console.log(res)
  return res
}

export type ShowDistanceToLiquidity = {
  coin: string
  percentBeforeSellside: number
  percentBeforeBuyside: number
  percentCurrentPriceBeforeSellside: number
  percentCurrentPriceBeforeBuyside: number
}
