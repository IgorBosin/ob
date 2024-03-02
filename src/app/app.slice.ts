import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null as string | null,
    isLoading: false,
    playSound: false
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading
    },
    playSound: (state, action: PayloadAction<{ playSound: boolean }>) => {
      state.playSound = action.payload.playSound
    }
  }
})
export const appSlice = slice.reducer;
export const {setAppError, setLoading, playSound} = slice.actions;


