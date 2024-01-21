import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";


export const selectBullishOB = (state: AppRootStateType): dataType[] => state.orderBlocks.bullishOB
export const selectBearishOB = (state: AppRootStateType): dataType[] => state.orderBlocks.bearishOB
export const selectAllOB = (state: AppRootStateType): dataType[] => state.orderBlocks.allOB
export const selectFactorOB = (state: AppRootStateType): number => state.orderBlocks.factorOB
export const selectLiquidityWithdrawal = (state: AppRootStateType): boolean => state.orderBlocks.liquidityWithdrawal
export const selectCandlesNumberForInitializeOB = (state: AppRootStateType): number => state.orderBlocks.candlesNumberForInitializeOB

