import React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {isGreenCandle} from "utils/actions";
import ShowCandles from "shared/ShowCandles/ShowCandles";
import FilterBearishOB from "features/OrderBlocks/ui/BearishOB/filterBearishOB";

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

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        {/*<ShowCandles data={findBearishOB()}/>*/}
      </div>
      <FilterBearishOB outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex} bearishOBs={findBearishOB()}/>
    </div>
  );
};

export default FindBearishOB;
