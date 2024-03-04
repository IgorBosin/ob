import { DataType } from '@/shared/api/getKlines'

export const findBuyside = (data: DataType[]) => {
  const buySide: DataType[] = []

  for (let i = 0; i < data.length - 1; i++) {
    let isTry = true

    for (let j = i + 1; j < data.length; j++) {
      if (data[i].high < data[j].high) {
        isTry = false
      }
    }
    if (isTry) {
      buySide.push(data[i])
    }
  }

  // console.log(buySide.map(el=>formattedDate(el.openTime)))
  // console.log(buySide.map(el => el.high))
  return buySide
}
