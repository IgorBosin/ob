import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import OpenTrade from '@/features/orderBlockStrategy/openTrade/OpenTrade'
import { selectAllOB, selectBearishOB, selectBullishOB } from '@/options/model/options.selector'
import { getAllOB, getBearishOB, getBullishOB } from '@/options/model/options.slice'
import { formattedDate } from '@/shared/Date/formattedDate'
import ShowCandles from '@/shared/ShowCandles/ShowCandles'
import { DataType } from '@/shared/api/getKlines'
import { isRedCandle } from '@/shared/getColorCandle/isRedCandle'

type Props = {
  orderBlocks: DataType[]
}

const ResultOrderBlocksAfterAllFilter = ({ orderBlocks }: Props) => {
  const allOB = useSelector(selectAllOB)
  const data = useSelector(selectData)
  const bearishOB = useSelector(selectBearishOB)
  const bullishOB = useSelector(selectBullishOB)
  const dispatch = useDispatch()

  const bullOB: DataType[] = []
  const bearOB: DataType[] = []

  orderBlocks.forEach(el => {
    isRedCandle(el) ? bullOB.push(el) : bearOB.push(el)
  })

  useEffect(() => {
    dispatch(getBullishOB({ bullOB }))
    dispatch(getBearishOB({ bearOB }))
    dispatch(getAllOB({ allOB: orderBlocks }))
  }, [orderBlocks])

  const showCandles = () =>
    orderBlocks.map(candle => {
      const bullOrBear = isRedCandle(candle) ? 'bull' : 'bear'

      return (
        <ul key={candle.openTime}>
          <li>
            {formattedDate(candle.openTime + 28800000)} - {bullOrBear}
          </li>
        </ul>
      )
    })

  const allOrderBlocksIndexes: number[] = allOB.map(findOrderBlock => data.indexOf(findOrderBlock))

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <OpenTrade orderBlocksIndexes={allOrderBlocksIndexes} />
      <div>{showCandles()}</div>
      <div>
        <ul>all({allOB.length})</ul>
        <ShowCandles candles={allOB} />
      </div>
      <div>
        <ul>bull({bullishOB.length})</ul>
        <ShowCandles candles={bullishOB} />
      </div>
      <div>
        <ul>bear({bearishOB.length})</ul>
        <ShowCandles candles={bearishOB} />
      </div>
    </div>
  )
}

export default ResultOrderBlocksAfterAllFilter
