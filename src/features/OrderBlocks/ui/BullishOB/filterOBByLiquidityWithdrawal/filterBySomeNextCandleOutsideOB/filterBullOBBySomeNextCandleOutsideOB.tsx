import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {
  selectBodyOrWickOutsideOB,
  selectCurrentCandleMustBeOutsideOB
} from "features/OrderBlocks/model/orderBlocks.selector";
import ResultBullishOBs
  from "features/OrderBlocks/ui/BullishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/resultBullishOBs/resultBullishOBs";


type Props = {
  oBByLiquidityWithdrawal: dataType[]
}

const FilterBullOBBySomeNextCandleOutsideOB = ({oBByLiquidityWithdrawal}: Props) => {
  const data = useSelector(selectData)
  const bodyOrWickOutsideOB = useSelector(selectBodyOrWickOutsideOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)

  const filterBullOBBySomeNextCandleOutsideOB = (orderBlockList: dataType[], numberCandleMustBeOutsideOB: number) => {
    if (!numberCandleMustBeOutsideOB) return orderBlockList
    const sortOBs = []
    for (const orderBlock of orderBlockList) {
      const indexNextCandle = data.indexOf(orderBlock) + numberCandleMustBeOutsideOB

      if (bodyOrWickOutsideOB === 'body') {
        if (data[indexNextCandle].close > orderBlock.high) {
          sortOBs.push(orderBlock)
        }
      }

      if (bodyOrWickOutsideOB === 'wick') {
        if (data[indexNextCandle].high > orderBlock.high) {
          sortOBs.push(orderBlock)
        }
      }
    }
    return sortOBs
  }

  const bullOBBySomeNextCandleOutsideOB = filterBullOBBySomeNextCandleOutsideOB(oBByLiquidityWithdrawal, currentCandleMustBeOutsideOB)

  return (
    <div>
      <ResultBullishOBs filteredBullishOB={bullOBBySomeNextCandleOutsideOB}/>
    </div>

  );
};

export default FilterBullOBBySomeNextCandleOutsideOB;
