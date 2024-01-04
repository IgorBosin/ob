import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import ClosingTrade from "features/closingTrade/ClosingTrade";

type Props = {
  // orderBlocks: dataType[]
  orderBlocks: dataType[]
  candlesNumber: number
}

const ordBl = [21, 40, 182, 228, 244, 268]

const OpenTrade = ({orderBlocks, candlesNumber}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const isValidEntry = (candleOb: dataType, candleIter: dataType) => {
    if (candleOb.open > candleOb.close) {
      return candleOb.high > candleIter.low;
    } else {
      return candleOb.low < candleIter.high;
    }
  }

  const enteringTrade = (candles: dataType[], orderBlocks: dataType[], candlesNumber: number) => {
    const enteringCandleIndexes = [];
    for (const ob of orderBlocks) {
      const indexOb = candles.indexOf(ob);
      for (let i = indexOb + candlesNumber + 1; i < candles.length; i++) {
        if (isValidEntry(candles[indexOb], candles[i])) {
          // enteringCandleIndexes.push(candles[i].high); // посмотреть хай свечи на которой зашли в сделку
          enteringCandleIndexes.push(i);
          break;
        }
      }
    }
    return enteringCandleIndexes;
  }

  const enteringCandleIndexes = enteringTrade(candles, orderBlocks, candlesNumber)

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
      <div>
        {ordBl.map(el => <li>{el}</li>)}
      </div>
      <div>
        {enteringCandleIndexes.map(el => <li>{el}</li>)}
      </div>
      <ClosingTrade enteringCandleIndexes={enteringCandleIndexes} orderBlocks={orderBlocks}/>
    </div>
  );
};

export default OpenTrade;
