import React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import {isGreenCandle} from "utils/actions";
import SummaryOB from "features/findOB/summaryOB";

type Props = {
  candlesNumber: number
  outsideOrderBlockCandleIndex: number
}

const FindBearishOB = ({candlesNumber, outsideOrderBlockCandleIndex}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const findBearishOB = () => {
    const result = [];

    for (let i = 0; i < candles.length - candlesNumber; i++) {
      // Проверяем, что текущая свеча зеленая
      if (isGreenCandle(candles[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumber; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isGreenCandle(candles[i + j])) {
            isFollowedByRed = false;
            break;
          }
        }

        // Если все n следующих свечей красные, добавляем текущую свечу в результат
        if (isFollowedByRed) {
          result.push(candles[i]);
        }
      }
    }

    return result;
  };
// взять 1 ОБ. узнать его индекс. Затем проверить, чтоб свеча, которая имеет индекс ОБ+1, имела цену закрытия ниже лоу ОБ
  const sortOBBySomeNextCandleOutsideOB = (data: dataType[], orderBlockList: dataType[], outsideOrderBlockCandleIndex: number) => {
    if (!outsideOrderBlockCandleIndex) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      debugger
      const indexNextCandle = data.indexOf(orderBlock) + outsideOrderBlockCandleIndex
      if (data[indexNextCandle].close < orderBlock.low) {
        // if (data[indexNextCandle].low < orderBlock.low) {
        debugger
        sortOB.push(orderBlock)
      }
    }
    return sortOB
  }

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(candles, findBearishOB(), outsideOrderBlockCandleIndex)

  const bearishObIndexes = findBearishOB().map((findOrderBlock) => candles.indexOf(findOrderBlock));

  const showCandles = (candles: dataType[]) => candles.map((candle) => (
      <ul key={candle.openTime}>
        <li>{formattedDate(candle.openTime)} - {(candle.high)}</li>
      </ul>
    )
  )

  const showBearishObIndexes = bearishObIndexes.map((candle, i) => (
    <ul key={i}>
      <li>{candle}</li>
    </ul>
  ));

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        {showCandles(sortedOrderBlocks)}
      </div>
      <div>
        {showCandles(findBearishOB())}
      </div>
      <div>
        {showBearishObIndexes}
      </div>
      <SummaryOB/>
    </div>
  );
};

export default FindBearishOB;
