import React, {FC} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

type Props = {
  options: TimeFrameType[];
  setSelectedOption: (selectedOption: TimeFrameType) => void
  selectedOption: TimeFrameType
  title: string
};

const Dropdown: FC<Props> = ({options, setSelectedOption, selectedOption, title}) => {


  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as TimeFrameType);
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
        >
          {options.map(el => <MenuItem key={el} value={el}>{el}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  );
};

export default Dropdown;


export type TimeFrameType =
  '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1mo';
