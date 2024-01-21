import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {selectData} from "features/data/data.selector";
import {getBearishOB} from "features/OrderBlocks/model/orderBlocks.slice";
import {selectBearishOB, selectLiquidityWithdrawal} from "features/OrderBlocks/model/orderBlocks.selector";
import ShowCandles from "shared/ShowCandles/ShowCandles";

type Props = {
  outsideOrderBlockCandleIndex: number
  bearishOBs: dataType[]
  bodyOrWickOutsideOB: string
}

const FilterBearishOB = ({bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, bearishOBs}: Props) => {
  const data = useSelector(selectData)
  const liquidityWithdrawal = useSelector(selectLiquidityWithdrawal)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(getBearishOB({bearOB: sortedOrderBlocks}))
  // }, [bodyOrWickOutsideOB, outsideOrderBlockCandleIndex, data]);

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

  const sortOBByLiquidityWithdrawal = (data: dataType[], orderBlockList: dataType[]) => {
    if (!liquidityWithdrawal) return orderBlockList
    const sortOB = []
    for (const orderBlock of orderBlockList) {
      const obIndex = data.indexOf(orderBlock)
      if (data[obIndex].high > data[obIndex - 1].high) {
        sortOB.push(orderBlock)
      }
    }
    return sortOB
  }

  const oBByLiquidityWithdrawal = sortOBByLiquidityWithdrawal(data, bearishOBs)

  const sortedOrderBlocks = sortOBBySomeNextCandleOutsideOB(data, oBByLiquidityWithdrawal, outsideOrderBlockCandleIndex)

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      {/*<ShowCandles candles={sortedOrderBlocks}/>*/}
    </div>
  );
};

export default FilterBearishOB;
