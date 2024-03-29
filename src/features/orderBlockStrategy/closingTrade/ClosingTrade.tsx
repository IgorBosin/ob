import { useSelector } from 'react-redux'

import { showMaxZeroInRow } from '@/features/orderBlockStrategy/closingTrade/actions'
import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import {
  selectFactorOB,
  selectFee,
  selectIsShowOnlyBearOB,
  selectIsShowOnlyBullOB,
  selectRiskReward,
} from '@/options/model/options.selector'
import { formattedDate } from '@/shared/Date/formattedDate'
import { DataType } from '@/shared/api/getKlines'
import { isGreenCandle } from '@/shared/getColorCandle/isGreenCandle'
import { isRedCandle } from '@/shared/getColorCandle/isRedCandle'
import { getLengthCandle } from '@/shared/getLenghtCandle/getLengthCandle'

type Props = {
  enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  orderBlocksIndexes: number[]
}

const ClosingTrade = ({ enteringCandleIndexes }: Props) => {
  const data = useSelector(selectData)
  const fee = useSelector(selectFee)
  const riskReward = useSelector(selectRiskReward)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)
  const factorOB = useSelector(selectFactorOB)

  const closingTrade = (
    candles: DataType[],
    enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  ) => {
    const obj = {
      lose: 0,
      tradesInRow: {
        date: [] as number[],
        point: [] as number[],
      },
      win: 0,
    }

    // проверяем enteringCandleIndexes пробила ли она вниз до лоя orderBlocks.
    for (const enterCandle of enteringCandleIndexes) {
      const lengthCandle = getLengthCandle(candles[enterCandle.orderBlock], factorOB) * riskReward
      const profitForBullishOB =
        lengthCandle +
        candles[enterCandle.orderBlock].low +
        getLengthCandle(candles[enterCandle.orderBlock], factorOB)
      const profitForBearishOB =
        candles[enterCandle.orderBlock].high -
        getLengthCandle(candles[enterCandle.orderBlock], factorOB) -
        lengthCandle

      if (isShowOnlyBullOB) {
        // бычий ОБ (свеча красная)
        if (isRedCandle(candles[enterCandle.orderBlock])) {
          for (let i = enterCandle.entering; i < candles.length; i++) {
            if (candles[i].low < candles[enterCandle.orderBlock].low) {
              obj.lose++
              obj.tradesInRow.point.push(0)
              break
            }
            if (candles[i].high > profitForBullishOB) {
              // индекс ентеринг свечи равен индексу текущей свечи и эта свеча не закрылась выше ТП, то continue
              if (i === enterCandle.entering && candles[i].close < profitForBullishOB) {
                continue
              }
              obj.tradesInRow.point.push(1)
              obj.win++
              obj.tradesInRow.date.push(candles[enterCandle.orderBlock].openTime)
              break
            }
          }
        }
      }

      if (isShowOnlyBearOB) {
        // медвежий ОБ (свеча зеленая)
        if (isGreenCandle(candles[enterCandle.orderBlock])) {
          for (let i = enterCandle.entering; i < candles.length; i++) {
            if (candles[i].high > candles[enterCandle.orderBlock].high) {
              obj.lose++
              obj.tradesInRow.point.push(0)
              break
            }
            if (candles[i].low < profitForBearishOB) {
              // индекс ентеринг свечи равен индексу текущей свечи и эта свеча не закрылась ниже ТП, то continue
              if (i === enterCandle.entering && candles[i].close > profitForBearishOB) {
                continue
              }
              obj.tradesInRow.point.push(1)
              obj.win++
              obj.tradesInRow.date.push(candles[enterCandle.orderBlock].openTime)
              break
            }
          }
        }
      }
    }

    return obj
  }

  const res = closingTrade(data, enteringCandleIndexes)

  const earn = res.win * riskReward - res.lose

  const resInfo = (res.win / (res.win + res.lose)) * 100

  const arrEarn = res.tradesInRow.date.map(el => <li key={el}>{formattedDate(el)}</li>)

  const expectancy = (resInfo * riskReward) / 100 - (1 - resInfo / 100)

  const maxZeroInRow = showMaxZeroInRow(res.tradesInRow.point)

  // console.log('перерисован компонент CloseTrade')

  return (
    <div>
      <div>
        <ul>всего сделок: {res.win + res.lose}</ul>
        <ul>
          win: {res.win}. С учетом соотношения: {res.win * riskReward}{' '}
        </ul>
        <ul>lose: {res.lose} </ul>
        <ul>сколько заработал единиц риска: {earn}</ul>
        <ul>какой % прибыльных сделок: {resInfo}</ul>
        <ul>максимально возможное количество проигранных сделок подряд: {maxZeroInRow}</ul>
        <ul>насколько стратегия выигрышная: {expectancy.toFixed(3)} </ul>
        <ul>комиссия: {fee.toFixed(2)}</ul>
        <ul>итог(при 10$ риска): {earn * 10 - +fee.toFixed(2)}</ul>
        <ul>ОБ где на свече входа получился ТП: {arrEarn}</ul>
      </div>
    </div>
  )
}

export default ClosingTrade

export type TradeEntryAndOrderBlockIndexes = {
  entering: number
  fee: number
  orderBlock: number
}
