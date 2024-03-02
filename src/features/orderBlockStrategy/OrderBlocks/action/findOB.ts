import { DataType } from 'shared/api/getKlines'
import { isGreenCandle } from 'shared/getColorCandle/isGreenCandle'
import { isRedCandle } from 'shared/getColorCandle/isRedCandle'

export const findOB = (data: DataType[], candlesNumberForInitializeOB: number) => {
  const bearOB = findBearishOB(data, candlesNumberForInitializeOB)
  const bullOB = findBullishOB(data, candlesNumberForInitializeOB)

  return [...bearOB, ...bullOB].sort((a, b) => a.openTime - b.openTime)
}

export const findBearishOB = (data: DataType[], candlesNumberForInitializeOB: number) => {
  const result = []

  for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {
    // Проверяем, что текущая свеча зеленая
    if (isGreenCandle(data[i])) {
      let isFollowedByRed = true

      // Проверяем последующие n свечей
      for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
        // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
        if (isGreenCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
          isFollowedByRed = false
          break
        }
      }

      // Если следующая цена не перекрывает ОБ, то не добавляем в результат
      if (data[i].open < data[i + candlesNumberForInitializeOB].close) {
        isFollowedByRed = false
      }

      // Если все n следующих свечей красные, добавляем текущую свечу в результат
      if (isFollowedByRed) {
        result.push(data[i])
      }
    }
  }
  return result
}

export const findBullishOB = (data: DataType[], candlesNumberForInitializeOB: number) => {
  const result = []

  for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {
    // Проверяем, что текущая свеча зеленая
    if (isRedCandle(data[i])) {
      let isFollowedByRed = true

      // Проверяем последующие n свечей
      for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
        // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
        if (isRedCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
          isFollowedByRed = false
          break
        }
      }

      // Если следующая цена не перекрывает ОБ, то не добавляем в результат
      if (data[i].open > data[i + candlesNumberForInitializeOB].close) {
        isFollowedByRed = false
      }

      // Если все n следующих свечей красные, добавляем текущую свечу в результат
      if (isFollowedByRed) {
        result.push(data[i])
      }
    }
  }
  return result
}
