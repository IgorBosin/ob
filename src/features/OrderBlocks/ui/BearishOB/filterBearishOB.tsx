import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {getBearishOB} from "features/OrderBlocks/ui/model/orderBlocks.slice";
import {selectBearishOB} from "features/OrderBlocks/ui/model/orderBlocks.selector";

type Props = {
  outsideOrderBlockCandleIndex: number
  bearishOBs: dataType[]
  bodyOrWickOutsideOB: string
}

const FilterBearishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, bearishOBs}: Props) => {
  const data = useSelector(selectData)
  const bearishOB = useSelector(selectBearishOB)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBearishOB({bearOB: sortedOrderBlocks}))
  }, [bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, data]);

  const sortOBBySomeNextCandleOutsideOB = (data: dataType[], orderBlockList: dataType[], outsideOrderBlockCandleIndex: number) => {
    if (!outsideOrderBlockCandleIndex) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      const indexNextCandle = data.indexOf(orderBlock) + outsideOrderBlockCandleIndex

      if (bodyOrWickOutsideOB === 'body') {
        if (data[indexNextCandle].close < orderBlock.low) {
          sortOB.push(orderBlock)
        }
      }

      if (bodyOrWickOutsideOB === 'wick') {
        if (data[indexNextCandle].low < orderBlock.low) {
          sortOB.push(orderBlock)
        }
      }
    }
    return sortOB
  }

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(data, bearishOBs, outsideOrderBlockCandleIndex)

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      {/*<ShowCandles candles={bearishOB}/>*/}
    </div>
  );
};

export default FilterBearishOB;
