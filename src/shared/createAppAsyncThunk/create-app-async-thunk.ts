import { DataType } from '@/shared/api/getKlines'
import { AppDispatch, AppRootStateType } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'

/**
 Эта функция предназначена для того, чтобы избавиться от дублирования кода по созданию типов в санке
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  dispatch: AppDispatch
  rejectValue: DataType[] | null
  state: AppRootStateType
}>()
