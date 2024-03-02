import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataType } from 'shared/api/getKlines'
import { getAllOB, getBearishOB, getBullishOB } from 'app/options/model/options.slice'
import OpenTrade from 'features/orderBlockStrategy/openTrade/OpenTrade'
import ShowCandles from 'shared/ShowCandles/ShowCandles'
import { selectData } from 'features/orderBlockStrategy/data/data.selector'
import { selectAllOB, selectBearishOB, selectBullishOB } from 'app/options/model/options.selector'
import { formattedDate } from 'shared/Date/formattedDate'
import { isRedCandle } from 'shared/getColorCandle/isRedCandle'

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

  orderBlocks.forEach((el) => {
    isRedCandle(el) ? bullOB.push(el) : bearOB.push(el)
  })

  useEffect(() => {
    dispatch(getBullishOB({ bullOB }))
    dispatch(getBearishOB({ bearOB }))
    dispatch(getAllOB({ allOB: orderBlocks }))
  }, [orderBlocks])

  const showCandles = () =>
    orderBlocks.map((candle) => {
      const bullOrBear = isRedCandle(candle) ? 'bull' : 'bear'
      return (
        <ul key={candle.openTime}>
          <li>
            {formattedDate(candle.openTime + 28800000)} - {bullOrBear}
          </li>
        </ul>
      )
    })

  const allOrderBlocksIndexes: number[] = allOB.map((findOrderBlock) => data.indexOf(findOrderBlock))

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
