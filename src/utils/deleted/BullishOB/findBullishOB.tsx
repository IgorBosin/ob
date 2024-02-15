import React from 'react';
import {useSelector} from "react-redux";
import {isRedCandle} from "utils/actions";
import {selectData} from "features/data/data.selector";
import {selectCandlesNumberForInitializeOB} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBullOBByLiquidityWithdrawal
  from "utils/deleted/BullishOB/filterOBByLiquidityWithdrawal/filterBullOBByLiquidityWithdrawal";
import {findBullishOB} from "features/OrderBlocks/action/findOB";

type Props = {
  outsideOrderBlockCandleIndex: number
  bodyOrWickOutsideOB: string
}

const FindBullishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex}: Props) => {
  const data = useSelector(selectData)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)

  const bullishOb = findBullishOB(data, candlesNumberForInitializeOB)


  return (
    <div>
      <FilterBullOBByLiquidityWithdrawal bullishOBs={bullishOb}/>
    </div>
  );
};
export default FindBullishOB;
