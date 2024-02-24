import {DataType, getKline} from "shared/api/getKlines";
import {createSlice} from "@reduxjs/toolkit";
import {isLoading, setAppError} from "app/app.slice";
import axios from "axios";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import {ar} from "date-fns/locale";

const slice = createSlice({
  name: 'data',
  initialState: {
    data: [] as DataType[]
  },
  reducers: {
    clearData: (state) => {
      state.data = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFirstData.fulfilled, (state, action) => {
        state.data.push(...action.payload.data)
      })
  }
})

export const fetchFirstData = createAppAsyncThunk<{
  data: DataType[]
}, FetchDataArgs>('data/fetchData', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(isLoading({isLoading: true}))
    const responseData: DataType[] = await getKline(arg.symbols, arg.timeFrame, arg.initialTime as number);
    if (responseData.length) {
      return {data: responseData}
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response?.data.msg ? e.response.data.msg : e.message;
      dispatch(setAppError({error: error}));
      return rejectWithValue(null);
    }
    dispatch(setAppError({error: (e as Error).message}));
    return rejectWithValue(null);
  }
})

export const dataSlice = slice.reducer
export const {clearData} = slice.actions

type FetchDataArgs = {
  symbols: string
  timeFrame: string
  initialTime: number | null
}

export type ErrorType = {
  code: number
  msg: string
}
