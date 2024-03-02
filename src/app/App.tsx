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
import NewStrategy from "features/findLiquidityStrategy/NewStrategy";
import {selectIsLoading} from "app/app.selector";
import PlaySound from "features/findLiquidityStrategy/playSound/playSound";

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
      <NewStrategy/>
      <CoinSelection initialTime={initialTime} timeFrame={timeFrame}/>
      <DateComponent time={initialTime} setTime={setInitialTime}/>
      <Dropdown title={'TimeFrame'} options={optionsTimeFrame} selectedOption={timeFrame}
                setSelectedOption={setTimeFrame}/>
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
