import React, {Dispatch, SetStateAction} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

type Props = {
  options: string[];
  setSelectedOption: Dispatch<SetStateAction<string>>;
  selectedOption: string;
  title: string;
  disabled?: boolean
};

const Dropdown = ({options, setSelectedOption, selectedOption, title, disabled}: Props) => {
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
  };

  return (
    <div>
      <FormControl sx={{m: 1, minWidth: 150}}>
        <InputLabel id="select">{title}</InputLabel>
        <Select
          size={"small"}
          labelId="select"
          id="select"
          value={selectedOption}
          label={title}
          onChange={handleChange}
          disabled={disabled}
        >
          {options.map((el) => (
            <MenuItem key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Dropdown;
