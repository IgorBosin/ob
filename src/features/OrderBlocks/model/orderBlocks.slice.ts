import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DataType} from "shared/api/getKlines";
import {clearData} from "features/data/data.slice";

const slice = createSlice({
  name: 'ob',
  initialState: {
    allOB: [] as DataType[],
    bearishOB: [] as DataType[],
    bullishOB: [] as DataType[],
    factorOB: 1,
    candlesNumberForInitializeOB: 5,
    currentCandleMustBeOutsideOB: 0,
    bodyOrWickOutsideOB: 'body',
    fee: 0,
    prevNumberCandleForLiquidityWithdrawal: 5
  },
  reducers: {
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
    changePrevNumberCandleForLiquidityWithdrawal: (state, action: PayloadAction<{
      prevNumberCandleForLiquidityWithdrawal: number
    }>) => {
      state.prevNumberCandleForLiquidityWithdrawal = action.payload.prevNumberCandleForLiquidityWithdrawal
    }
  }, extraReducers: (builder) => {
    builder
      .addCase(clearData, (state, action) => {
        state.allOB = []
        state.bearishOB = []
        state.bullishOB = []
      })
  }
})

export const orderBlocksSlice = slice.reducer
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
} = slice.actions
