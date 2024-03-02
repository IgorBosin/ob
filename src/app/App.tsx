import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/orderBlockStrategy/data/Data";
import Input from "shared/Input/Input";
import Dropdown from "shared/Dropdown/Dropdown";
import {useDispatch, useSelector} from "react-redux";
import {
  changeBodyOrWickOutsideOB,
  changeCurrentCandleMustBeOutsideOB,
  changeFactorOB,
  changePrevNumberCandleForLiquidityWithdrawal,
  setCandlesNumberForInitializeOB,
  showOnlyBearOB,
  showOnlyBullOB
} from "features/orderBlockStrategy/OrderBlocks/model/orderBlocks.slice";
import {
  selectCandlesNumberForInitializeOB,
  selectCurrentCandleMustBeOutsideOB,
  selectFactorOB,
  selectIsShowOnlyBearOB,
  selectIsShowOnlyBullOB,
  selectPrevNumberCandleForLiquidityWithdrawal
} from "features/orderBlockStrategy/OrderBlocks/model/orderBlocks.selector";
import CoinSelection from "features/orderBlockStrategy/coinSelection/CoinSelection";
import DateComponent from "shared/Date/DateComponent";
import {importantDates} from "shared/Date/generalDates";
import FindOB from "features/orderBlockStrategy/OrderBlocks/ui/findOB/findOB";
import {Checkbox, FormControlLabel, LinearProgress} from "@mui/material";
import FindLiquidityStrategy from "features/findLiquidityStrategy/FindLiquidityStrategy";
import {selectIsLoading} from "app/app.selector";
import PlaySound from "shared/playSound/playSound";
import TimeFrame, {TimeFrameType} from "shared/TimeFrame/TimeFrame";

const App = () => {

  const dispatch = useDispatch()
  const factorOB = useSelector(selectFactorOB)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)
  const optionsBodyOrWickOutsideOB = ['wick', 'body'];
  const [bodyOrWickOutsideOB, setBodyOrWickOutsideOB] = useState('body');
  const isLoading = useSelector(selectIsLoading)

  const [initialTime, setInitialTime] = useState<number | null>(importantDates.january01year24);
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>('30m');
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


  const onCheckIsShowOnlyBearOB = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(showOnlyBearOB({isShowOnlyBearOB: e.currentTarget.checked}))
  }

  const onCheckIsShowOnlyBullOB = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(showOnlyBullOB({isShowOnlyBullOB: e.currentTarget.checked}))
  }

  // console.log('Компонент App перерисован')
  return (
    <div>
      {isLoading && <LinearProgress/>}
      <PlaySound/>
      <FindLiquidityStrategy/>
      <CoinSelection initialTime={initialTime} timeFrame={timeFrame}/>
      <DateComponent time={initialTime} setTime={setInitialTime}/>
      <TimeFrame timeFrame={timeFrame} setTimeFrame={setTimeFrame}/>
      <div style={{display: 'flex'}}>
        <FormControlLabel
          control={<Checkbox checked={isShowOnlyBullOB} onChange={onCheckIsShowOnlyBullOB}/>}
          label="Red OB"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={<Checkbox checked={isShowOnlyBearOB} onChange={onCheckIsShowOnlyBearOB}/>}
          label="Green OB"
          labelPlacement="bottom"
        />
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
    </div>
  );
};

export default App;
