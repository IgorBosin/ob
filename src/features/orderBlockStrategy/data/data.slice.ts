import { setLoading } from '@/app.slice'
import { DataType, getKline } from '@/shared/api/getKlines'
import { createAppAsyncThunk } from '@/shared/createAppAsyncThunk/create-app-async-thunk'
import { handleCatch } from '@/shared/handleCatch/handleCatch'
import { createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

const slice = createSlice({
  extraReducers: builder => {
    builder.addCase(fetchFirstData.fulfilled, (state, action) => {
      state.data.push(...action.payload.data)
    })
  },
  initialState: {
    data: [] as DataType[],
  },
  name: 'data',
  reducers: {
    clearData: state => {
      state.data = []
    },
  },
})

export const fetchFirstData = createAppAsyncThunk<
  {
    data: DataType[]
  },
  FetchDataArgs
>('data/fetchData', async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  dispatch(setLoading({ isLoading: true }))

  try {
    const responseData: DataType[] = await getKline(
      arg.symbols,
      arg.timeFrame,
      arg.initialTime as number
    )

    dispatch(setLoading({ isLoading: false }))

    if (responseData.length) {
      return { data: responseData }
    } else {
      return rejectWithValue(null)
    }
  } catch (e) {
    handleCatch(e as AxiosError, dispatch)

    return rejectWithValue(null)
  }
})

export const dataSlice = slice.reducer
export const { clearData } = slice.actions

type FetchDataArgs = {
  initialTime: null | number
  symbols: string
  timeFrame: string
}
