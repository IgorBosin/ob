import React, {FC, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Dropdown from "shared/Dropdown/Dropdown";
import {clearData, fetchFirstData} from "features/data/data.slice";
import DateComponent from "shared/Date/DateComponent";
import {Button} from "@mui/material";
import {importantDates} from "shared/Date/generalDates";
import {formattedDate} from "shared/Date/formattedDate";
import Input from "shared/Input/Input";
import {selectData} from "features/data/data.selector";


const Data: FC = () => {
  const dispatch = useDispatch()
  const [initialTime, setInitialTime] = useState<number | null>(importantDates.september27year23);
  const data = useSelector(selectData)

  const optionsTimeFrame: TimeFrameType[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1mo'];
  const [timeFrame, setTimeFrame] = useState('4h');
  const [symbols, setSymbols] = useState('BTC')

  useEffect(() => {
    if (data.length) {
      dispatch(fetchFirstData({symbols, timeFrame, initialTime: data[data.length - 1].closeTime}))
    }
  }, [data]);

  const showTime = data.length
    ? <li>({data.length}) {formattedDate(data[0].openTime)} - {formattedDate(data[data.length - 1].closeTime)}</li>
    : ''

  const onClickFetchData = () => {
    dispatch(clearData())
    dispatch(fetchFirstData({symbols, timeFrame, initialTime}))
  }

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <DateComponent time={initialTime} setTime={setInitialTime}/>
      <Dropdown title={'TimeFrame'} options={optionsTimeFrame} selectedOption={timeFrame} setSelectedOption={setTimeFrame}/>
      <Input margin={"none"} type={"text"} label={'монета'}
             onChange={(e) => {
               setSymbols(e.currentTarget.value)
             }}
             placeholder={symbols}/>
      <Button onClick={onClickFetchData}
              color="success"
              variant="outlined">
        Загрузить график
      </Button>
      {showTime}
    </div>
  );
};

export default Data;

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

export type ErrorType = {
  statusCode: number,
  messages: [
    {
      message: string
      field: string
    }
  ],
  error: string
}
