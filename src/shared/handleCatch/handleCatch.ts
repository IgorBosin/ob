import { setAppError, setLoading } from 'app/app.slice'
import axios, { AxiosError } from 'axios'
import { Dispatch } from 'redux'

export type ErrorType = {
  code: number
  msg: string
}
export const handleCatch = <T extends ErrorType>(e: Error | AxiosError<T>, dispatch: Dispatch<any>) => {
  if (axios.isAxiosError<ErrorType>(e)) {
    const error = e.response?.data.msg ? e.response.data.msg : e.message
    dispatch(setAppError({ error: error }))
  } else {
    dispatch(setAppError({ error: (e as Error).message }))
  }
  dispatch(setLoading({ isLoading: false }))
}
