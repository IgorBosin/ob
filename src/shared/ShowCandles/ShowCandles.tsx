import { useSelector } from 'react-redux'

import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import { formattedDate } from '@/shared/Date/formattedDate'
import { DataType } from '@/shared/api/getKlines'

type Props = {
  candles: DataType[]
}

const ShowCandles = ({ candles }: Props) => {
  const data = useSelector(selectData)

  const showCandles = () =>
    candles.map(candle => (
      <ul key={candle.openTime}>
        <li>
          {formattedDate(candle.openTime)} - {data.indexOf(candle)}
        </li>
      </ul>
    ))

  return <div>{showCandles()}</div>
}

export default ShowCandles
