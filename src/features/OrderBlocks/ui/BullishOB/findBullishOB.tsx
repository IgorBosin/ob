import React from 'react';
import {useSelector} from "react-redux";
import {isRedCandle} from "utils/actions";
import FilterBullishOB from "features/OrderBlocks/ui/BullishOB/filterBullishOB";
import {selectData} from "features/data/data.selector";

type Props = {
  candlesNumber: number
  outsideOrderBlockCandleIndex: number
}

const FindBullishOB = ({candlesNumber, outsideOrderBlockCandleIndex}: Props) => {
  const data = useSelector(selectData)

  const findBullishOB = () => {
    const result = [];

    for (let i = 0; i < data.length - candlesNumber; i++) {

      // Проверяем, что текущая свеча зеленая
      if (isRedCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumber; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isRedCandle(data[i + j])) {
            isFollowedByRed = false;
            break;
          }
        }

        // Если все n следующих свечей красные, добавляем текущую свечу в результат
        if (isFollowedByRed) {
          result.push(data[i]);
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
