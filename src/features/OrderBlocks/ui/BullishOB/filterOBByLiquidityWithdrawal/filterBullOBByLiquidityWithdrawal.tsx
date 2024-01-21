import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {selectLiquidityWithdrawal} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBullOBBySomeNextCandleOutsideOB
  from "features/OrderBlocks/ui/BullishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/filterBullOBBySomeNextCandleOutsideOB";

type Props = {
  bullishOBs: dataType[]
}

const FilterBullOBByLiquidityWithdrawal = ({bullishOBs}: Props) => {
  const data = useSelector(selectData)
  const liquidityWithdrawal = useSelector(selectLiquidityWithdrawal)

  const filterBullOBByLiquidityWithdrawal = (data: dataType[], orderBlockList: dataType[]) => {
    if (!liquidityWithdrawal) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      const obIndex = data.indexOf(orderBlock)
      if (data[obIndex].low < data[obIndex - 1].low) {
        sortOB.push(orderBlock)
      }
    }
    return sortOB
  }

  const bullOBByLiquidityWithdrawal = filterBullOBByLiquidityWithdrawal(data, bullishOBs)

  return (
    <div>
      <FilterBullOBBySomeNextCandleOutsideOB oBByLiquidityWithdrawal={bullOBByLiquidityWithdrawal}/>
    </div>
  );
};
export default FilterBullOBByLiquidityWithdrawal;
