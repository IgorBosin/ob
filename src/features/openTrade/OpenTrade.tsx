import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import ClosingTrade from "features/closingTrade/ClosingTrade";
import {selectData} from "features/data/data.selector";
import {formattedDate} from "shared/Date/formattedDate";
import {isGreenCandle, isRedCandle, getLengthCandle} from "utils/actions";

type Props = {
  // orderBlocks: dataType[]
  orderBlocksIndexes: number[]
  candlesNumber: number
}
const OpenTrade = ({orderBlocksIndexes, candlesNumber}: Props) => {
  const data = useSelector(selectData)

  const isValidEntry = (candleOb: dataType, candleIter: dataType) => {
    // if (isGreenCandle(candleOb)) {
    if (isRedCandle(candleOb)) {
      const a = candleOb.low + getLengthCandle(candleOb)
      return a > candleIter.low;
    } else {
      const a = candleOb.high - getLengthCandle(candleOb)
      return a < candleIter.high;
    }
  }

  const enteringTrade = (data: dataType[], orderBlocksIndexes: number[], candlesNumber: number): {
    entering: number,
    orderBlock: number
  }[] => {
    const enteringCandleIndexes = [];
    for (const ob of orderBlocksIndexes) {
      for (let i = ob + candlesNumber + 1; i < data.length; i++) {
        if (isValidEntry(data[ob], data[i])) {
          // enteringCandleIndexes.push(candles[i].high); // посмотреть хай свечи на которой зашли в сделку
          enteringCandleIndexes.push({
            entering: i,
            orderBlock: ob
          });
          break;
        }
      }
    }
    return enteringCandleIndexes;
  }

  const enteringCandleIndexes = enteringTrade(data, orderBlocksIndexes, candlesNumber).sort((a, b) => a.entering - b.entering)
  const enteringTrade_ = (candles: dataType[], orderBlocks: dataType[], candlesNumber: number) => {
    const enteringLongTrades = []

    for (const ob of orderBlocks) {
      const indexOb = candles.indexOf(ob)

      for (let i = indexOb + candlesNumber + 1; i < candles.length; i++) {
        if (candles[indexOb].open > candles[indexOb].close) {
          if (candles[indexOb].high > candles[i].low) {
            enteringLongTrades.push(i)
            break
          }
        }
        if (candles[indexOb].open < candles[indexOb].close) {
          if (candles[indexOb].low < candles[i].high) {
            enteringLongTrades.push(i)
            break
          }
        }
      }
    }
    return enteringLongTrades
  }

  console.log('перерисован компонент OpenTrade')

  return (
    <div style={{display: "flex"}}>
      <ClosingTrade enteringCandleIndexes={enteringCandleIndexes} orderBlocksIndexes={orderBlocksIndexes}/>
      <div>
        {enteringCandleIndexes.map(el =>
          <li key={el.entering}>
            {formattedDate(data[el.orderBlock].openTime)} - {formattedDate(data[el.entering].openTime)}
          </li>)}
      </div>
    </div>
  );
};

export default OpenTrade;
