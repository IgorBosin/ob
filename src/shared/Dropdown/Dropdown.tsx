import React, {Dispatch, SetStateAction} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

type Props<T> = {
  options: T[];
  setSelectedOption: Dispatch<SetStateAction<T>>;
  selectedOption: T;
  title: string;
  disabled?: boolean;
};

const Dropdown = <T extends string>({options, setSelectedOption, selectedOption, title, disabled}: Props<T>) => {
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as T);
  };

  return (
    <div>
      <FormControl sx={{m: 1, minWidth: 150}}>
        <InputLabel id="select">{title}</InputLabel>
        <Select
          size="small"
          labelId="select"
          id="select"
          value={selectedOption}
          label={title}
          onChange={handleChange}
          disabled={disabled}
        >
          {options.map((el, index) => (
            <MenuItem key={index} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Dropdown;
