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

const FilterBearishOB = ({outsideOrderBlockCandleIndex, bearishOBs}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)


  const sortOBBySomeNextCandleOutsideOB = (data: dataType[], orderBlockList: dataType[], outsideOrderBlockCandleIndex: number) => {
    if (!outsideOrderBlockCandleIndex) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      debugger
      const indexNextCandle = data.indexOf(orderBlock) + outsideOrderBlockCandleIndex
      if (data[indexNextCandle].close < orderBlock.low) {
        // if (data[indexNextCandle].low < orderBlock.low) {
        sortOB.push(orderBlock)
      }
    }
    return sortOB
  }

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(candles, bearishOBs, outsideOrderBlockCandleIndex)

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        {/*<ShowCandles data={sortedOrderBlocks}/>*/}
      </div>
      <SummaryOB bearishOB={sortedOrderBlocks}/>
    </div>
  );
};

export default FilterBearishOB;
