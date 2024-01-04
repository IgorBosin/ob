const initialStateApp = {
  error: null as string | null,
  disabledButton: false
}

// reducer
export const appReducer = (state: InitialStateAppType = initialStateApp, action: ActionType): InitialStateAppType => {
  switch (action.type) {
    case "SET-APP-ERROR": {
      return {...state, error: action.error}
    }
    case "GLOBAL-DISABLED": {
      return {...state, disabledButton: action.isDisabled}
    }
    default: {
      return state
    }
  }
}


//action creator
export const setAppErrorAC = (error: string | null) => ({type: 'SET-APP-ERROR', error} as const)
export const setDisabledButtonAC = (isDisabled: boolean) => ({type: 'GLOBAL-DISABLED', isDisabled} as const)


//thunk creator


//types
type InitialStateAppType = typeof initialStateApp
type ActionType = SetAppErrorType | SetDisabledButtonType

type SetAppErrorType = ReturnType<typeof setAppErrorAC>
type SetDisabledButtonType = ReturnType<typeof setDisabledButtonAC>

