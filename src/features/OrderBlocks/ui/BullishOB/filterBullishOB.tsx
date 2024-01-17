import React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import SummaryOB from "features/OrderBlocks/summaryOB";
import ShowCandles from "shared/ShowCandles/ShowCandles";

type Props = {
  outsideOrderBlockCandleIndex: number
  bearishOBs: dataType[]
}

const FilterBullishOB = ({outsideOrderBlockCandleIndex, bearishOBs}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  const sortOBBySomeNextCandleOutsideOB = (data: dataType[], orderBlockList: dataType[], outsideOrderBlockCandleIndex: number) => {
    if (!outsideOrderBlockCandleIndex) return orderBlockList
    const sortOBs = []
    for (const orderBlock of orderBlockList) {
      const indexNextCandle = data.indexOf(orderBlock) + outsideOrderBlockCandleIndex
      if (data[indexNextCandle].close > orderBlock.high) {
        sortOBs.push(orderBlock)
      }
    }
    return sortOBs
  }

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(candles, bearishOBs, outsideOrderBlockCandleIndex)

  const bearishObIndexes = sortedOrderBlocks.map((findOrderBlock) => candles.indexOf(findOrderBlock));


  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        {/*<ShowCandles data={sortedOrderBlocks}/>*/}
      </div>
      <SummaryOB bullishOB={sortedOrderBlocks}/>
    </div>
  );
};

export default FilterBullishOB;
