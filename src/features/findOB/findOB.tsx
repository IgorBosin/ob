import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import OpenTrade from "features/openTrade/OpenTrade";
import Input from "shared/Input/Input";

type Props = {
  candlesNumber: number
}

const FindOb = ({candlesNumber}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)
  const [dopParametr, setDopParametr] = useState(false)
  const [param, setParam] = useState(3)

  const findGreenCandlesFollowedByRed = () => {
    const result = [];

    for (let i = 0; i < candles.length - candlesNumber; i++) {
      // Проверяем, что текущая свеча зеленая
      if (candles[i].close > candles[i].open) {
        // Проверяем что текущая свеча снимает ликвидность с предыдущей свечи
        // if (candles[i].high > candles[i - 1 && 0].high) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumber; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (candles[i + j].close >= candles[i + j].open) {
            isFollowedByRed = false;
            break;
          }

          // Если Param свеча не вышло за ОБ, то прерываем проверку
          if (dopParametr && candles[i + param].high < candles[i].low) {
            isFollowedByRed = false;
            break;
          }
        }

        // Если все n следующих свечей красные, добавляем текущую свечу в результат
        if (isFollowedByRed) {
          result.push(candles[i]);
        }
        // }
      }
    }

    return result;
  };

  const findRedCandlesFollowedByGreen = () => {
    const result = [];

    for (let i = 0; i < candles.length - candlesNumber; i++) {
      // Проверяем, что текущая свеча красная
      if (candles[i].close < candles[i].open) {
        // Проверяем что текущая свеча снимает ликвидность с предыдущей свечи
        // if (candles[i].low < candles[i - 1 && 0].low) {
        let isFollowedByGreen = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumber; j++) {
          // Если хотя бы одна из следующих свечей не зеленая, то прерываем проверку
          if (candles[i + j].close < candles[i + j].open) {
            isFollowedByGreen = false;
            break;
          }

          // Если Param свеча не вышла за ОБ, то прерываем проверку
          if (dopParametr && candles[i + param].low < candles[i].high) {
            isFollowedByGreen = false;
            break;
          }
        }

        // Если все n следующих свечей зеленые, добавляем текущую свечу в результат
        if (isFollowedByGreen) {
          result.push(candles[i]);
        }
      }
      // }
    }

    return result;
  };

  const orderBlocks = [...findGreenCandlesFollowedByRed(), ...findRedCandlesFollowedByGreen()].sort(el => el.openTime)

  const orderBlocksIndexes = orderBlocks.map((findOrderBlock) => candles.indexOf(findOrderBlock));


  const showOrderBlocks = orderBlocks.map((candle) => (
    <ul key={candle.openTime}>
      <li>{formattedDate(candle.openTime)} - {(candle.high)}</li>
    </ul>
  ));

  return (
    <div>
      <Input placeholder={param.toString()} label={'Параметр'} onChange={(e)=>setParam(+e.currentTarget.value)}/>
      <input type="checkbox" checked={dopParametr} onChange={() => setDopParametr(!dopParametr)}/>
      <div style={{display: "flex"}}>
        <ul>
          {showOrderBlocks}
        </ul>
        <div>{orderBlocksIndexes.length}</div>
        <OpenTrade orderBlocksIndexes={orderBlocksIndexes} candlesNumber={candlesNumber}/>
      </div>
    </div>

  );
};

export default FindOb;
