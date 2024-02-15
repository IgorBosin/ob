import React from 'react';
import {useSelector} from "react-redux";
import {DataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {
  selectPrevNumberCandleForLiquidityWithdrawal
} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBullOBBySomeNextCandleOutsideOB
  from "utils/deleted/BullishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/filterBullOBBySomeNextCandleOutsideOB";
import {
  filterBullOBByLiquidityWithdrawal,
  filterOBByLiquidityWithdrawal
} from "features/OrderBlocks/action/filterOBByLiquidityWithdrawal";
import ResultOrderBlocksAfterAllFilter from "features/OrderBlocks/ui/findOB/filterOBByLiquidityWithdrawal/resultOrderBlocksAfterAllFilter/resultOrderBlocksAfterAllFilter";

type Props = {
  orderBlocks: DataType[]
}

const FilterBullOBByLiquidityWithdrawal = ({orderBlocks}: Props) => {
  const data = useSelector(selectData)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)

  const oBByLiquidityWithdrawal = filterOBByLiquidityWithdrawal(data, orderBlocks, prevNumberCandleForLiquidityWithdrawal)

  return (
    <div>
      <ResultOrderBlocksAfterAllFilter orderBlocks={oBByLiquidityWithdrawal}/>
    </div>
  );
};
export default FilterBullOBByLiquidityWithdrawal;
