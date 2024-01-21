import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {isGreenCandle} from "utils/actions";
import FilterBearishOB from "features/OrderBlocks/ui/BearishOB/filterBearishOB";
import {selectData} from "features/data/data.selector";
import {getBearishOB} from "features/OrderBlocks/model/orderBlocks.slice";
import {selectBearishOB, selectCandlesNumberForInitializeOB} from "features/OrderBlocks/model/orderBlocks.selector";
import ShowCandles from "shared/ShowCandles/ShowCandles";

type Props = {
  outsideOrderBlockCandleIndex: number
  bodyOrWickOutsideOB: string
}

const FindBearishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex}: Props) => {
  const data = useSelector(selectData)
  const dispatch = useDispatch()
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const bearishOB = useSelector(selectBearishOB)

  const findBearishOB = () => {
    const result = [];

    for (let i = 0; i < data.length - candlesNumberForInitializeOB; i++) {
      // Проверяем, что текущая свеча зеленая
      if (isGreenCandle(data[i])) {
        let isFollowedByRed = true;

        // Проверяем последующие n свечей
        for (let j = 1; j <= candlesNumberForInitializeOB; j++) {
          // Если хотя бы одна из следующих свечей не красная, то прерываем проверку
          if (isGreenCandle(data[i + j]) || data[i + j].open === data[i + j].close) {
            // if (isGreenCandle(data[i + j])) {
            isFollowedByRed = false;
            break;
          }
        }

        // Если все n следующих свечей красные, добавляем текущую свечу в результат
        if (isFollowedByRed) {
          result.push(data[i]);
        }
      }
    }

    return result;
  };


  useEffect(() => {
    dispatch(getBearishOB({bearOB: findBearishOB()}))
  }, [data, candlesNumberForInitializeOB]);

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        <ShowCandles candles={bearishOB}/>
      </div>
      <FilterBearishOB bodyOrWickOutsideOB={bodyOrWickOutsideOB}
                       outsideOrderBlockCandleIndex={outsideOrderBlockCandleIndex}
                       bearishOBs={findBearishOB()}/>
    </div>
  );
};

export default FindBearishOB;
