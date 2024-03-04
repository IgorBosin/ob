import { ChangeEvent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectData } from '@/features/orderBlockStrategy/data/data.selector'
import { clearData, fetchFirstData } from '@/features/orderBlockStrategy/data/data.slice'
import { selectDate, selectSymbol, selectTimeFrame } from '@/options/model/options.selector'
import { changeSymbol } from '@/options/model/options.slice'
import { formattedDate } from '@/shared/Date/formattedDate'
import Input from '@/shared/Input/Input'
import { AppDispatch } from '@/store'
import { Button } from '@mui/material'

const Data = () => {
  const symbol = useSelector(selectSymbol)
  const date = useSelector(selectDate)
  const timeFrame = useSelector(selectTimeFrame)
  const dispatch = useDispatch<AppDispatch>()
  const data = useSelector(selectData)

  useEffect(() => {
    if (data.length) {
      dispatch(
        fetchFirstData({
          initialTime: data[data.length - 1].closeTime,
          symbols: symbol,
          timeFrame,
        })
      )
    }
  }, [data])

  const showTime = data.length ? (
    <li>
      ({data.length}) {formattedDate(data[0].openTime)} -{' '}
      {formattedDate(data[data.length - 1].closeTime)}
    </li>
  ) : (
    ''
  )

  const onClickFetchData = () => {
    dispatch(clearData())
    dispatch(fetchFirstData({ initialTime: date, symbols: symbol, timeFrame }))
  }

  const onClickChangeSymbol = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(changeSymbol({ symbol: e.currentTarget.value }))
  }

  return (
    <div style={{ alignItems: 'center', display: 'flex', margin: ' 5px 0' }}>
      <Input
        label={'монета'}
        margin={'none'}
        onChange={onClickChangeSymbol}
        placeholder={symbol}
        type={'text'}
      />
      <Button color={'success'} onClick={onClickFetchData} variant={'outlined'}>
        Загрузить график
      </Button>
      {showTime}
    </div>
  )
}

export default Data
