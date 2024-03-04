import { useDispatch, useSelector } from 'react-redux'

import { selectTimeFrame } from '@/options/model/options.selector'
import { changeTimeFrame } from '@/options/model/options.slice'
import Dropdown from '@/shared/Dropdown/Dropdown'

const TimeFrame = () => {
  const optionsTimeFrame: TimeFrameType[] = [
    '1m',
    '3m',
    '5m',
    '15m',
    '30m',
    '1h',
    '2h',
    '4h',
    '6h',
    '8h',
    '12h',
    '1d',
    '3d',
    '1w',
    '1mo',
  ]
  const dispatch = useDispatch()
  const timeFrame = useSelector(selectTimeFrame)
  const handleDispatchAction = (value: TimeFrameType) => {
    dispatch(changeTimeFrame({ timeFrame: value }))
  }

  return (
    <div>
      <Dropdown
        dispatchAction={handleDispatchAction}
        options={optionsTimeFrame}
        selectedOption={timeFrame}
        title={'TimeFrame'}
      />
    </div>
  )
}

export default TimeFrame

export type TimeFrameType =
  | '1d'
  | '1h'
  | '1m'
  | '1mo'
  | '1w'
  | '2h'
  | '3d'
  | '3m'
  | '4h'
  | '5m'
  | '6h'
  | '8h'
  | '12h'
  | '15m'
  | '30m'
