import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import React from 'react';

type Props = {
  data: dataType[]
  indexes: number[]
}

const ShowHighCandles = ({indexes, data}: Props) => {

  const showHighCandles = (data: dataType[], indexes: number[]) => {
    const highCandle: dataType[] = []
    for (const highCandleElement of indexes) {
      highCandle.push(data[highCandleElement])
    }
    return highCandle
  }

  const showOrderBlocks = showHighCandles(data, indexes).map((candle) => (
    <ul key={candle.openTime}>
      <li>{formattedDate(candle.openTime)} - {(candle.high)}</li>
    </ul>
  ));


  return (
    <div>
      {showOrderBlocks}
    </div>
  );
};

export default ShowHighCandles;
