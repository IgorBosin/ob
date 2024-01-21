import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {getBullishOB} from "features/OrderBlocks/model/orderBlocks.slice";
import {selectBullishOB, selectLiquidityWithdrawal} from "features/OrderBlocks/model/orderBlocks.selector";
import ShowCandles from "shared/ShowCandles/ShowCandles";

type Props = {
  outsideOrderBlockCandleIndex: number
  bullishOBs: dataType[]
  bodyOrWickOutsideOB: string
}

const FilterBullishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, bullishOBs}: Props) => {
  const data = useSelector(selectData)
  const liquidityWithdrawal = useSelector(selectLiquidityWithdrawal)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBullishOB({bullOB: sortedOrderBlocks}))
  }, [bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, data]);

  const sortOBByLiquidityWithdrawal = (data: dataType[], orderBlockList: dataType[]) => {
    if (!liquidityWithdrawal) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      const obIndex = data.indexOf(orderBlock)
      if (data[obIndex].low < data[obIndex - 1].low) {
        sortOB.push(orderBlock)
      }
    }
    return sortOB
  }

  const oBByLiquidityWithdrawal = sortOBByLiquidityWithdrawal(data, bullishOBs)


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

  // const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(data, bullishOBs, outsideOrderBlockCandleIndex)
  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(data, oBByLiquidityWithdrawal, outsideOrderBlockCandleIndex)

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      {/*<ShowCandles candles={sortedOrderBlocks}/>*/}
    </div>
  );
};

export default FilterBullishOB;
