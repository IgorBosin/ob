import * as React from 'react'
import Stack from '@mui/material/Stack'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useDispatch, useSelector } from 'react-redux'
import { changeDate } from 'app/options/model/options.slice'
import { selectDate } from 'app/options/model/options.selector'

export default function DateComponent() {
  const dispatch = useDispatch()
  const date = useSelector(selectDate)

  console.log(date)
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const timeInMilliseconds = newDate.getTime()
      dispatch(changeDate({ date: timeInMilliseconds }))
    }
  }

  const referenceDate = date ? new Date(date) : undefined

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} sx={{ display: 'inline-block' }}>
        <DateTimePicker
          format={'dd/MM/yyyy HH:mm:ss'}
          value={date ? new Date(date) : null}
          ampm={false}
          slotProps={{ textField: { size: 'small' } }}
          onChange={handleDateChange}
          referenceDate={referenceDate}
        />
      </Stack>
    </LocalizationProvider>
  )
}
