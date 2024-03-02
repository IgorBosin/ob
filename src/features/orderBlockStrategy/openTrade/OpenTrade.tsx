import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClosingTrade from 'features/orderBlockStrategy/closingTrade/ClosingTrade'
import { selectData } from 'features/orderBlockStrategy/data/data.selector'
import { formattedDate } from 'shared/Date/formattedDate'
import { selectCandlesNumberForInitializeOB, selectFactorOB } from 'app/options/model/options.selector'
import NotEnteringOrderBlocks from 'features/orderBlockStrategy/notEnteringOrderBlocks/notEnteringOrderBlocks'
import { getFee } from 'app/options/model/options.slice'
import { enteringTrade } from 'features/orderBlockStrategy/openTrade/action'

type Props = {
  orderBlocksIndexes: number[]
}
const OpenTrade = ({ orderBlocksIndexes }: Props) => {
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const [showTimeOBAndTimeEntering, setShowTimeOBAndTimeEntering] = useState<any>(<li></li>)
  const data = useSelector(selectData)
  const factorOB = useSelector(selectFactorOB)
  const dispatch = useDispatch()

  const enteringCandleIndexes = enteringTrade(data, orderBlocksIndexes, candlesNumberForInitializeOB, factorOB).sort((a, b) => a.orderBlock - b.orderBlock)

  useEffect(() => {
    const fee = enteringCandleIndexes.reduce((acc, el) => {
      return acc + el.fee
    }, 0)
    dispatch(getFee({ fee }))

    const showTime = enteringCandleIndexes.map((el) => (
      <li key={el.entering}>
        {formattedDate(data[el.orderBlock].openTime)} - {formattedDate(data[el.entering].openTime)}
      </li>
    ))
    setShowTimeOBAndTimeEntering(showTime)
  }, [data, orderBlocksIndexes])

  // console.log('перерисован компонент OpenTrade')
  return (
    <div style={{ display: 'flex' }}>
      <ClosingTrade enteringCandleIndexes={enteringCandleIndexes} orderBlocksIndexes={orderBlocksIndexes} />
      <NotEnteringOrderBlocks enteringCandleIndexes={enteringCandleIndexes} orderBlocksIndexes={orderBlocksIndexes} />
      <div>{showTimeOBAndTimeEntering}</div>
    </div>
  )
}

export default OpenTrade