import {AppDispatch, AppRootStateType} from "app/store";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {dataType} from "shared/api/getKlines";

/**
 Эта функция предназначена для того, чтобы избавиться от дублирования кода по созданию типов в санке
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | dataType[];
}>();

