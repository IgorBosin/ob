import React, {useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import Input from "shared/Input/Input";
import FindBearishOB from "features/OrderBlocks/ui/BearishOB/findBearishOB";
import FindBullishOB from "features/OrderBlocks/ui/BullishOB/findBullishOB";
import Dropdown from "shared/Dropdown/Dropdown";
import SummaryOB from "features/OrderBlocks/summaryOB";
import {useDispatch, useSelector} from "react-redux";
import {changeFactorOB} from "features/OrderBlocks/model/orderBlocks.slice";
import {selectBullishOB, selectFactorOB} from "features/OrderBlocks/model/orderBlocks.selector";

const App = () => {
  console.log('Компонент App перерисован')

  const dispatch = useDispatch()
  const [candlesNumber, setCandlesNumber] = useState(5)
  const [outsideOrderBlockCandleIndex, setOutsideOrderBlockCandleIndex] = useState(0)
  const factorOB = useSelector(selectFactorOB)

  const optionsBodyOrWickOutsideOB = ['wick', 'body'];
  const [bodyOrWickOutsideOB, setBodyOrWickOutsideOB] = useState('body');


  return (
    <div>
      <div style={{display: 'flex'}}>
        <Input placeholder={factorOB.toString()}
               label={'Расширение ОБ'}
               onChange={e => dispatch(changeFactorOB({factor: +e.currentTarget.value}))}/>
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
      <SummaryOB candlesNumber={candlesNumber}/>
    </div>
  );
};

export default App;
