import React from 'react'
import { useSelector } from 'react-redux'
import { selectData } from 'features/orderBlockStrategy/data/data.selector'
import { selectCandlesNumberForInitializeOB } from 'app/options/model/options.selector'
import { findOB } from 'features/orderBlockStrategy/OrderBlocks/action/findOB'
import FilterOBByLiquidityWithdrawal from 'features/orderBlockStrategy/OrderBlocks/ui/findOB/filterOBByLiquidityWithdrawal/filterOBByLiquidityWithdrawal'

const FindOB = () => {
  const data = useSelector(selectData)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)

  const oB = findOB(data, candlesNumberForInitializeOB)

  return (
    <div>
      <FilterOBByLiquidityWithdrawal orderBlocks={oB} />
    </div>
  )
}
export default FindOB
