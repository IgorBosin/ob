import { useSelector } from 'react-redux'

import { selectIsLoading } from '@/app.selector'
import FindLiquidityStrategy from '@/features/findLiquidityStrategy/FindLiquidityStrategy'
import FindOB from '@/features/orderBlockStrategy/OrderBlocks/ui/findOB/findOB'
import Data from '@/features/orderBlockStrategy/data/Data'
import OrderBlockOnAllCoins from '@/features/orderBlockStrategy/orderBlockOnAllCoins/OrderBlockOnAllCoins'
import ShowLengthCandles from '@/features/showLengthCandles/ShowLengthCandles'
import Options from '@/options/Options'
import { ErrorSnackbar } from '@/shared/ErrorSnackbar/ErrorSnackbar'
import PlaySound from '@/shared/playSound/PlaySound'
import { LinearProgress } from '@mui/material'

export function App() {
  const isLoading = useSelector(selectIsLoading)

  return (
    <div>
      <ShowLengthCandles coin={'BTC'} />
      {isLoading && <LinearProgress />}
      <FindLiquidityStrategy />
      <OrderBlockOnAllCoins />
      <Data />
      <Options />
      <FindOB />
      <ErrorSnackbar />
      <PlaySound />
    </div>
  )
}
