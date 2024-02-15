import React from 'react';
import {useSelector} from "react-redux";
import {DataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {
  selectPrevNumberCandleForLiquidityWithdrawal
} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBullOBBySomeNextCandleOutsideOB
  from "utils/deleted/BullishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/filterBullOBBySomeNextCandleOutsideOB";
import {filterBullOBByLiquidityWithdrawal} from "features/OrderBlocks/action/filterOBByLiquidityWithdrawal";

type Props = {
  bullishOBs: DataType[]
}

const FilterBullOBByLiquidityWithdrawal = ({bullishOBs}: Props) => {
  const data = useSelector(selectData)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)

  const bullOBByLiquidityWithdrawal = filterBullOBByLiquidityWithdrawal(data, bullishOBs, prevNumberCandleForLiquidityWithdrawal)

  return (
    <div>
      <FilterBullOBBySomeNextCandleOutsideOB oBByLiquidityWithdrawal={bullOBByLiquidityWithdrawal}/>
    </div>
  );
};
export default FilterBullOBByLiquidityWithdrawal;
