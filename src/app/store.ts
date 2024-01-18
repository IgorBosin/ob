import {AnyAction, combineReducers, configureStore, ThunkAction, ThunkDispatch} from "@reduxjs/toolkit";
import {appSlice} from "app/app.slice";
import {dataSlice} from "features/data/data.slice";
import {orderBlocksSlice} from "features/OrderBlocks/ui/model/orderBlocks.slice";

const rootReducer = combineReducers({
  app: appSlice,
  data: dataSlice,
  orderBlocks: orderBlocksSlice
})
// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({reducer: rootReducer})

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
