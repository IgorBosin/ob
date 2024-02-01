import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearData, fetchFirstData} from "features/data/data.slice";
import {Button} from "@mui/material";
import {formattedDate} from "shared/Date/formattedDate";
import Input from "shared/Input/Input";
import {selectData} from "features/data/data.selector";


type Props = {
  symbols: string
  timeFrame: string
  initialTime: number | null
  setSymbols: (symbols: string) => void
}
const Data = ({symbols, timeFrame, setSymbols, initialTime}: Props) => {
  const dispatch = useDispatch()
  const data = useSelector(selectData)


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

  console.log('компонент Data перерисован')
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Input margin={"none"} type={"text"} label={'монета'}
             onChange={(e) => {
               setSymbols(e.currentTarget.value.toUpperCase())
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



