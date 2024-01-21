import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {
  selectBodyOrWickOutsideOB,
  selectCurrentCandleMustBeOutsideOB
} from "features/OrderBlocks/model/orderBlocks.selector";
import ResultBearishOBs
  from "features/OrderBlocks/ui/BearishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/resultBearishOBs/resultBearishOBs";

type Props = {
  oBByLiquidityWithdrawal: dataType[]
}

const FilterBearOBBySomeNextCandleOutsideOB = ({oBByLiquidityWithdrawal}: Props) => {
  const data = useSelector(selectData)
  const bodyOrWickOutsideOB = useSelector(selectBodyOrWickOutsideOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)

  const filterBearOBBySomeNextCandleOutsideOB = (orderBlockList: dataType[], numberCandleMustBeOutsideOB: number) => {
    if (!numberCandleMustBeOutsideOB) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      const indexNextCandle = data.indexOf(orderBlock) + numberCandleMustBeOutsideOB

      if (bodyOrWickOutsideOB === 'body') {
        if (data[indexNextCandle].close < orderBlock.low) {
          sortOB.push(orderBlock)
        }
      }

      if (bodyOrWickOutsideOB === 'wick') {
        if (data[indexNextCandle].low < orderBlock.low) {
          sortOB.push(orderBlock)
        }
      }
    }
    return sortOB
  }

  const bearOBBySomeNextCandleOutsideOB = filterBearOBBySomeNextCandleOutsideOB(oBByLiquidityWithdrawal, currentCandleMustBeOutsideOB)

  return (
    <div>
      <ResultBearishOBs filteredBearishOB={bearOBBySomeNextCandleOutsideOB}/>
    </div>

  );
};

export default FilterBearOBBySomeNextCandleOutsideOB;
