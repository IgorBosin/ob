import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import Input from "shared/Input/Input";
import Dropdown from "shared/Dropdown/Dropdown";
import {useDispatch, useSelector} from "react-redux";
import {
  changeBodyOrWickOutsideOB,
  changeCurrentCandleMustBeOutsideOB,
  changeFactorOB,
  changePrevNumberCandleForLiquidityWithdrawal,
  setCandlesNumberForInitializeOB
} from "features/OrderBlocks/model/orderBlocks.slice";
import {
  selectCandlesNumberForInitializeOB,
  selectCurrentCandleMustBeOutsideOB,
  selectFactorOB,
  selectPrevNumberCandleForLiquidityWithdrawal
} from "features/OrderBlocks/model/orderBlocks.selector";
import CoinSelection from "features/coinSelection/CoinSelection";
import DateComponent from "shared/Date/DateComponent";
import {importantDates} from "shared/Date/generalDates";
import FindOB from "features/OrderBlocks/ui/findOB/findOB";

const App = () => {

  const dispatch = useDispatch()
  const factorOB = useSelector(selectFactorOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)
  const optionsBodyOrWickOutsideOB = ['wick', 'body'];
  const [bodyOrWickOutsideOB, setBodyOrWickOutsideOB] = useState('body');

  const [initialTime, setInitialTime] = useState<number | null>(importantDates.january01year24);
  const optionsTimeFrame: TimeFrameType[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1mo'];
  const [timeFrame, setTimeFrame] = useState('30m');
  const [symbols, setSymbols] = useState('BTC')

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

  const onChangePrevNumberCandleForLiquidityWithdrawal = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changePrevNumberCandleForLiquidityWithdrawal({prevNumberCandleForLiquidityWithdrawal: +e.currentTarget.value}))
  }

  console.log('Компонент App перерисован')
  return (
    <div>
      <CoinSelection initialTime={initialTime} timeFrame={timeFrame}/>
      <DateComponent time={initialTime} setTime={setInitialTime}/>
      <Dropdown title={'TimeFrame'} options={optionsTimeFrame} selectedOption={timeFrame}
                setSelectedOption={setTimeFrame}/>
      <div style={{display: 'flex'}}>
        <Input placeholder={prevNumberCandleForLiquidityWithdrawal.toString()}
               label={'Кол-во свечей для снятия ликвидности'}
               onChange={onChangePrevNumberCandleForLiquidityWithdrawal}/>
        <Input placeholder={factorOB.toString()}
               label={'Расширение ОБ'}
               step={0.1}
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
      <Data initialTime={initialTime} timeFrame={timeFrame} setSymbols={setSymbols} symbols={symbols}/>
      <ErrorSnackbar/>
      <FindOB/>
      {/*<FindBearishOB/>*/}
      {/*<FindBullishOB bodyOrWickOutsideOB={bodyOrWickOutsideOB}*/}
      {/*               outsideOrderBlockCandleIndex={currentCandleMustBeOutsideOB}/>*/}
      {/*<SummaryOB/>*/}
    </div>
  );
};

export default App;

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
