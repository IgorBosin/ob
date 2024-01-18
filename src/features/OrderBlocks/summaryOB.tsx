import React, {useEffect} from 'react';
import ShowCandles from "shared/ShowCandles/ShowCandles";
import {useDispatch, useSelector} from "react-redux";
import {selectAllOB, selectBearishOB, selectBullishOB} from "features/OrderBlocks/ui/model/orderBlocks.selector";
import {getAllOB} from "features/OrderBlocks/ui/model/orderBlocks.slice";

const SummaryOB = () => {
  const bearishOB = useSelector(selectBearishOB)
  const bullishOB = useSelector(selectBullishOB)
  const allOB = useSelector(selectAllOB)
  const dispatch = useDispatch()

  useEffect(() => {
    const orderBlocks = [...bearishOB, ...bullishOB].sort((a, b) => a.openTime - b.openTime)
    dispatch(getAllOB({allOB: orderBlocks}))
  }, [bearishOB, bullishOB]);

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        <ul>all</ul>
        <ShowCandles candles={allOB}/>
      </div>
      <div>
        <ul>bull</ul>
        <ShowCandles candles={bullishOB}/>
      </div>
      <div>
        <ul>bear</ul>
        <ShowCandles candles={bearishOB}/>
      </div>
    </div>

  );
};

export default SummaryOB;
