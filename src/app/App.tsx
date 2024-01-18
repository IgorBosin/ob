import React, {useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import Input from "shared/Input/Input";
import FindBearishOB from "features/OrderBlocks/ui/BearishOB/findBearishOB";
import FindBullishOB from "features/OrderBlocks/ui/BullishOB/findBullishOB";
import Dropdown from "shared/Dropdown/Dropdown";
import SummaryOB from "features/OrderBlocks/summaryOB";

const App = () => {
  console.log('Компонент App перерисован')

  const [candlesNumber, setCandlesNumber] = useState(5)
  const [outsideOrderBlockCandleIndex, setOutsideOrderBlockCandleIndex] = useState(0)


  const optionsBodyOrWickOutsideOB = ['wick', 'body'];
  const [bodyOrWickOutsideOB, setBodyOrWickOutsideOB] = useState('body');


  return (
    <div>
      <div style={{display: 'flex'}}>
        <Input placeholder={candlesNumber.toString()}
               label={'Пар-р индикатора'}
               onChange={e => setCandlesNumber(+e.currentTarget.value)}/>
        <Input placeholder={outsideOrderBlockCandleIndex.toString()}
               label={'n-свеча выходит за ОБ'}
               onChange={e => setOutsideOrderBlockCandleIndex(+e.currentTarget.value)}/>
        <Dropdown title={'Выход n-свечи за ОБ'}
                  options={optionsBodyOrWickOutsideOB}
                  selectedOption={bodyOrWickOutsideOB}
                  setSelectedOption={setBodyOrWickOutsideOB}/>
      </div>
      <Data/>
      <ErrorSnackbar/>
      <FindBearishOB bodyOrWickOutsideOB={bodyOrWickOutsideOB}
                     outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex}
                     candlesNumber={candlesNumber}/>
      <FindBullishOB bodyOrWickOutsideOB={bodyOrWickOutsideOB}
                     outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex}
                     candlesNumber={candlesNumber}/>
      <SummaryOB/>
    </div>
  );
};

export default App;
