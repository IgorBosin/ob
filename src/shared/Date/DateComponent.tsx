import * as React from 'react';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

type Props = {
  setTime: (timeInMilliseconds: number | null) => void;
  time: number | null;
};

export default function DateComponent({ time, setTime }: Props) {
  console.log(time)
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const timeInMilliseconds = newDate.getTime();
      setTime(timeInMilliseconds);
    } else {
      setTime(null);
    }
  };

  const referenceDate = time ? new Date(time) : undefined;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} sx={{ display: 'inline-block' }}>
        <DateTimePicker
          format={'dd/MM/yyyy HH:mm:ss'}
          value={time ? new Date(time) : null}
          ampm={false}
          slotProps={{ textField: { size: 'small' } }}
          onChange={handleDateChange}
          referenceDate={referenceDate}
        />
      </Stack>
    </LocalizationProvider>
  );
}
