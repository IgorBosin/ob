import React from 'react'
import Dropdown from 'shared/Dropdown/Dropdown'
import { changeTimeFrame } from 'app/options/model/options.slice'
import { useDispatch, useSelector } from 'react-redux'
import { selectTimeFrame } from 'app/options/model/options.selector'

const TimeFrame = () => {
  const optionsTimeFrame: TimeFrameType[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1mo']
  const dispatch = useDispatch()
  const timeFrame = useSelector(selectTimeFrame)
  const handleDispatchAction = (value: TimeFrameType) => {
    dispatch(changeTimeFrame({ timeFrame: value }))
  }

  return (
    <div>
      <Dropdown title={'TimeFrame'} options={optionsTimeFrame} selectedOption={timeFrame} dispatchAction={handleDispatchAction} />
    </div>
  )
}

export default TimeFrame

export type TimeFrameType = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1mo'
