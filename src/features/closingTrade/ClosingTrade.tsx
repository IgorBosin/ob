import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import Input from "shared/Input/Input";
import {formattedDate} from "shared/Date/formattedDate";
import {getLengthCandle, isGreenCandle, isRedCandle} from "utils/actions";
import {selectData} from "features/data/data.selector";

type Props = {
  enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  orderBlocksIndexes: number[]
}

const ClosingTrade = ({enteringCandleIndexes, orderBlocksIndexes}: Props) => {
  const data = useSelector(selectData)
  const [ratio, setRatio] = useState(2) // выбор небоходимого соотношения риск\прибыль
  const [isShowOnlyRed, setIsShowOnlyRed] = useState(true)
  const [isShowOnlyGreen, setIsShowOnlyGreen] = useState(true)

  const closingLongTrade = (candles: dataType[], enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]) => {
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
      const lengthCandle = getLengthCandle(candles[enterCandle.orderBlock]) * ratio
      const profitForBullishOB = lengthCandle + candles[enterCandle.orderBlock].low + getLengthCandle(candles[enterCandle.orderBlock])
      const profitForBearishOB = candles[enterCandle.orderBlock].high - getLengthCandle(candles[enterCandle.orderBlock]) - lengthCandle
      const a =  candles[enterCandle.orderBlock].low
      debugger
      // const profitForBearishOB = candles[enterCandle.orderBlock].low - lengthCandle

      if (isShowOnlyGreen) {
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

      if (isShowOnlyRed) {
        // медвежий ОБ (свеча зеленая)
        if (isGreenCandle(candles[enterCandle.orderBlock])) {
          for (let i = enterCandle.entering; i < candles.length; i++) {
            if (candles[i].high > candles[enterCandle.orderBlock].high) {
              obj.lose++
              obj.tradesInRow.point.push(0)
              break
            }
            if (candles[i].low < profitForBearishOB) {
              // индекс ентеринг свечи равен индексу текущей свечи и эта свеча не закрылась выше ТП, то continue
              if (i === enterCandle.entering && candles[i].close < profitForBearishOB) {
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

  const res = closingLongTrade(data, enteringCandleIndexes)

  const earn = (res.win * ratio - res.lose)

  const resInfo = res.win / (res.win + res.lose) * 100

  // const arrEarn = res.tradesInRow.date.sort((a, b) => a - b).map(el => <li>{formattedDate(el)}</li>)
  const arrEarn = res.tradesInRow.date.map(el => <li>{formattedDate(el)}</li>)


  function findMostFrequentNumber(arr: number[]) {
    let currentNumber = arr[0];
    let currentCount = 1;

    let maxNumber = arr[0];
    let maxCount = 1;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === currentNumber) {
        currentCount++;
      } else {
        if (currentCount > maxCount) {
          maxNumber = currentNumber;
          maxCount = currentCount;
        }

        currentNumber = arr[i];
        currentCount = 1;
      }
    }

    if (currentCount > maxCount) {
      maxNumber = currentNumber;
      maxCount = currentCount;
    }

    console.log(`Число ${maxNumber} повторяется чаще всего, а именно ${maxCount} раз(а).`);
    return maxCount
  }

  const expectancy = (resInfo * ratio / 100) - (1 - resInfo / 100)

  const numberOfLostTradesInRow = findMostFrequentNumber(res.tradesInRow.point)

  console.log('перерисован компонент CloseTrade')
  return (
    <div>
      <input type="checkbox" checked={isShowOnlyRed} onChange={() => setIsShowOnlyRed(!isShowOnlyRed)}/> - Red OB
      <input type="checkbox" checked={isShowOnlyGreen} onChange={() => setIsShowOnlyGreen(!isShowOnlyGreen)}/> - Green
      OB
      <div>
        <Input label={'RR'} placeholder={ratio.toString()} onChange={(e) => setRatio(+e.currentTarget.value)}/>
        <ul>всего сделок - {res.win + res.lose}</ul>
        <ul>WIN - {res.win}. С учетом соотношения: {res.win * ratio} </ul>
        <ul>LOSE - {res.lose}  </ul>
        <ul>сколько заработал единиц риска: {earn}</ul>
        <ul>какой % прибыльных сделок: {resInfo}</ul>
        <ul>максимально возможное количество проигранных сделок подряд: {numberOfLostTradesInRow}</ul>
        <ul>насколько стратегия выигрышная: {expectancy.toFixed(3)} </ul>
        <ul>ОБ где на свече входа получился ТП: {arrEarn}</ul>
      </div>
    </div>


  );
};

export default ClosingTrade;

export type TradeEntryAndOrderBlockIndexes = {
  entering: number,
  orderBlock: number
}
