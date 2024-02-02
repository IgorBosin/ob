import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import ClosingTrade, {TradeEntryAndOrderBlockIndexes} from "features/closingTrade/ClosingTrade";
import {selectData} from "features/data/data.selector";
import {formattedDate} from "shared/Date/formattedDate";
import {getLengthCandle, isGreenCandle, isRedCandle} from "utils/actions";
import {selectCandlesNumberForInitializeOB, selectFactorOB} from "features/OrderBlocks/model/orderBlocks.selector";
import NotEnteringOrderBlocks from "features/notEnteringOrderBlocks/notEnteringOrderBlocks";

type Props = {
  orderBlocksIndexes: number[]
}
const OpenTrade = ({orderBlocksIndexes}: Props) => {
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const data = useSelector(selectData)
  const factorOB = useSelector(selectFactorOB)

  const isValidEntry = (candleOb: dataType, candleIter: dataType) => {
    if (isRedCandle(candleOb)) {
      const a = candleOb.low + getLengthCandle(candleOb, factorOB)
      return a >= candleIter.low;
    } else {
      const a = candleOb.high - getLengthCandle(candleOb, factorOB)
      return a <= candleIter.high;
    }
  }
  const enteringTrade = (data: dataType[], orderBlocksIndexes: number[], candlesNumberForInitializeOB: number): TradeEntryAndOrderBlockIndexes[] => {
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

    return enteringCandleIndexes;
  }

  const enteringCandleIndexes = enteringTrade(data, orderBlocksIndexes, candlesNumberForInitializeOB).sort((a, b) => a.orderBlock - b.orderBlock)

  const enteringTrade_ = (candles: dataType[], orderBlocks: dataType[], candlesNumber: number) => {
    const enteringLongTrades = []

    for (const ob of orderBlocks) {
      const indexOb = candles.indexOf(ob)

      for (let i = indexOb + candlesNumber + 1; i < candles.length; i++) {
        if (isGreenCandle(candles[indexOb])) {
          if (candles[indexOb].high > candles[i].low) {
            enteringLongTrades.push(i)
            break
          }
        }
        if (candles[indexOb].open < candles[indexOb].close) {
          if (isRedCandle(candles[indexOb])) {
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
      <NotEnteringOrderBlocks enteringCandleIndexes={enteringCandleIndexes} orderBlocksIndexes={orderBlocksIndexes}/>
      {enteringCandleIndexes.reduce((acc, el) => {
        return acc + el.fee
      }, 0)}
      <div>
        {enteringCandleIndexes.map(el =>
          <li key={el.entering}>
            {formattedDate(data[el.orderBlock].openTime)} - {formattedDate(data[el.entering].openTime)}
          </li>
        )}
      </div>
    </div>
  );
};

export default OpenTrade;
