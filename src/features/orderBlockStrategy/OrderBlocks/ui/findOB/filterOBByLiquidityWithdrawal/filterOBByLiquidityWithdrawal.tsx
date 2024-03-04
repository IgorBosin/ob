import { useSelector } from 'react-redux'

import { filterOBByLiquidityWithdrawal } from '@/features/orderBlockStrategy/OrderBlocks/action/filterOBByLiquidityWithdrawal'
import ResultOrderBlocksAfterAllFilter from '@/features/orderBlockStrategy/OrderBlocks/ui/findOB/filterOBByLiquidityWithdrawal/resultOrderBlocksAfterAllFilter/resultOrderBlocksAfterAllFilter'
import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import { selectPrevNumberCandleForLiquidityWithdrawal } from '@/options/model/options.selector'
import { DataType } from '@/shared/api/getKlines'

type Props = {
  orderBlocks: DataType[]
}

const FilterBullOBByLiquidityWithdrawal = ({ orderBlocks }: Props) => {
  const data = useSelector(selectData)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(
    selectPrevNumberCandleForLiquidityWithdrawal
  )

  const oBByLiquidityWithdrawal = filterOBByLiquidityWithdrawal(
    data,
    orderBlocks,
    prevNumberCandleForLiquidityWithdrawal
  )

  return (
    <div>
      <ResultOrderBlocksAfterAllFilter orderBlocks={oBByLiquidityWithdrawal} />
    </div>
  )
}

export default FilterBullOBByLiquidityWithdrawal
