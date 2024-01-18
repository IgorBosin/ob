import {dataType, getKline} from "shared/api/getKlines";
import {createSlice} from "@reduxjs/toolkit";
import {isLoading, setAppError} from "app/app.slice";
import axios from "axios";
import {ErrorType} from "features/data/Data";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";

const slice = createSlice({
  name: 'data',
  initialState: {
    data: [] as dataType[]
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
  data: dataType[]
}, FetchDataArgs>('data/fetchData', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(isLoading({isLoading: true}))
    const responseData: dataType[] = await getKline(`${arg.symbols}USDT`, arg.timeFrame, arg.initialTime as number);
    if (responseData.length) {
      return {data: responseData}
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response ? e.response.data.messages[0].message : e.message
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