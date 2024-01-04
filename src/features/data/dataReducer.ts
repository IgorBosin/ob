import {dataType} from "shared/api/getKlines";

const initialState = {
  data: [] as dataType[],
}

// reducer
export const dataReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case "FETCH-DATA": {
      return {...state, data: [...state.data, ...action.data]}
    }
    case "CLEAR-DATA": {
      return {...state, data: []}
    }
    default: {
      return state
    }
  }
}


//action creator
export const fetchDataAC = (data: dataType[]) => ({type: 'FETCH-DATA', data} as const)
export const clearDataAC = () => ({type: 'CLEAR-DATA'} as const)


//types
type InitialStateType = typeof initialState
type ActionType = FetchDataType | ClearDataType

type FetchDataType = ReturnType<typeof fetchDataAC>
type ClearDataType = ReturnType<typeof clearDataAC>

