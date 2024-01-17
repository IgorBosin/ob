import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";

type Props = {
  data: dataType[]
}

const ShowCandles = ({data}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const showCandles = (data: dataType[]) => data.map((candle) => (
      <ul key={candle.openTime}>
        <li>{formattedDate(candle.openTime)} - {(candles.indexOf(candle))}</li>
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
