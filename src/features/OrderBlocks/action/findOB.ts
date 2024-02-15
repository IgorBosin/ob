import {isGreenCandle, isRedCandle} from "utils/actions";
import {DataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";

export const findOB = (data: DataType[], candlesNumberForInitializeOB: number) => {

  const bearOB = findBearishOB(data, candlesNumberForInitializeOB)
  const bullOB = findBullishOB(data, candlesNumberForInitializeOB)

  const result = [...bearOB, ...bullOB].sort((a, b) => a.openTime - b.openTime)

  // result.forEach(el => console.log(formattedDate(el.openTime)))
  return result;
};


export const findBearishOB = (data: DataType[], candlesNumberForInitializeOB: number) => {

  const result = [];

  for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {

    // Проверяем, что текущая свеча зеленая
    if (isGreenCandle(data[i])) {
      let isFollowedByRed = true;

      // Проверяем последующие n свечей
      for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
        // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
        if ((isGreenCandle(data[i + j]) || data[i + j].open === data[i + j].close)) {
          isFollowedByRed = false;
          break;
        }
      }

      // Если следующая цена не перекрывает ОБ, то не добавляем в результат
      if (data[i].open < data[i + candlesNumberForInitializeOB].close) {
        isFollowedByRed = false;
      }

      // Если все n следующих свечей красные, добавляем текущую свечу в результат
      if (isFollowedByRed) {
        result.push(data[i]);
      }
    }
  }
  return result;
};

export const findBullishOB = (data: DataType[], candlesNumberForInitializeOB: number) => {

  const result = [];

  for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {

    // Проверяем, что текущая свеча зеленая
    if (isRedCandle(data[i])) {
      let isFollowedByRed = true;

      // Проверяем последующие n свечей
      for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
        // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
        if (isRedCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
          isFollowedByRed = false;
          break;
        }
      }

      // Если следующая цена не перекрывает ОБ, то не добавляем в результат
      if (data[i].open > data[i + candlesNumberForInitializeOB].close) {
        isFollowedByRed = false;
      }

      // Если все n следующих свечей красные, добавляем текущую свечу в результат
      if (isFollowedByRed) {
        result.push(data[i]);
      }
    }
  }
  return result;
};
