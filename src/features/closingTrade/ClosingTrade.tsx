import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {DataType} from "shared/api/getKlines";
import Input from "shared/Input/Input";
import {formattedDate} from "shared/Date/formattedDate";
import {getLengthCandle, isGreenCandle, isRedCandle} from "utils/actions";
import {selectData} from "features/data/data.selector";
import {selectFactorOB, selectFee} from "features/OrderBlocks/model/orderBlocks.selector";
import {Checkbox, FormControlLabel} from "@mui/material";
import {showMaxZeroInRow} from "features/closingTrade/actions";

type Props = {
  enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  orderBlocksIndexes: number[]
}

const ClosingTrade = ({enteringCandleIndexes, orderBlocksIndexes}: Props) => {
  const data = useSelector(selectData)
  const fee = useSelector(selectFee)
  const [ratio, setRatio] = useState(2) // выбор небоходимого соотношения риск\прибыль
  const [isShowOnlyBearOB, setIsShowOnlyBearOB] = useState(true)
  const [isShowOnlyBullOB, setIsShowOnlyBullOB] = useState(true)
  const factorOB = useSelector(selectFactorOB)
  const dispatch = useDispatch()


  const closingTrade = (candles: DataType[], enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]) => {
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
      // const lengthCandle = (candles[enterCandle.orderBlock].high - candles[enterCandle.orderBlock].low) * ratio
      const lengthCandle = getLengthCandle(candles[enterCandle.orderBlock], factorOB) * ratio
      const profitForBullishOB = lengthCandle + candles[enterCandle.orderBlock].low + getLengthCandle(candles[enterCandle.orderBlock], factorOB)
      const profitForBearishOB = candles[enterCandle.orderBlock].high - getLengthCandle(candles[enterCandle.orderBlock], factorOB) - lengthCandle

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

  const earn = (res.win * ratio - res.lose)

  const resInfo = res.win / (res.win + res.lose) * 100

  const arrEarn = res.tradesInRow.date.map(el => <li>{formattedDate(el)}</li>)

  const expectancy = (resInfo * ratio / 100) - (1 - resInfo / 100)

  const maxZeroInRow = showMaxZeroInRow(res.tradesInRow.point)

  console.log('перерисован компонент CloseTrade')
  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={isShowOnlyBearOB} onChange={() => setIsShowOnlyBearOB(!isShowOnlyBearOB)}/>}
        label="Red OB"
        labelPlacement="bottom"
      />
      <FormControlLabel
        control={<Checkbox checked={isShowOnlyBullOB} onChange={() => setIsShowOnlyBullOB(!isShowOnlyBullOB)}/>}
        label="Green OB"
        labelPlacement="bottom"
      />
      <div>
        <Input label={'RR'} placeholder={ratio.toString()} onChange={(e) => setRatio(+e.currentTarget.value)}/>
        <ul>всего сделок: {res.win + res.lose}</ul>
        <ul>win: {res.win}. С учетом соотношения: {res.win * ratio} </ul>
        <ul>lose: {res.lose}  </ul>
        <ul>сколько заработал единиц риска: {earn}</ul>
        <ul>какой % прибыльных сделок: {resInfo}</ul>
        <ul>максимально возможное количество проигранных сделок подряд: {maxZeroInRow}</ul>
        <ul>насколько стратегия выигрышная: {expectancy.toFixed(3)} </ul>
        <ul>комиссия: {fee.toFixed(2)}</ul>
        <ul>итог(при 10$ риска): {earn * 10 - +fee.toFixed(2)}</ul>
        <ul>ОБ где на свече входа получился ТП: {arrEarn}</ul>
      </div>
    </div>


  );
};

export default ClosingTrade;

export type TradeEntryAndOrderBlockIndexes = {
  entering: number
  orderBlock: number
  fee: number
}
