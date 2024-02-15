import React from 'react';
import {useSelector} from "react-redux";
import {isGreenCandle} from "utils/actions";
import FilterBearOBByLiquidityWithdrawal
  from "utils/deleted/BearishOB/filterOBByLiquidityWithdrawal/filterBearOBByLiquidityWithdrawal";
import {selectData} from "features/data/data.selector";
import {selectCandlesNumberForInitializeOB} from "features/OrderBlocks/model/orderBlocks.selector";
import {findBearishOB} from "features/OrderBlocks/action/findOB";

const FindBearishOB = () => {
  const data = useSelector(selectData)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)

  const bearishOB = findBearishOB(data, candlesNumberForInitializeOB)

  return (
    <div>
      <FilterBearOBByLiquidityWithdrawal bearishOBs={bearishOB}/>
    </div>
  );
};
export default FindBearishOB;
