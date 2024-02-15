import React from 'react';
import {useSelector} from "react-redux";
import {DataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {selectPrevNumberCandleForLiquidityWithdrawal} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBearOBBySomeNextCandleOutsideOB
  from "utils/deleted/BearishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/filterBearOBBySomeNextCandleOutsideOB";
import {filterBearOBByLiquidityWithdrawal} from "features/OrderBlocks/action/filterOBByLiquidityWithdrawal";

type Props = {
  bearishOBs: DataType[]
}

const FilterBearOBByLiquidityWithdrawal = ({bearishOBs}: Props) => {
  const data = useSelector(selectData)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)

  const bearOBByLiquidityWithdrawal = filterBearOBByLiquidityWithdrawal(data, bearishOBs, prevNumberCandleForLiquidityWithdrawal)

  return (
    <div>
      <FilterBearOBBySomeNextCandleOutsideOB oBByLiquidityWithdrawal={bearOBByLiquidityWithdrawal}/>
    </div>
  );
};
export default FilterBearOBByLiquidityWithdrawal;
