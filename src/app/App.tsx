import React from 'react'
import './App.css'
import { ErrorSnackbar } from 'shared/ErrorSnackbar/ErrorSnackbar'
import { useSelector } from 'react-redux'
import OrderBlockOnAllCoins from 'features/orderBlockStrategy/orderBlockOnAllCoins/OrderBlockOnAllCoins'
import FindOB from 'features/orderBlockStrategy/OrderBlocks/ui/findOB/findOB'
import { LinearProgress } from '@mui/material'
import FindLiquidityStrategy from 'features/findLiquidityStrategy/FindLiquidityStrategy'
import { selectIsLoading } from 'app/app.selector'
import PlaySound from 'shared/playSound/playSound'
import Options from 'app/options/Options'

const App = () => {
  const isLoading = useSelector(selectIsLoading)

  return (
    <div>
      {isLoading && <LinearProgress />}
      <FindLiquidityStrategy />
      <OrderBlockOnAllCoins />
      <Options />
      <FindOB />
      <ErrorSnackbar />
      <PlaySound />
    </div>
  )
}

export default App
