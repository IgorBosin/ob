import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";


export const selectBullishOB = (state: AppRootStateType): dataType[] => state.orderBlocks.bullishOB
export const selectBearishOB = (state: AppRootStateType): dataType[] => state.orderBlocks.bearishOB
export const selectAllOB = (state: AppRootStateType): dataType[] => state.orderBlocks.allOB
export const selectFactorOB = (state: AppRootStateType): number => state.orderBlocks.factorOB
export const selectLiquidityWithdrawal = (state: AppRootStateType): boolean => state.orderBlocks.liquidityWithdrawal
export const selectCandlesNumberForInitializeOB = (state: AppRootStateType): number => state.orderBlocks.candlesNumberForInitializeOB
export const selectBodyOrWickOutsideOB = (state: AppRootStateType): string => state.orderBlocks.bodyOrWickOutsideOB
export const selectCurrentCandleMustBeOutsideOB = (state: AppRootStateType): number => state.orderBlocks.currentCandleMustBeOutsideOB
export const selectFee = (state: AppRootStateType): number => state.orderBlocks.fee

