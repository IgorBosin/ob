import { AppRootStateType } from '@/store'

export const selectError = (state: AppRootStateType): null | string => state.app.error
export const selectIsLoading = (state: AppRootStateType) => state.app.isLoading
export const selectPlaySound = (state: AppRootStateType) => state.app.playSound
