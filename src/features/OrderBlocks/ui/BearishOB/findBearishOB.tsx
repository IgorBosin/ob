import React from 'react';
import {useSelector} from "react-redux";
import {isGreenCandle} from "utils/actions";
import FilterBearishOB from "features/OrderBlocks/ui/BearishOB/filterBearishOB";
import {selectData} from "features/data/data.selector";

type Props = {
  candlesNumber: number
  outsideOrderBlockCandleIndex: number
}

const FindBearishOB = ({candlesNumber, outsideOrderBlockCandleIndex}: Props) => {
  const data = useSelector(selectData)

  const findBearishOB = () => {
    const result = [];

    for (let i = 0; i < data.length - candlesNumber; i++) {
      // Проверяем, что текущая свеча зеленая
      if (isGreenCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumber; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isGreenCandle(data[i + j])) {
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
        {/*<ShowCandles data={findBearishOB()}/>*/}
      </div>
      <FilterBearishOB outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex} bearishOBs={findBearishOB()}/>
    </div>
  );
};

export default FindBearishOB;
