import { DataType } from '@/shared/api/getKlines'
import { AppRootStateType } from '@/store'

export const selectData = (state: AppRootStateType): DataType[] => state.data.data
