import {DataType, getKline} from "shared/api/getKlines";
import {getLengthCandle, isGreenCandle, isRedCandle} from "utils/actions";
import {TradeEntryAndOrderBlockIndexes} from "features/closingTrade/ClosingTrade";
import {showMaxZeroInRow} from "features/closingTrade/actions";
import {PercentToEntryPoint} from "features/notEnteringOrderBlocks/notEnteringOrderBlocks";
import {findOB} from "features/OrderBlocks/action/findOB";
import {filterOBByLiquidityWithdrawal} from "features/OrderBlocks/action/filterOBByLiquidityWithdrawal";
import {enteringTrade, isValidEntry} from "features/openTrade/action";

export const getCoinInfo = async (
  coin: string,
  timeFrame: string,
  initialTime: number | null,
  prevNumberCandleForLiquidityWithdrawal: number,
  factorOB: number,
  candlesNumberForInitializeOB: number,
  isShowOnlyBullOB: boolean,
  isShowOnlyBearOB: boolean
): Promise<SummaryInfo> => {


  const summaryInfo: SummaryInfo = {
    coin: '',
    allEnteringTrades: 0,
    win: 0,
    lose: 0,
    earnPoints: 0,
    percentWinningTrades: 0,
    maxLostTradesInRow: 0,
    strategyAssessment: 0,
    fee: 0,
    total: 0,
    openTime: 0,
    closeTime: 0,
    nearestBullOB: 0,
    nearestBearOB: 0,
  }
  // const isShowOnlyBearOB = true
  // const isShowOnlyBullOB = true
  const ratio = 2 // выбор небоходимого соотношения риск\прибыль
  const data: DataType[] = []
  const firstData: DataType[] = await getKline(coin, timeFrame, initialTime);
  data.push(...firstData)

  // for (let i = 0; i < 3; i++) {
  //   const secondData: DataType[] = await getKline(`${coin}USDT`, timeFrame, data[data.length - 1].closeTime);
  //   data.push(...secondData)
  //   if (!secondData.length) {
  //     break
  //   }
  // }
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // await delay(10000);  // Добавляем задержку в 50 миллисекунд между вызовами

  // while (true) {
  //   const secondData: DataType[] = await getKline(`${coin}USDT`, timeFrame, data[data.length - 1].closeTime);
  //   data.push(...secondData)
  //   if (!secondData.length) {
  //     break
  //   }
  // }

  const oB = findOB(data, candlesNumberForInitializeOB)

  const oBByLiquidityWithdrawal = filterOBByLiquidityWithdrawal(data, oB, prevNumberCandleForLiquidityWithdrawal)
  const orderBlocksIndexes: number[] = oBByLiquidityWithdrawal.map((orderBlock) => data.indexOf(orderBlock));


  const enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[] = enteringTrade(data, orderBlocksIndexes, candlesNumberForInitializeOB, factorOB)

  const closingLongTrade = () => {
    let obj = {
      win: 0,
      lose: 0,
      tradesInRow: {
        date: [] as number[],
        point: [] as number[]
      }
    }
    // проверяем enteringCandleIndexes пробила ли она вниз до лоя orderBlocks.
    for (const enterCandle of enteringCandleIndexes) {
      const lengthCandle = getLengthCandle(data[enterCandle.orderBlock], factorOB) * ratio
      const profitForBullishOB = lengthCandle + data[enterCandle.orderBlock].low + getLengthCandle(data[enterCandle.orderBlock], factorOB)
      const profitForBearishOB = data[enterCandle.orderBlock].high - getLengthCandle(data[enterCandle.orderBlock], factorOB) - lengthCandle

      if (isShowOnlyBullOB) {
        // бычий ОБ (свеча красная)
        if (isRedCandle(data[enterCandle.orderBlock])) {
          for (let i = enterCandle.entering; i < data.length; i++) {
            if (data[i].low < data[enterCandle.orderBlock].low) {
              obj.lose++
              obj.tradesInRow.point.push(0)
              break
            }
            if (data[i].high > profitForBullishOB) {
              // индекс ентеринг свечи равен индексу текущей свечи и эта свеча не закрылась выше ТП, то continue
              if (i === enterCandle.entering && data[i].close < profitForBullishOB) {
                continue
              }
              obj.tradesInRow.point.push(1)
              obj.win++
              obj.tradesInRow.date.push(data[enterCandle.orderBlock].openTime)
              break
            }
          }
        }
      }

      if (isShowOnlyBearOB) {
        // медвежий ОБ (свеча зеленая)
        if (isGreenCandle(data[enterCandle.orderBlock])) {
          for (let i = enterCandle.entering; i < data.length; i++) {
            if (data[i].high > data[enterCandle.orderBlock].high) {
              obj.lose++
              obj.tradesInRow.point.push(0)
              break
            }
            if (data[i].low < profitForBearishOB) {
              // индекс ентеринг свечи равен индексу текущей свечи и эта свеча не закрылась выше ТП, то continue
              if (i === enterCandle.entering && data[i].close > profitForBearishOB) {
                continue
              }
              obj.tradesInRow.point.push(1)
              obj.win++
              obj.tradesInRow.date.push(data[enterCandle.orderBlock].openTime)
              break
            }
          }
        }
      }
    }
    // obj.tradesInRow.date.forEach(el => {
    //   console.log(formattedDate(el))
    // })
    return obj
  }
  const closeTrades = closingLongTrade()

  function findNotEnteringOrderBlocksIndexes(enteringTrades: TradeEntryAndOrderBlockIndexes[], orderBlocksIndexes: number[]): number[] {
    const result: number[] = [];

    const enteringOrderBlocks = enteringTrades.map(el => el.orderBlock)
    for (const orderBlockIndex of orderBlocksIndexes) {
      if (enteringOrderBlocks.includes(orderBlockIndex)) {
        continue
      }
      result.push(orderBlockIndex)
    }
    return result;
  }

  const notEnteringOrderBlocksIndexes = findNotEnteringOrderBlocksIndexes(enteringCandleIndexes, orderBlocksIndexes)

  const getNearestOB = (notEnteringOrderBlocksIndexes: number[]): PercentToEntryPoint => {
    const bearOB: number[] = []
    const bullOB: number[] = []
    const currentPrice = data[data.length - 1].close
    const percentToEntryPoint: PercentToEntryPoint = {
      nearestBearOB: 0,
      nearestBullOB: 0,
    }
    notEnteringOrderBlocksIndexes.forEach(el => {
      const candle = data[el]

      if (isRedCandle(candle)) {
        const nearestBullOB = (candle.high - currentPrice) / currentPrice * 100
        bullOB.push(nearestBullOB)
        console.log('bull OB', nearestBullOB)

      }
      if (isGreenCandle(candle)) {
        const nearestBearOB: number = (candle.low - currentPrice) / currentPrice * 100
        bearOB.push(nearestBearOB)
        console.log('bear OB', nearestBearOB)
      }
    })
    percentToEntryPoint.nearestBullOB = bullOB.length ? Math.max(...bullOB) : -100
    percentToEntryPoint.nearestBearOB = bearOB.length ? Math.min(...bearOB) : 100
    return percentToEntryPoint
  }

  const nearestOB = getNearestOB(notEnteringOrderBlocksIndexes)

  const maxZeroInRow = showMaxZeroInRow(closeTrades.tradesInRow.point)

  summaryInfo.coin = coin
  summaryInfo.allEnteringTrades = enteringCandleIndexes.length
  summaryInfo.win = closeTrades.win
  summaryInfo.lose = closeTrades.lose
  summaryInfo.earnPoints = closeTrades.win * ratio - closeTrades.lose
  const percentWinningTrades = closeTrades.win / (closeTrades.win + closeTrades.lose) * 100
  summaryInfo.percentWinningTrades = +(closeTrades.win / (closeTrades.win + closeTrades.lose) * 100).toFixed(2)
  summaryInfo.maxLostTradesInRow = maxZeroInRow
  summaryInfo.strategyAssessment = +((percentWinningTrades * ratio / 100) - (1 - percentWinningTrades / 100)).toFixed(2)
  summaryInfo.fee = +(enteringCandleIndexes.reduce((acc, el) => acc + el.fee, 0)).toFixed(2)
  summaryInfo.total = +((closeTrades.win * ratio - closeTrades.lose) * 10 - (enteringCandleIndexes.reduce((acc, el) => acc + el.fee, 0))).toFixed(2)
  summaryInfo.openTime = data[0].openTime
  summaryInfo.closeTime = data[data.length - 1].closeTime
  summaryInfo.nearestBearOB = +nearestOB.nearestBearOB.toFixed(2)
  summaryInfo.nearestBullOB = +nearestOB.nearestBullOB.toFixed(2)

  return summaryInfo
}

export type SummaryInfo = {
  coin: string
  allEnteringTrades: number
  win: number
  lose: number
  earnPoints: number
  percentWinningTrades: number
  maxLostTradesInRow: number
  strategyAssessment: number
  fee: number
  total: number
  openTime: number
  closeTime: number
  nearestBullOB: number
  nearestBearOB: number
}

