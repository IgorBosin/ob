import React, {useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import FindOb from "features/findOB/findOB";
import Input from "shared/Input/Input";

const App = () => {
  // console.log('Компонент App перерисован')

  const [candlesNumber, setCandlesNumber] = useState(5)



  return (
    <div>
      <Input placeholder={candlesNumber.toString()} label={'Пар-р индикатора'} onChange={(e)=>{setCandlesNumber(+e.currentTarget.value)}}/>
      <Data/>
      <ErrorSnackbar/>
      <FindOb candlesNumber={candlesNumber}/>
    </div>
  );
};

export default App;
