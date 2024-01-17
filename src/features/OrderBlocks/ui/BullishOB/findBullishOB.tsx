import React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {isRedCandle} from "utils/actions";
import FilterBullishOB from "features/OrderBlocks/ui/BullishOB/filterBullishOB";
import ShowCandles from "shared/ShowCandles/ShowCandles";

type Props = {
  candlesNumber: number
  outsideOrderBlockCandleIndex: number
}

const FindBullishOB = ({candlesNumber, outsideOrderBlockCandleIndex}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const findBullishOB = () => {
    const result = [];

    for (let i = 0; i < candles.length - candlesNumber; i++) {

      // Проверяем, что текущая свеча зеленая
      if (isRedCandle(candles[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumber; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isRedCandle(candles[i + j])) {
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


  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        {/*<ShowCandles data={findBullishOB()}/>*/}
      </div>
      <FilterBullishOB outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex} bearishOBs={findBullishOB()}/>
    </div>
  );
};

export default FindBullishOB;
