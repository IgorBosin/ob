import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectError } from '@/app.selector'
import { setAppError } from '@/app.slice'
import { AlertProps, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant={'filled'} {...props} />
})

export function ErrorSnackbar() {
  const error = useSelector(selectError)
  const dispatch = useDispatch()

  const handleClose = (_?: Event | React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setAppError({ error: null }))
  }

  const isOpen = error !== null

  return (
    <Snackbar autoHideDuration={4000} onClose={handleClose} open={isOpen}>
      <Alert onClose={handleClose} severity={'error'}>
        {error}
      </Alert>
    </Snackbar>
  )
}
