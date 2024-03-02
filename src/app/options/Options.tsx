import React, { ChangeEvent } from 'react'
import Input from 'shared/Input/Input'
import Dropdown from 'shared/Dropdown/Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeBodyOrWickOutsideOB,
  changeCurrentCandleMustBeOutsideOB,
  changeFactorOB,
  changePrevNumberCandleForLiquidityWithdrawal,
  changeRiskReward,
  changeSymbol,
  setCandlesNumberForInitializeOB,
  showOnlyBearOB,
  showOnlyBullOB,
} from 'app/options/model/options.slice'
import {
  selectBodyOrWickOutsideOB,
  selectCandlesNumberForInitializeOB,
  selectCurrentCandleMustBeOutsideOB,
  selectFactorOB,
  selectIsShowOnlyBearOB,
  selectIsShowOnlyBullOB,
  selectPrevNumberCandleForLiquidityWithdrawal,
  selectRiskReward,
  selectSymbol,
} from 'app/options/model/options.selector'
import { Checkbox, FormControlLabel } from '@mui/material'
import TimeFrame from 'shared/TimeFrame/TimeFrameType'
import DateComponent from 'shared/Date/DateComponent'

const Options = () => {
  const dispatch = useDispatch()
  const factorOB = useSelector(selectFactorOB)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)
  const optionsBodyOrWickOutsideOB = ['wick', 'body']
  const bodyOrWickOutsideOB = useSelector(selectBodyOrWickOutsideOB)
  const symbol = useSelector(selectSymbol)
  const riskReward = useSelector(selectRiskReward)

  const onChangeParamIndicator = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(
      setCandlesNumberForInitializeOB({
        candlesNumberForInitializeOB: +e.currentTarget.value,
      }),
    )
  }
  const onChangeFactorOB = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeFactorOB({ factor: +e.currentTarget.value }))
  }

  const onChangeCurrentCandleMustBeOutsideOB = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(
      changeCurrentCandleMustBeOutsideOB({
        currentCandleMustBeOutsideOB: +e.currentTarget.value,
      }),
    )
  }

  const onChangePrevNumberCandleForLiquidityWithdrawal = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(
      changePrevNumberCandleForLiquidityWithdrawal({
        prevNumberCandleForLiquidityWithdrawal: +e.currentTarget.value,
      }),
    )
  }

  const onCheckIsShowOnlyBearOB = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(showOnlyBearOB({ isShowOnlyBearOB: e.currentTarget.checked }))
  }

  const onCheckIsShowOnlyBullOB = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(showOnlyBullOB({ isShowOnlyBullOB: e.currentTarget.checked }))
  }

  const handleDispatchAction = (value: 'wick' | 'body') => {
    dispatch(changeBodyOrWickOutsideOB({ bodyOrWickOutsideOB: value }))
    debugger
  }

  const onChangeSymbol = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeSymbol({ symbol: e.currentTarget.value }))
  }

  const onChangeRiskReward = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeRiskReward({ riskReward: +e.currentTarget.value }))
  }

  // console.log('Компонент App перерисован')
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <DateComponent />
        <TimeFrame />
        <Input margin={'none'} type={'text'} label={'монета'} onChange={onChangeSymbol} placeholder={symbol} />
      </div>

      <div style={{ display: 'flex' }}>
        <Input label={'RR'} placeholder={riskReward.toString()} onChange={onChangeRiskReward} />

        <Input
          placeholder={prevNumberCandleForLiquidityWithdrawal.toString()}
          label={'Кол-во свечей для снятия ликвидности'}
          onChange={onChangePrevNumberCandleForLiquidityWithdrawal}
        />
        <Input placeholder={factorOB.toString()} label={'Расширение ОБ'} step={0.1} onChange={onChangeFactorOB} />
        <Input placeholder={candlesNumberForInitializeOB.toString()} label={'Пар-р индикатора'} onChange={onChangeParamIndicator} />
        <Input placeholder={currentCandleMustBeOutsideOB.toString()} label={'n-свеча выходит за ОБ'} onChange={onChangeCurrentCandleMustBeOutsideOB} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel control={<Checkbox checked={isShowOnlyBullOB} onChange={onCheckIsShowOnlyBullOB} />} label="Red OB" labelPlacement="bottom" />
        <FormControlLabel control={<Checkbox checked={isShowOnlyBearOB} onChange={onCheckIsShowOnlyBearOB} />} label="Green OB" labelPlacement="bottom" />
        <Dropdown
          title={'Выход n-свечи за ОБ'}
          options={optionsBodyOrWickOutsideOB}
          selectedOption={bodyOrWickOutsideOB}
          dispatchAction={handleDispatchAction}
        />
      </div>
    </div>
  )
}

export default Options
