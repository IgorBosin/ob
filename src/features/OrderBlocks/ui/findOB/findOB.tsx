import React from 'react';
import {useSelector} from "react-redux";
import {isRedCandle} from "utils/actions";
import {selectData} from "features/data/data.selector";
import {selectCandlesNumberForInitializeOB} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBullOBByLiquidityWithdrawal
  from "utils/deleted/BullishOB/filterOBByLiquidityWithdrawal/filterBullOBByLiquidityWithdrawal";
import {findBullishOB, findOB} from "features/OrderBlocks/action/findOB";
import FilterOBByLiquidityWithdrawal from "features/OrderBlocks/ui/findOB/filterOBByLiquidityWithdrawal/filterOBByLiquidityWithdrawal";

type Props = {

}

const FindOB = () => {
  const data = useSelector(selectData)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)

  const oB = findOB(data, candlesNumberForInitializeOB)

  return (
    <div>
      <FilterOBByLiquidityWithdrawal orderBlocks={oB}/>
    </div>
  );
};
export default FindOB;
