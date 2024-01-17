import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import React from 'react';
import {useSelector} from "react-redux";
import {selectData} from "features/data/data.selector";

type Props = {
  candles: dataType[]
}

const ShowCandles = ({candles}: Props) => {
  const data = useSelector(selectData)

  const showCandles = (data: dataType[]) => data.map((candle) => (
      <ul key={candle.openTime}>
        <li>{formattedDate(candle.openTime)} - {(data.indexOf(candle))}</li>
      </ul>
    )
  )

  return (
    <div>
      {showCandles(data)}
    </div>
  );
};

export default ShowCandles;
