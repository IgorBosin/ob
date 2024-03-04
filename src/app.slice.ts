import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  initialState: {
    error: null as null | string,
    isLoading: false,
    playSound: false,
  },
  name: 'app',
  reducers: {
    playSound: (state, action: PayloadAction<{ playSound: boolean }>) => {
      state.playSound = action.payload.playSound
    },
    setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading
    },
  },
})

export const appSlice = slice.reducer
export const { playSound, setAppError, setLoading } = slice.actions
