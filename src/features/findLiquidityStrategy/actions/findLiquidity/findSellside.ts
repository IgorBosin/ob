import { DataType } from '@/shared/api/getKlines'

export const findSellside = (data: DataType[]) => {
  const sellside: DataType[] = []

  for (let i = 0; i < data.length - 1; i++) {
    let isTry = true

    for (let j = i + 1; j < data.length; j++) {
      if (data[i].low > data[j].low) {
        isTry = false
      }
    }
    if (isTry) {
      sellside.push(data[i])
    }
  }

  // console.log(sellside)
  return sellside
}
