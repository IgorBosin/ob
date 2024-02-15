import {AppRootStateType} from "app/store";
import {DataType} from "shared/api/getKlines";


export const selectBullishOB = (state: AppRootStateType): DataType[] => state.orderBlocks.bullishOB
export const selectBearishOB = (state: AppRootStateType): DataType[] => state.orderBlocks.bearishOB
export const selectAllOB = (state: AppRootStateType): DataType[] => state.orderBlocks.allOB
export const selectFactorOB = (state: AppRootStateType): number => state.orderBlocks.factorOB
export const selectCandlesNumberForInitializeOB = (state: AppRootStateType): number => state.orderBlocks.candlesNumberForInitializeOB
export const selectBodyOrWickOutsideOB = (state: AppRootStateType): string => state.orderBlocks.bodyOrWickOutsideOB
export const selectCurrentCandleMustBeOutsideOB = (state: AppRootStateType): number => state.orderBlocks.currentCandleMustBeOutsideOB
export const selectFee = (state: AppRootStateType): number => state.orderBlocks.fee
export const selectPrevNumberCandleForLiquidityWithdrawal = (state: AppRootStateType): number => state.orderBlocks.prevNumberCandleForLiquidityWithdrawal

