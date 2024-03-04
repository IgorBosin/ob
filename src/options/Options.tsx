import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
} from '@/options/model/options.selector'
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
} from '@/options/model/options.slice'
import DateComponent from '@/shared/Date/DateComponent'
import Dropdown from '@/shared/Dropdown/Dropdown'
import Input from '@/shared/Input/Input'
import TimeFrame from '@/shared/TimeFrame/TimeFrameType'
import { Checkbox, FormControlLabel } from '@mui/material'

const Options = () => {
  const dispatch = useDispatch()
  const factorOB = useSelector(selectFactorOB)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)
  const currentCandleMustBeOutsideOB = useSelector(selectCurrentCandleMustBeOutsideOB)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const prevNumberCandleForLiquidityWithdrawal = useSelector(
    selectPrevNumberCandleForLiquidityWithdrawal
  )
  const optionsBodyOrWickOutsideOB = ['wick', 'body']
  const bodyOrWickOutsideOB = useSelector(selectBodyOrWickOutsideOB)
  const symbol = useSelector(selectSymbol)
  const riskReward = useSelector(selectRiskReward)

  const onChangeParamIndicator = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(
      setCandlesNumberForInitializeOB({
        candlesNumberForInitializeOB: +e.currentTarget.value,
      })
    )
  }
  const onChangeFactorOB = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeFactorOB({ factor: +e.currentTarget.value }))
  }

  const onChangeCurrentCandleMustBeOutsideOB = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(
      changeCurrentCandleMustBeOutsideOB({
        currentCandleMustBeOutsideOB: +e.currentTarget.value,
      })
    )
  }

  const onChangePrevNumberCandleForLiquidityWithdrawal = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(
      changePrevNumberCandleForLiquidityWithdrawal({
        prevNumberCandleForLiquidityWithdrawal: +e.currentTarget.value,
      })
    )
  }

  const onCheckIsShowOnlyBearOB = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(showOnlyBearOB({ isShowOnlyBearOB: e.currentTarget.checked }))
  }

  const onCheckIsShowOnlyBullOB = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(showOnlyBullOB({ isShowOnlyBullOB: e.currentTarget.checked }))
  }

  const handleDispatchAction = (value: 'body' | 'wick') => {
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
        <Input
          label={'монета'}
          margin={'none'}
          onChange={onChangeSymbol}
          placeholder={symbol}
          type={'text'}
        />
      </div>

      <div style={{ display: 'flex' }}>
        <Input label={'RR'} onChange={onChangeRiskReward} placeholder={riskReward.toString()} />

        <Input
          label={'Кол-во свечей для снятия ликвидности'}
          onChange={onChangePrevNumberCandleForLiquidityWithdrawal}
          placeholder={prevNumberCandleForLiquidityWithdrawal.toString()}
        />
        <Input
          label={'Расширение ОБ'}
          onChange={onChangeFactorOB}
          placeholder={factorOB.toString()}
          step={0.1}
        />
        <Input
          label={'Пар-р индикатора'}
          onChange={onChangeParamIndicator}
          placeholder={candlesNumberForInitializeOB.toString()}
        />
        <Input
          label={'n-свеча выходит за ОБ'}
          onChange={onChangeCurrentCandleMustBeOutsideOB}
          placeholder={currentCandleMustBeOutsideOB.toString()}
        />
      </div>
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <FormControlLabel
          control={<Checkbox checked={isShowOnlyBullOB} onChange={onCheckIsShowOnlyBullOB} />}
          label={'Red OB'}
          labelPlacement={'bottom'}
        />
        <FormControlLabel
          control={<Checkbox checked={isShowOnlyBearOB} onChange={onCheckIsShowOnlyBearOB} />}
          label={'Green OB'}
          labelPlacement={'bottom'}
        />
        <Dropdown
          dispatchAction={handleDispatchAction}
          options={optionsBodyOrWickOutsideOB}
          selectedOption={bodyOrWickOutsideOB}
          title={'Выход n-свечи за ОБ'}
        />
      </div>
    </div>
  )
}

export default Options
