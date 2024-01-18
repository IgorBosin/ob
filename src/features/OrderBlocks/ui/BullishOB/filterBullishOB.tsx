import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {getBullishOB} from "features/OrderBlocks/ui/model/orderBlocks.slice";
import {selectBullishOB} from "features/OrderBlocks/ui/model/orderBlocks.selector";

type Props = {
  outsideOrderBlockCandleIndex: number
  bearishOBs: dataType[]
  bodyOrWickOutsideOB: string
}

const FilterBullishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, bearishOBs}: Props) => {
  const data = useSelector(selectData)
  const bullishOB = useSelector(selectBullishOB)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBullishOB({bullOB: sortedOrderBlocks}))
  }, [bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, data]);

  const sortOBBySomeNextCandleOutsideOB = (data: dataType[], orderBlockList: dataType[], outsideOrderBlockCandleIndex: number) => {
    if (!outsideOrderBlockCandleIndex) return orderBlockList
    const sortOBs = []
    for (const orderBlock of orderBlockList) {
      const indexNextCandle = data.indexOf(orderBlock) + outsideOrderBlockCandleIndex

      if (bodyOrWickOutsideOB === 'body') {
        if (data[indexNextCandle].close > orderBlock.high) {
          sortOBs.push(orderBlock)
        }
      }

      if (bodyOrWickOutsideOB === 'wick') {
        if (data[indexNextCandle].high > orderBlock.high) {
          sortOBs.push(orderBlock)
        }
      }
    }
    return sortOBs
  }

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(data, bearishOBs, outsideOrderBlockCandleIndex)

  const bearishObIndexes = sortedOrderBlocks.map((findOrderBlock) => data.indexOf(findOrderBlock));

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      {/*<ShowCandles candles={bullishOB}/>*/}
    </div>
  );
};

export default FilterBullishOB;
