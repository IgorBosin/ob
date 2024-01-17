import {AppRootStateType} from "app/store";
export const selectError = (state: AppRootStateType):string | null => state.app.error
export const selectIsLoading = (state: AppRootStateType) => state.app.isLoading
