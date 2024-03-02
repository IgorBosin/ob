import React, { useState } from 'react'
import { coins } from 'shared/coins/coins'
import { getOrderBlocksOnCoin, SummaryInfo } from 'features/orderBlockStrategy/orderBlockOnAllCoins/getOrderBlocksOnCoin'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCandlesNumberForInitializeOB,
  selectDate,
  selectFactorOB,
  selectIsShowOnlyBearOB,
  selectIsShowOnlyBullOB,
  selectPrevNumberCandleForLiquidityWithdrawal,
  selectRiskReward,
  selectTimeFrame,
} from 'app/options/model/options.selector'
import DynamicTable, { Column } from 'shared/DynamicTable/DynamicTable'
import { exportToExcel } from 'shared/exportToExcel/exportToExcel'
import { selectIsLoading } from 'app/app.selector'
import { handleCatch } from 'shared/handleCatch/handleCatch'
import { setLoading } from 'app/app.slice'
import { AxiosError } from 'axios'

const OrderBlockOnAllCoins = () => {
  const date = useSelector(selectDate)
  const [tableData, setTableData] = useState<SummaryInfo[]>([])
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)
  const factorOB = useSelector(selectFactorOB)
  const timeFrame = useSelector(selectTimeFrame)
  const isLoading = useSelector(selectIsLoading)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)
  const riskReward = useSelector(selectRiskReward)
  const dispatch = useDispatch()

  const iterParallel = async () => {
    const coinPromises = coins.map((coin) =>
      getOrderBlocksOnCoin(
        coin,
        timeFrame,
        date,
        prevNumberCandleForLiquidityWithdrawal,
        factorOB,
        candlesNumberForInitializeOB,
        isShowOnlyBullOB,
        isShowOnlyBearOB,
        riskReward,
      ),
    )
    return await Promise.all(coinPromises)
  }
  const iterSequential = async () => {
    const data = []
    for (const coin of coins) {
      const info = await getOrderBlocksOnCoin(
        coin,
        timeFrame,
        date,
        prevNumberCandleForLiquidityWithdrawal,
        factorOB,
        candlesNumberForInitializeOB,
        isShowOnlyBullOB,
        isShowOnlyBearOB,
        riskReward,
      )
      data.push(info)
    }
    return data
  }

  const iterCoin = async () => {
    dispatch(setLoading({ isLoading: true }))
    try {
      const data = await iterParallel() // паралельный запрос. можно заменить на последовательный
      setTableData(data)
      dispatch(setLoading({ isLoading: false }))
    } catch (e) {
      handleCatch(e as AxiosError, dispatch)
    }
  }

  const columns: Column<SummaryInfo>[] = [
    { label: 'Монета', prop: 'coin' },
    { label: 'Всего сделок', prop: 'allEnteringTrades' },
    { label: 'Выиграл', prop: 'win' },
    { label: 'Проиграл', prop: 'lose' },
    { label: 'Заработал очков', prop: 'earnPoints' },
    { label: 'Процент выигрышных сделок', prop: 'percentWinningTrades' },
    { label: 'Макс кол-во сделок проиграл подряд', prop: 'maxLostTradesInRow' },
    { label: 'Оценка монеты', prop: 'strategyAssessment' },
    { label: 'Комиссия', prop: 'fee' },
    { label: 'Итого', prop: 'total' },
    { label: 'Ближайш бычий ОБ', prop: 'nearestBullOB' },
    { label: 'Ближайш медвеж ОБ', prop: 'nearestBearOB' },
    { label: 'Начало графика', prop: 'openTime', date: true },
    { label: 'Конец графика', prop: 'closeTime', date: true },
  ]

  const calculateTotalEnteringTrades = () => {
    return tableData.reduce((total, info) => total + info.earnPoints, 0)
  }

  return (
    <div style={{ margin: 'auto', maxWidth: '1500px', marginBottom: '10px' }}>
      <p>Total Earn points: {calculateTotalEnteringTrades()}</p>
      <button disabled={isLoading} onClick={iterCoin}>
        Show Info
      </button>
      <button disabled={!tableData.length} onClick={() => exportToExcel(tableData)}>
        Export to Excel
      </button>
      <DynamicTable data={tableData} columns={columns} setData={setTableData} />
    </div>
  )
}

export default OrderBlockOnAllCoins
