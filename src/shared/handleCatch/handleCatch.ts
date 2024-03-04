import { Dispatch } from 'react'

import { setAppError, setLoading } from '@/app.slice'
import { AxiosError, isAxiosError } from 'axios'

export type ErrorType = {
  code: number
  msg: string
}
export const handleCatch = <T extends ErrorType>(
  e: AxiosError<T> | Error,
  dispatch: Dispatch<any>
) => {
  if (isAxiosError<ErrorType>(e)) {
    const error = e.response?.data.msg ? e.response.data.msg : e.message

    dispatch(setAppError({ error: error }))
  } else {
    dispatch(setAppError({ error: (e as Error).message }))
  }
  dispatch(setLoading({ isLoading: false }))
}
