import React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import OpenTrade from "features/openTrade/OpenTrade";

type Props = {
  candlesNumber: number
}

const FindOb = ({candlesNumber}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const findOrderBlocks = candles.filter((candle) => {
    // Проверяем, что свеча зеленая
    if (candle.close > candle.open) {
      // Проверяем, что после свечи идут пять красных свечей подряд
      const findIndexCandle = candles.indexOf(candle)
      const nextFiveCandles = candles.slice(findIndexCandle + 1, findIndexCandle + candlesNumber + 1);
      return nextFiveCandles.every((nextCandle) => nextCandle.close < nextCandle.open) && nextFiveCandles.length === candlesNumber;
    }
    // Проверяем, что свеча красная
    if (candle.close < candle.open) {
      // Проверяем, что после свечи идут пять зеленых свечей подряд
      const findIndexCandle = candles.indexOf(candle)
      const nextFiveCandles = candles.slice(findIndexCandle + 1, findIndexCandle + candlesNumber + 1);
      return nextFiveCandles.every((nextCandle) => nextCandle.close > nextCandle.open) && nextFiveCandles.length === candlesNumber;
    }
    return false;
  });

  const orderBlocksIndexes = findOrderBlocks.map((findOrderBlock) => candles.indexOf(findOrderBlock));


  const showOrderBlocks = findOrderBlocks.map((candle) => (
    <ul key={candle.openTime}>
      <li>{formattedDate(candle.openTime)} - {(candle.high)}</li>
    </ul>
  ));

  return (
    <div style={{display: "flex"}}>
      <ul>
        {showOrderBlocks}
      </ul>
      <OpenTrade orderBlocksIndexes={orderBlocksIndexes} candlesNumber={candlesNumber}/>
    </div>
  );
};

export default FindOb;
