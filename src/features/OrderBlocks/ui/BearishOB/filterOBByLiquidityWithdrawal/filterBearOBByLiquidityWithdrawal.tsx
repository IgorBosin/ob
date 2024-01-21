import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {selectLiquidityWithdrawal} from "features/OrderBlocks/model/orderBlocks.selector";
import FilterBearOBBySomeNextCandleOutsideOB
  from "features/OrderBlocks/ui/BearishOB/filterOBByLiquidityWithdrawal/filterBySomeNextCandleOutsideOB/filterBearOBBySomeNextCandleOutsideOB";

type Props = {
  bearishOBs: dataType[]
}

const FilterBearOBByLiquidityWithdrawal = ({bearishOBs}: Props) => {
  const data = useSelector(selectData)
  const liquidityWithdrawal = useSelector(selectLiquidityWithdrawal)

  const filterBearOBByLiquidityWithdrawal = (data: dataType[], bearishOB: dataType[]) => {
    if (!liquidityWithdrawal) return bearishOB
    const sortOB = []
    for (const orderBlock of bearishOB) {
      const obIndex = data.indexOf(orderBlock)
      if (data[obIndex].high > data[obIndex - 1].high) {
        sortOB.push(orderBlock)
      }
    }
    return sortOB
  }

  const bearOBByLiquidityWithdrawal = filterBearOBByLiquidityWithdrawal(data, bearishOBs)

  return (
    <div>
      <FilterBearOBBySomeNextCandleOutsideOB oBByLiquidityWithdrawal={bearOBByLiquidityWithdrawal}/>
    </div>
  );
};
export default FilterBearOBByLiquidityWithdrawal;
