import { Dispatch, SetStateAction } from 'react'

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

type Props<T> = {
  disabled?: boolean
  dispatchAction?: (action: any) => void // Проп для dispatch
  options: T[]
  selectedOption: T
  setSelectedOption?: Dispatch<SetStateAction<T>>
  title: string
}

const Dropdown = <T extends string>({
  disabled,
  dispatchAction,
  options,
  selectedOption,
  setSelectedOption,
  title,
}: Props<T>) => {
  const handleChange = (event: SelectChangeEvent) => {
    if (setSelectedOption) {
      setSelectedOption(event.target.value as T)
    }
    if (dispatchAction) {
      dispatchAction(event.target.value as T)
    }
  }

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 150 }}>
        <InputLabel id={'select'}>{title}</InputLabel>
        <Select
          disabled={disabled}
          id={'select'}
          label={title}
          labelId={'select'}
          onChange={handleChange}
          size={'small'}
          value={selectedOption}
        >
          {options.map((el, index) => (
            <MenuItem key={index} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default Dropdown
