import React, {useEffect} from 'react';
import ShowCandles from "shared/ShowCandles/ShowCandles";
import {useDispatch, useSelector} from "react-redux";
import {selectAllOB, selectBearishOB, selectBullishOB} from "features/OrderBlocks/model/orderBlocks.selector";
import {getAllOB} from "features/OrderBlocks/model/orderBlocks.slice";
import {selectData} from "features/data/data.selector";
import OpenTrade from "features/openTrade/OpenTrade";

type Props = {
  candlesNumber: number
}

const SummaryOB = ({candlesNumber}: Props) => {
  const data = useSelector(selectData)
  const allOB = useSelector(selectAllOB)
  const bearishOB = useSelector(selectBearishOB)
  const bullishOB = useSelector(selectBullishOB)
  const dispatch = useDispatch()

  useEffect(() => {
    const orderBlocks = [...bearishOB, ...bullishOB].sort((a, b) => a.openTime - b.openTime)
    dispatch(getAllOB({allOB: orderBlocks}))
  }, [bearishOB, bullishOB]);

  const allOrderBlocksIndexes: number[] = allOB.map((findOrderBlock) => data.indexOf(findOrderBlock));

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <OpenTrade orderBlocksIndexes={allOrderBlocksIndexes} candlesNumber={candlesNumber}/>
      <div>
        <ul>all({allOB.length})</ul>
        <ShowCandles candles={allOB}/>
      </div>
      <div>
        <ul>bull({bullishOB.length})</ul>
        <ShowCandles candles={bullishOB}/>
      </div>
      <div>
        <ul>bear({bearishOB.length})</ul>
        <ShowCandles candles={bearishOB}/>
      </div>
    </div>

  );
};

export default SummaryOB;
