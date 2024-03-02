import React, { useEffect, useState } from 'react'
import { coins } from 'shared/coins/coins'
import { playSound, setLoading } from 'app/app.slice'
import { useDispatch, useSelector } from 'react-redux'
import { AxiosError } from 'axios'
import { ShowDistanceToLiquidity, showDistanceToLiquidity } from 'features/findLiquidityStrategy/actions/showDistanceToLiquidity'
import DynamicTable, { Column } from 'shared/DynamicTable/DynamicTable'
import { exportToExcel } from 'shared/exportToExcel/exportToExcel'
import { selectIsLoading } from 'app/app.selector'
import { handleCatch } from 'shared/handleCatch/handleCatch'

const FindLiquidityStrategy = () => {
  const [tableData, setTableData] = useState<ShowDistanceToLiquidity[]>([])
  const currentDateInMillis = new Date().getTime()
  const millisecondsInDay = 24 * 60 * 60 * 1000
  const millisecondsInFiveDays = 6 * millisecondsInDay
  const isLoading = useSelector(selectIsLoading)
  const dispatch = useDispatch()

  useEffect(() => {
    // обновляем каждые 2 минуты
    const intervalId = setInterval(iterCoin, 2 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const iterParallel = async () => {
    const coinPromises = coins.map((coin) => showDistanceToLiquidity(coin, currentDateInMillis - millisecondsInFiveDays))
    return await Promise.all(coinPromises)
  }

  const iterSequential = async () => {
    const data = []
    for (const coin of coins) {
      const info = await showDistanceToLiquidity(coin, currentDateInMillis - millisecondsInFiveDays)
      data.push(info)
    }
    return data
  }

  const iterCoin = async () => {
    dispatch(setLoading({ isLoading: true }))
    try {
      const data = await iterParallel() // паралельный запрос. можно заменить на последовательный
      setTableData(data)
      if (data.some((item) => item.percentCurrentPriceBeforeSellside < 0.2)) {
        dispatch(playSound({ playSound: true }))
      }
      dispatch(setLoading({ isLoading: false }))
    } catch (e) {
      handleCatch(e as AxiosError, dispatch)
    }
  }

  const columns: Column<ShowDistanceToLiquidity>[] = [
    { label: 'Coin', prop: 'coin' },
    { label: 'Buyside Liquidity', prop: 'percentBeforeBuyside' },
    { label: 'Sellside Liquidity', prop: 'percentBeforeSellside' },
    { label: 'Nearest Buyside Liquidity', prop: 'percentCurrentPriceBeforeBuyside' },
    { label: 'Nearest Sellside Liquidity', prop: 'percentCurrentPriceBeforeSellside' },
  ]

  return (
    <div style={{ margin: 'auto', maxWidth: '1500px', marginBottom: '10px' }}>
      <button disabled={isLoading} onClick={iterCoin}>
        Show nearest liquidity
      </button>
      <button disabled={!tableData.length || isLoading} onClick={() => exportToExcel(tableData)}>
        Export to Excel
      </button>
      <DynamicTable data={tableData} columns={columns} setData={setTableData} />
    </div>
  )
}

export default FindLiquidityStrategy
