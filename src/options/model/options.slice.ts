import { clearData } from '@/features/orderBlockStrategy/data/data.slice'
import { importantDates } from '@/shared/Date/generalDates'
import { TimeFrameType } from '@/shared/TimeFrame/TimeFrameType'
import { DataType } from '@/shared/api/getKlines'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  extraReducers: builder => {
    builder.addCase(clearData, state => {
      state.allOB = []
      state.bearishOB = []
      state.bullishOB = []
    })
  },
  initialState: {
    allOB: [] as DataType[],
    bearishOB: [] as DataType[],
    bodyOrWickOutsideOB: 'body',
    bullishOB: [] as DataType[],
    candlesNumberForInitializeOB: 1,
    currentCandleMustBeOutsideOB: 0,
    date: importantDates.today,
    factorOB: 1,
    fee: 0,
    isShowOnlyBearOB: true,
    isShowOnlyBullOB: true,
    prevNumberCandleForLiquidityWithdrawal: 5,
    riskReward: 2,
    symbol: 'BTC',
    timeFrame: '30m' as TimeFrameType,
  },
  name: 'ob',
  reducers: {
    changeBodyOrWickOutsideOB: (state, action: PayloadAction<{ bodyOrWickOutsideOB: string }>) => {
      state.bodyOrWickOutsideOB = action.payload.bodyOrWickOutsideOB
    },
    changeCurrentCandleMustBeOutsideOB: (
      state,
      action: PayloadAction<{ currentCandleMustBeOutsideOB: number }>
    ) => {
      state.currentCandleMustBeOutsideOB = action.payload.currentCandleMustBeOutsideOB
    },
    changeDate: (state, action: PayloadAction<{ date: number }>) => {
      state.date = action.payload.date
    },
    changeFactorOB: (state, action: PayloadAction<{ factor: number }>) => {
      state.factorOB = action.payload.factor
    },
    changePrevNumberCandleForLiquidityWithdrawal: (
      state,
      action: PayloadAction<{
        prevNumberCandleForLiquidityWithdrawal: number
      }>
    ) => {
      state.prevNumberCandleForLiquidityWithdrawal =
        action.payload.prevNumberCandleForLiquidityWithdrawal
    },
    changeRiskReward: (state, action: PayloadAction<{ riskReward: number }>) => {
      state.riskReward = action.payload.riskReward
    },
    changeSymbol: (state, action: PayloadAction<{ symbol: string }>) => {
      state.symbol = action.payload.symbol
    },
    changeTimeFrame: (state, action: PayloadAction<{ timeFrame: TimeFrameType }>) => {
      state.timeFrame = action.payload.timeFrame
    },
    getAllOB: (state, action: PayloadAction<{ allOB: DataType[] }>) => {
      state.allOB = action.payload.allOB
    },
    getBearishOB: (state, action: PayloadAction<{ bearOB: DataType[] }>) => {
      state.bearishOB = action.payload.bearOB
    },
    getBullishOB: (state, action: PayloadAction<{ bullOB: DataType[] }>) => {
      state.bullishOB = action.payload.bullOB
    },
    getFee: (state, action: PayloadAction<{ fee: number }>) => {
      state.fee = action.payload.fee
    },
    setCandlesNumberForInitializeOB: (
      state,
      action: PayloadAction<{ candlesNumberForInitializeOB: number }>
    ) => {
      state.candlesNumberForInitializeOB = action.payload.candlesNumberForInitializeOB
    },
    showOnlyBearOB: (state, action: PayloadAction<{ isShowOnlyBearOB: boolean }>) => {
      state.isShowOnlyBearOB = action.payload.isShowOnlyBearOB
    },
    showOnlyBullOB: (state, action: PayloadAction<{ isShowOnlyBullOB: boolean }>) => {
      state.isShowOnlyBullOB = action.payload.isShowOnlyBullOB
    },
  },
})

export const optionsSlice = slice.reducer
export const {
  changeBodyOrWickOutsideOB,
  changeCurrentCandleMustBeOutsideOB,
  changeDate,
  changeFactorOB,
  changePrevNumberCandleForLiquidityWithdrawal,
  changeRiskReward,
  changeSymbol,
  changeTimeFrame,
  getAllOB,
  getBearishOB,
  getBullishOB,
  getFee,
  setCandlesNumberForInitializeOB,
  showOnlyBearOB,
  showOnlyBullOB,
} = slice.actions
