import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import Input from "shared/Input/Input";

type Props = {
  enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  orderBlocksIndexes: number[]
}

const ClosingTrade = ({enteringCandleIndexes, orderBlocksIndexes}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)
  const [ratio, setRatio] = useState(3) // выбор небоходимого соотношения риск\прибыль
  const [winnings, setWinnings] = useState('')
  const [losing, setLosing] = useState('')

  const isValidExit = (candleOb: dataType, candleIter: dataType) => {
    if (candleOb.open > candleOb.close) { //green
      return candleOb.high > candleIter.low;
    } else {
      return candleOb.low < candleIter.high;
    }
  }

  const closingLongTrade = (candles: dataType[], enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]) => {
    let obj = {
      win: 0,
      lose: 0
    }
    // проверяем enteringCandleIndexes пробила ли она вниз до лоя orderBlocks.
    for (const enterCandle of enteringCandleIndexes) {
      const lengthCandle = (candles[enterCandle.orderBlock].high - candles[enterCandle.orderBlock].low) * ratio

      if (candles[enterCandle.orderBlock].open > candles[enterCandle.orderBlock].close) { // ОБ зеленый(свеча красная)
        for (let i = enterCandle.entering; i < candles.length; i++) {
          if (candles[i].low < candles[enterCandle.orderBlock].low) {
            obj.lose++
            break
          }
          if (candles[i].high > lengthCandle + candles[enterCandle.orderBlock].high) {
            console.log(candles[enterCandle.orderBlock].high, candles[enterCandle.entering].high)
            obj.win++
            break
          }
        }
      }
      if (candles[enterCandle.orderBlock].open < candles[enterCandle.orderBlock].close) { /// ОБ красный(свеча зеленая)
        for (let i = enterCandle.entering; i < candles.length; i++) {
          if (candles[i].high > candles[enterCandle.orderBlock].high) {
            obj.lose++
            break
          }
          if (candles[i].low < candles[enterCandle.orderBlock].low - lengthCandle) {
            console.log(candles[enterCandle.orderBlock].high, candles[enterCandle.entering].high)
            obj.win++
            break
          }
        }
      }
    }
    return obj
  }

  const res = closingLongTrade(candles, enteringCandleIndexes)

  const earn = (res.win * ratio - res.lose) * 10

  const resInfo = res.win / (res.win + res.lose) * 100

  console.log('перерисован компонент CloseTrade')

  return (
    <div>
      <Input label={'RR'} placeholder={ratio.toString()} onChange={(e)=>setRatio(+e.currentTarget.value)}/>
      <ul>WIN -- {res.win}. С учетом соотношения - {res.win * ratio} </ul>
      <ul>LOSE -- {res.lose}  </ul>
      <ul>сколько заработал рискуя 10$ на сделку - {earn}</ul>
      <ul>какой % прибыльных сделок - {resInfo}</ul>
    </div>
  );
};

export default ClosingTrade;

export type TradeEntryAndOrderBlockIndexes = {
  entering: number,
  orderBlock: number
}
