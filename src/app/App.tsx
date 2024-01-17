import React, {useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import Input from "shared/Input/Input";
import FindBearishOB from "features/OrderBlocks/ui/BearishOB/findBearishOB";
import FindBullishOB from "features/OrderBlocks/ui/BullishOB/findBullishOB";

const App = () => {
  console.log('Компонент App перерисован')

  const [candlesNumber, setCandlesNumber] = useState(5)
  const [outsideOrderBlockCandleIndex, setOutsideOrderBlockCandleIndex] = useState(0)


  return (
    <div>
      <Input placeholder={outsideOrderBlockCandleIndex.toString()} label={'тело n-свечи выходит за ОБ'}
             onChange={(e) => setOutsideOrderBlockCandleIndex(+e.currentTarget.value)}/>
      <Input placeholder={candlesNumber.toString()} label={'Пар-р индикатора'} onChange={(e) => {
        setCandlesNumber(+e.currentTarget.value)
      }}/>
      <Data/>
      <ErrorSnackbar/>
      <FindBearishOB outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex} candlesNumber={candlesNumber}/>
      <FindBullishOB outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex} candlesNumber={candlesNumber}/>
    </div>
  );
};

export default App;
