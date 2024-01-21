import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {dataType} from "shared/api/getKlines";

const slice = createSlice({
  name: 'ob',
  initialState: {
    allOB: [] as dataType[],
    bearishOB: [] as dataType[],
    bullishOB: [] as dataType[],
    factorOB: 1,
    liquidityWithdrawal: false,
    candlesNumberForInitializeOB: 5,
    currentCandleMustBeOutsideOB: 0,
    bodyOrWickOutsideOB: 'body'
  },
  reducers: {
    getAllOB: (state, action: PayloadAction<{ allOB: dataType[] }>) => {
      state.allOB = action.payload.allOB
    },
    getBearishOB: (state, action: PayloadAction<{ bearOB: dataType[] }>) => {
      state.bearishOB = action.payload.bearOB
    },
    getBullishOB: (state, action: PayloadAction<{ bullOB: dataType[] }>) => {
      state.bullishOB = action.payload.bullOB
    },
    changeFactorOB: (state, action: PayloadAction<{ factor: number }>) => {
      state.factorOB = action.payload.factor
    },
    setLiquidityWithdrawal: (state, action: PayloadAction<{ liquidityWithdrawal: boolean }>) => {
      state.liquidityWithdrawal = action.payload.liquidityWithdrawal
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
  }
})

export const orderBlocksSlice = slice.reducer
export const {
  getBearishOB,
  getBullishOB,
  getAllOB,
  changeFactorOB,
  setLiquidityWithdrawal,
  setCandlesNumberForInitializeOB,
  changeCurrentCandleMustBeOutsideOB,
  changeBodyOrWickOutsideOB
} = slice.actions
