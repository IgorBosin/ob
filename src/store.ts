import { appSlice } from '@/app.slice'
import { dataSlice } from '@/features/orderBlockStrategy/data/data.slice'
import { optionsSlice } from '@/options/model/options.slice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    app: appSlice,
    data: dataSlice,
    orderBlocks: optionsSlice,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
