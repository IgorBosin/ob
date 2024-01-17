import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null as string | null,
    isLoading: false
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    isLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading
    }
  }
})
export const appSlice = slice.reducer;
export const {setAppError,isLoading} = slice.actions;


