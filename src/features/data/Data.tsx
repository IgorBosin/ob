import React, {FC, useEffect, useState} from 'react';
import {dataType, getKline} from "shared/api/getKlines";
import {useDispatch, useSelector} from "react-redux";
import Dropdown from "shared/Dropdown/Dropdown";
import {setAppErrorAC, setDisabledButtonAC} from "app/appReducer";
import {AppRootStateType} from "app/store";
import {clearDataAC, fetchDataAC} from "features/data/dataReducer";
import DateComponent from "shared/Date/DateComponent";
import {Button} from "@mui/material";
import axios from "axios";
import {importantDates} from "../../shared/Date/generalDates";
import {formattedDate} from "shared/Date/formattedDate";


const Data: FC = () => {
  const dispatch = useDispatch()
  const [initialTime, setInitialTime] = useState<number | null>(importantDates.novemb20year2023);
  const data = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const options: TimeFrameType[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1mo'];
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>('4h');


  async function fetchFirstData() {
    dispatch(clearDataAC());
    try {
      const responseData: dataType[] = await getKline("DOTUSDT", timeFrame, initialTime as number);
      dispatch(fetchDataAC(responseData));
      dispatch(setDisabledButtonAC(true))
    } catch (e) {
      // dispatch(setAppErrorAC('Произошла ошибка при загрузке данных'));
      if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response ? e.response.data.messages[0].message : e.message
        dispatch(setAppErrorAC(error));
        return
      }
      dispatch(setAppErrorAC((e as Error).message));
    }
  }

  useEffect(() => {
    let hasError = false; // Флаг для отслеживания ошибки
    async function fetchData() {
      if (data.length) {
        try {
          const responseData: dataType[] = await getKline("BTCUSDT", timeFrame, data[data.length - 1].closeTime)
          if (!responseData.length) {
            dispatch(setAppErrorAC('График закончился'))
            return
          }
          dispatch(fetchDataAC(responseData))
        } catch (e) {
          // dispatch(setAppErrorAC('Произошла ошибка при загрузке данных'));
          // hasError = true; // Устанавливаем флаг в true при ошибке
          if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response ? e.response.data.messages[0].message : e.message
            dispatch(setAppErrorAC(error));
            return
          }
          dispatch(setAppErrorAC((e as Error).message));
        }
      }
    }
    fetchData(); // Вызываем асинхронную функцию сразу
    if (hasError) {
      return;
    }
  }, [data]);


  const showTime = data.length
    ? <li>выгружен график - {formattedDate(data[0].openTime)} - {formattedDate(data[data.length - 1].closeTime)}</li>
    : ''

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <DateComponent time={initialTime} setTime={setInitialTime}/>
      <Dropdown title={'TimeFrame'} options={options} selectedOption={timeFrame} setSelectedOption={setTimeFrame}/>
      <Button onClick={fetchFirstData} color="success" variant="outlined">Загрузить график</Button>
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
