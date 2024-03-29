import { TimeFrameType } from '@/shared/TimeFrame/TimeFrameType'
import { DataType } from '@/shared/api/getKlines'
import { AppRootStateType } from '@/store'

export const selectBullishOB = (state: AppRootStateType): DataType[] => state.orderBlocks.bullishOB
export const selectBearishOB = (state: AppRootStateType): DataType[] => state.orderBlocks.bearishOB
export const selectAllOB = (state: AppRootStateType): DataType[] => state.orderBlocks.allOB
export const selectFactorOB = (state: AppRootStateType): number => state.orderBlocks.factorOB
export const selectCandlesNumberForInitializeOB = (state: AppRootStateType): number =>
  state.orderBlocks.candlesNumberForInitializeOB
export const selectBodyOrWickOutsideOB = (state: AppRootStateType): string =>
  state.orderBlocks.bodyOrWickOutsideOB
export const selectCurrentCandleMustBeOutsideOB = (state: AppRootStateType): number =>
  state.orderBlocks.currentCandleMustBeOutsideOB
export const selectFee = (state: AppRootStateType): number => state.orderBlocks.fee
export const selectPrevNumberCandleForLiquidityWithdrawal = (state: AppRootStateType): number =>
  state.orderBlocks.prevNumberCandleForLiquidityWithdrawal
export const selectIsShowOnlyBullOB = (state: AppRootStateType): boolean =>
  state.orderBlocks.isShowOnlyBullOB
export const selectIsShowOnlyBearOB = (state: AppRootStateType): boolean =>
  state.orderBlocks.isShowOnlyBearOB
export const selectRiskReward = (state: AppRootStateType): number => state.orderBlocks.riskReward
export const selectTimeFrame = (state: AppRootStateType): TimeFrameType =>
  state.orderBlocks.timeFrame
export const selectDate = (state: AppRootStateType): number => state.orderBlocks.date
export const selectSymbol = (state: AppRootStateType): string => state.orderBlocks.symbol
