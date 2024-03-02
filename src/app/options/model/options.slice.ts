import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DataType } from 'shared/api/getKlines'
import { clearData } from 'features/orderBlockStrategy/data/data.slice'
import { TimeFrameType } from 'shared/TimeFrame/TimeFrameType'
import { importantDates } from 'shared/Date/generalDates'

const slice = createSlice({
  name: 'ob',
  initialState: {
    symbol: 'BTC',
    allOB: [] as DataType[],
    bearishOB: [] as DataType[],
    bullishOB: [] as DataType[],
    factorOB: 1,
    candlesNumberForInitializeOB: 1,
    currentCandleMustBeOutsideOB: 0,
    bodyOrWickOutsideOB: 'body',
    fee: 0,
    prevNumberCandleForLiquidityWithdrawal: 5,
    isShowOnlyBearOB: true,
    isShowOnlyBullOB: true,
    riskReward: 2,
    timeFrame: '30m' as TimeFrameType,
    date: importantDates.today,
  },
  reducers: {
    changeSymbol: (state, action: PayloadAction<{ symbol: string }>) => {
      state.symbol = action.payload.symbol
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
    changeFactorOB: (state, action: PayloadAction<{ factor: number }>) => {
      state.factorOB = action.payload.factor
    },
    setCandlesNumberForInitializeOB: (state, action: PayloadAction<{ candlesNumberForInitializeOB: number }>) => {
      state.candlesNumberForInitializeOB = action.payload.candlesNumberForInitializeOB
    },
    changeBodyOrWickOutsideOB: (state, action: PayloadAction<{ bodyOrWickOutsideOB: string }>) => {
      state.bodyOrWickOutsideOB = action.payload.bodyOrWickOutsideOB
    },
    changeCurrentCandleMustBeOutsideOB: (state, action: PayloadAction<{ currentCandleMustBeOutsideOB: number }>) => {
      state.currentCandleMustBeOutsideOB = action.payload.currentCandleMustBeOutsideOB
    },
    getFee: (state, action: PayloadAction<{ fee: number }>) => {
      state.fee = action.payload.fee
    },
    changePrevNumberCandleForLiquidityWithdrawal: (
      state,
      action: PayloadAction<{
        prevNumberCandleForLiquidityWithdrawal: number
      }>,
    ) => {
      state.prevNumberCandleForLiquidityWithdrawal = action.payload.prevNumberCandleForLiquidityWithdrawal
    },
    showOnlyBearOB: (state, action: PayloadAction<{ isShowOnlyBearOB: boolean }>) => {
      state.isShowOnlyBearOB = action.payload.isShowOnlyBearOB
    },
    showOnlyBullOB: (state, action: PayloadAction<{ isShowOnlyBullOB: boolean }>) => {
      state.isShowOnlyBullOB = action.payload.isShowOnlyBullOB
    },
    changeRiskReward: (state, action: PayloadAction<{ riskReward: number }>) => {
      state.riskReward = action.payload.riskReward
    },
    changeTimeFrame: (state, action: PayloadAction<{ timeFrame: TimeFrameType }>) => {
      state.timeFrame = action.payload.timeFrame
    },
    changeDate: (state, action: PayloadAction<{ date: number }>) => {
      state.date = action.payload.date
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearData, (state, action) => {
      state.allOB = []
      state.bearishOB = []
      state.bullishOB = []
    })
  },
})

export const optionsSlice = slice.reducer
export const {
  getBearishOB,
  getBullishOB,
  getAllOB,
  changeFactorOB,
  setCandlesNumberForInitializeOB,
  changeCurrentCandleMustBeOutsideOB,
  changeBodyOrWickOutsideOB,
  getFee,
  changePrevNumberCandleForLiquidityWithdrawal,
  showOnlyBullOB,
  showOnlyBearOB,
  changeRiskReward,
  changeTimeFrame,
  changeDate,
  changeSymbol,
} = slice.actions