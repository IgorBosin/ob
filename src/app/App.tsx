import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import Input from "shared/Input/Input";
import FindBearishOB from "features/OrderBlocks/ui/BearishOB/findBearishOB";
import FindBullishOB from "features/OrderBlocks/ui/BullishOB/findBullishOB";
import Dropdown from "shared/Dropdown/Dropdown";
import SummaryOB from "features/OrderBlocks/summaryOB";
import {useDispatch, useSelector} from "react-redux";
import {
  changeBodyOrWickOutsideOB,
  changeCurrentCandleMustBeOutsideOB,
  changeFactorOB,
  setCandlesNumberForInitializeOB
} from "features/OrderBlocks/model/orderBlocks.slice";
import {
  selectCandlesNumberForInitializeOB,
  selectCurrentCandleMustBeOutsideOB,
  selectFactorOB
} from "features/OrderBlocks/model/orderBlocks.selector";

const App = () => {

  const dispatch = useDispatch()
  const factorOB = useSelector(selectFactorOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const optionsBodyOrWickOutsideOB = ['wick', 'body'];
  const [bodyOrWickOutsideOB, setBodyOrWickOutsideOB] = useState('body');

  useEffect(() => {
    dispatch(changeBodyOrWickOutsideOB({bodyOrWickOutsideOB: bodyOrWickOutsideOB}))
  }, [bodyOrWickOutsideOB])

  const onChangeParamIndicator = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(setCandlesNumberForInitializeOB({candlesNumberForInitializeOB: +e.currentTarget.value}))
  }
  const onChangeFactorOB = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeFactorOB({factor: +e.currentTarget.value}))
  }

  const onChangeCurrentCandleMustBeOutsideOB = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeCurrentCandleMustBeOutsideOB({currentCandleMustBeOutsideOB: +e.currentTarget.value}))
  }

  console.log('Компонент App перерисован')
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Input placeholder={factorOB.toString()}
               label={'Расширение ОБ'}
               onChange={onChangeFactorOB}/>
        <Input placeholder={candlesNumberForInitializeOB.toString()}
               label={'Пар-р индикатора'}
               onChange={onChangeParamIndicator}/>
        <Input placeholder={currentCandleMustBeOutsideOB.toString()}
               label={'n-свеча выходит за ОБ'}
               onChange={onChangeCurrentCandleMustBeOutsideOB}/>
        <Dropdown title={'Выход n-свечи за ОБ'}
                  options={optionsBodyOrWickOutsideOB}
                  selectedOption={bodyOrWickOutsideOB}
                  setSelectedOption={setBodyOrWickOutsideOB}/>
      </div>
      <Data/>
      <ErrorSnackbar/>
      <FindBearishOB/>
      <FindBullishOB bodyOrWickOutsideOB={bodyOrWickOutsideOB}
                     outsideOrderBlockCandleIndex={currentCandleMustBeOutsideOB}/>
      <SummaryOB/>
    </div>
  );
};

export default App;
