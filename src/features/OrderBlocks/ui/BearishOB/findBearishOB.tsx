import React from 'react';
import {useSelector} from "react-redux";
import {isGreenCandle} from "utils/actions";
import FilterBearOBByLiquidityWithdrawal
  from "features/OrderBlocks/ui/BearishOB/filterOBByLiquidityWithdrawal/filterBearOBByLiquidityWithdrawal";
import {selectData} from "features/data/data.selector";
import {selectCandlesNumberForInitializeOB} from "features/OrderBlocks/model/orderBlocks.selector";

const FindBearishOB = () => {
  const data = useSelector(selectData)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)

  const findBearishOB = () => {
    const result = [];

    for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {

      // Проверяем, что текущая свеча зеленая
      if (isGreenCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isGreenCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
            // if (isGreenCandle(data[i + j])) {
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
      <FilterBearOBByLiquidityWithdrawal bearishOBs={findBearishOB()}/>
    </div>
  );
};
export default FindBearishOB;
