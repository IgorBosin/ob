import { useDispatch, useSelector } from 'react-redux'

import { selectDate } from '@/options/model/options.selector'
import { changeDate } from '@/options/model/options.slice'
import { formattedDate } from '@/shared/Date/formattedDate'
import { Stack } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export default function DateComponent() {
  const dispatch = useDispatch()
  const date = useSelector(selectDate)

  console.log(formattedDate(date))
  const handleDateChange = (newDate: number) => {
    if (newDate) {
      const timeInMilliseconds = newDate.valueOf()

      dispatch(changeDate({ date: timeInMilliseconds }))
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ display: 'inline-block' }}>
        <DateTimePicker
          ampm={false}
          format={'DD/MM/YYYY HH:mm'}
          onChange={handleDateChange}
          slotProps={{ textField: { size: 'small' } }}
          value={dayjs(date)}
        />
      </Stack>
    </LocalizationProvider>
  )
}
