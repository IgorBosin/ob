import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";

type Props = {
  enteringCandleIndexes: number[]
  orderBlocks: dataType[]
}

const ClosingTrade = ({enteringCandleIndexes, orderBlocks}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)
  const [ratio, setRatio] = useState(0) // выбор небоходимого соотношения риск\прибыль

  const [winnings, setWinnings] = useState('')
  const [losing, setLosing] = useState('')

  const linkTradeEntryAndOrderBlock = (orderBlocks: dataType[], enteringCandleIndexes: number[]) => {
    const linkTradeEntryAndOrderBlock = [];
    for (let i = 0; i < orderBlocks.length; i++) {
      linkTradeEntryAndOrderBlock.push({
        orderBlocks: orderBlocks[i],
        enteringCandles: enteringCandleIndexes[i],
      });
    }
    return linkTradeEntryAndOrderBlock
  }

  const isValidExit = (candleOb: dataType, candleIter: dataType) => {
    if (candleOb.open > candleOb.close) { //green
      return candleOb.high > candleIter.low;
    } else {
      return candleOb.low < candleIter.high;
    }
  }

  const closingLongTrade = (candles: dataType[], orderBlocks: dataType[], candlesNumber: number) => {
    // проверяем enteringCandleIndexes пробила ли она вниз до лоя orderBlocks.
    for (const enterCandle of enteringCandleIndexes) {
      for (let i = enterCandle; i < candles.length; i++) {
        // if (candles[i].low <)
      }
    }
  }

  return (
    <div>

    </div>
  );
};

export default ClosingTrade;
