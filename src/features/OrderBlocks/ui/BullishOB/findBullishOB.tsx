import React from 'react';
import {useSelector} from "react-redux";
import {isRedCandle} from "utils/actions";
import {selectData} from "features/data/data.selector";
import {selectCandlesNumberForInitializeOB} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBullOBByLiquidityWithdrawal
  from "features/OrderBlocks/ui/BullishOB/filterOBByLiquidityWithdrawal/filterBullOBByLiquidityWithdrawal";

type Props = {
  outsideOrderBlockCandleIndex: number
  bodyOrWickOutsideOB: string
}

const FindBullishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex}: Props) => {
  const data = useSelector(selectData)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)

  const findBullishOB = () => {
    const result = [];

    for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {

      // Проверяем, что текущая свеча зеленая
      if (isRedCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isRedCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
            // if (isRedCandle(data[i + j])) {
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
    <div>
      <FilterBullOBByLiquidityWithdrawal bullishOBs={findBullishOB()}/>
    </div>
  );
};
export default FindBullishOB;
