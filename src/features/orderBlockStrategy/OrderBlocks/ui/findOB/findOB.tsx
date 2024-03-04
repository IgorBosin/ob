import { useSelector } from 'react-redux'

import { findOB } from '@/features/orderBlockStrategy/OrderBlocks/action/findOB'
import FilterOBByLiquidityWithdrawal from '@/features/orderBlockStrategy/OrderBlocks/ui/findOB/filterOBByLiquidityWithdrawal/filterOBByLiquidityWithdrawal'
import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import { selectCandlesNumberForInitializeOB } from '@/options/model/options.selector'

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
