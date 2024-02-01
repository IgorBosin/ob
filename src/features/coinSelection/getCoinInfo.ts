import {dataType, getKline} from "shared/api/getKlines";
import {getLengthCandle, isGreenCandle, isRedCandle} from "utils/actions";
import {TradeEntryAndOrderBlockIndexes} from "features/closingTrade/ClosingTrade";
import {formattedDate} from "shared/Date/formattedDate";

export const getCoinInfo = async (coin: string, timeFrame: string, initialTime: number | null): Promise<SummaryInfo> => {
  const summaryInfo: SummaryInfo = {
    coin: '',
    allEnteringTrades: 0,
    win: 0,
    lose: 0,
    earnPoints: 0,
    persentWinningTrades: 0,
    maxLostTradesInRow: 0,
    strategyAssessment: 0,
    fee: 0,
    total: 0,
    openTime: 0,
    closeTime: 0,
  }
  const isFilterOBByLiquidityWithdrawal = false
  const factorOB = 1
  const candlesNumberForInitializeOB = 5
  const isShowOnlyRed = true
  const isShowOnlyGreen = true
  const ratio = 2 // выбор небоходимого соотношения риск\прибыль
  const data: dataType[] = []
  const firstData: dataType[] = await getKline(`${coin}USDT`, timeFrame, initialTime);
  data.push(...firstData)
  for (let i = 0; i < 3; i++) {
    const secondData: dataType[] = await getKline(`${coin}USDT`, timeFrame, data[data.length - 1].closeTime);
    data.push(...secondData)
    if (!secondData.length) {
      break
    }
  }
  // while (true) {
  //   const secondData: dataType[] = await getKline(`${coin}USDT`, timeFrame, data[data.length - 1].closeTime);
  //   data.push(...secondData)
  //   if (!secondData.length) {
  //     break
  //   }
  // }

  const findOB = () => {
    const result = [];

    for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {

      // Проверяем, что текущая свеча зеленая
      if (isGreenCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isGreenCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
            // if (isGreenCandle(data[i + j])) {
            isFollowedByRed = false;
            break;
          }
        }

        // Если все n следующих свечей красные, добавляем текущую свечу в результат
        if (isFollowedByRed) {
          result.push(data[i]);
        }
      }
      if (isRedCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isRedCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
            // if (isRedCandle(data[i + j])) {
            isFollowedByRed = false;
            break;
          }
        }

        // Если все n следующих свечей красные, добавляем текущую свечу в результат
        if (isFollowedByRed) {
          result.push(data[i]);
        }
      }
    }
    // result.forEach(el => console.log(formattedDate(el.openTime)))
    return result;
  };
  const oB = findOB()

  const filterOBByLiquidityWithdrawal = (orderBlockList: dataType[]) => {
    if (!isFilterOBByLiquidityWithdrawal) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      const obIndex = data.indexOf(orderBlock)
      if (isRedCandle(data[obIndex]))
        if (data[obIndex].low > data[obIndex - 1].low) {
          sortOB.push(orderBlock)
        }
      if (isGreenCandle(data[obIndex]))
        if (data[obIndex].high < data[obIndex - 1].high) {
          sortOB.push(orderBlock)
        }
    }
    return sortOB
  }
  const oBByLiquidityWithdrawal = filterOBByLiquidityWithdrawal(oB)
  const orderBlocksIndexes: number[] = oBByLiquidityWithdrawal.map((orderBlock) => data.indexOf(orderBlock));

  const isValidEntry = (candleOb: dataType, candleIter: dataType) => {
    if (isRedCandle(candleOb)) {
      const a = candleOb.low + getLengthCandle(candleOb, factorOB)
      return a >= candleIter.low;
    } else {
      const a = candleOb.high - getLengthCandle(candleOb, factorOB)
      return a <= candleIter.high;
    }
  }
  const enteringTrade = (): TradeEntryAndOrderBlockIndexes[] => {
    const enteringCandleIndexes = [];
    for (const ob of orderBlocksIndexes) {
      for (let i = ob + candlesNumberForInitializeOB + 1; i < data.length; i++) {
        if (isValidEntry(data[ob], data[i])) {
          enteringCandleIndexes.push({
            entering: i,
            orderBlock: ob,
            fee: 1000 / ((data[ob].high - data[ob].low) / data[ob].low * 100) * 0.00063
          });
          break;
        }
      }
    }
    enteringCandleIndexes.sort((a, b) => a.entering - b.entering).forEach(el => {
      console.log(formattedDate(data[el.entering].openTime))
    })
    return enteringCandleIndexes;
  }
  const enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[] = enteringTrade()
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

      if (isShowOnlyGreen) {
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

      if (isShowOnlyRed) {
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
              if (i === enterCandle.entering && data[i].close < profitForBearishOB) {
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

  function maxConsecutiveZeros(arr: number[]) {
    let maxZeros = 0;
    let currentZeros = 0;

    for (let num of arr) {
      if (num === 0) {
        currentZeros++;
        maxZeros = Math.max(maxZeros, currentZeros);
      } else {
        currentZeros = 0;
      }
    }

    return maxZeros;
  }

  const numberOfLostTradesInRow = maxConsecutiveZeros(closeTrades.tradesInRow.point)

  // {enteringCandleIndexes.reduce((acc, el) => {
  //   return acc + el.fee
  // }, 0)}

  summaryInfo.coin = coin
  summaryInfo.allEnteringTrades = enteringCandleIndexes.length
  summaryInfo.win = closeTrades.win
  summaryInfo.lose = closeTrades.lose
  summaryInfo.earnPoints = closeTrades.win * ratio - closeTrades.lose
  const persentWinningTrades = closeTrades.win / (closeTrades.win + closeTrades.lose) * 100
  summaryInfo.persentWinningTrades = +(closeTrades.win / (closeTrades.win + closeTrades.lose) * 100).toFixed(2)
  summaryInfo.maxLostTradesInRow = numberOfLostTradesInRow
  summaryInfo.strategyAssessment = +((persentWinningTrades * ratio / 100) - (1 - persentWinningTrades / 100)).toFixed(2)
  summaryInfo.fee = +(enteringCandleIndexes.reduce((acc, el) => acc + el.fee, 0)).toFixed(2)
  debugger
  summaryInfo.total = +((closeTrades.win * ratio - closeTrades.lose) * 10 - (enteringCandleIndexes.reduce((acc, el) => acc + el.fee, 0))).toFixed(2)
  summaryInfo.openTime = data[0].openTime
  summaryInfo.closeTime = data[data.length - 1].closeTime

  return summaryInfo
}

export type SummaryInfo = {
  coin: string
  allEnteringTrades: number
  win: number
  lose: number
  earnPoints: number
  persentWinningTrades: number
  maxLostTradesInRow: number
  strategyAssessment: number
  fee: number
  total: number
  openTime: number
  closeTime: number
}
