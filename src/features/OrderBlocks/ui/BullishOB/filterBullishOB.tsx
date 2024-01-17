import React from 'react';
import {useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import SummaryOB from "features/OrderBlocks/summaryOB";
import {selectData} from "features/data/data.selector";

type Props = {
  outsideOrderBlockCandleIndex: number
  bearishOBs: dataType[]
}

const FilterBullishOB = ({outsideOrderBlockCandleIndex, bearishOBs}: Props) => {
  const data = useSelector(selectData)

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

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(data, bearishOBs, outsideOrderBlockCandleIndex)

  const bearishObIndexes = sortedOrderBlocks.map((findOrderBlock) => data.indexOf(findOrderBlock));


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
