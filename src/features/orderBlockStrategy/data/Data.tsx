import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearData, fetchFirstData } from 'features/orderBlockStrategy/data/data.slice'
import { Button } from '@mui/material'
import { formattedDate } from 'shared/Date/formattedDate'
import Input from 'shared/Input/Input'
import { selectData } from 'features/orderBlockStrategy/data/data.selector'
import { selectDate, selectTimeFrame } from 'app/options/model/options.selector'

type Props = {
  symbols: string
  setSymbols: (symbols: string) => void
}
const Data = ({ symbols, setSymbols }: Props) => {
  const date = useSelector(selectDate)
  const timeFrame = useSelector(selectTimeFrame)
  const dispatch = useDispatch()
  const data = useSelector(selectData)

  useEffect(() => {
    if (data.length) {
      dispatch(
        fetchFirstData({
          symbols,
          timeFrame,
          initialTime: data[data.length - 1].closeTime,
        }),
      )
    }
  }, [data])

  const showTime = data.length ? (
    <li>
      ({data.length}) {formattedDate(data[0].openTime)} - {formattedDate(data[data.length - 1].closeTime)}
    </li>
  ) : (
    ''
  )

  const onClickFetchData = () => {
    dispatch(clearData())
    dispatch(fetchFirstData({ symbols, timeFrame, initialTime: date }))
  }

  // console.log('компонент Data перерисован')
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Input
        margin={'none'}
        type={'text'}
        label={'монета'}
        onChange={(e) => {
          setSymbols(e.currentTarget.value.toUpperCase())
        }}
        placeholder={symbols}
      />
      <Button onClick={onClickFetchData} color="success" variant="outlined">
        Загрузить график
      </Button>
      {showTime}
    </div>
  )
}

export default Data
