import React from 'react';
import {dataType} from "shared/api/getKlines";
import ShowCandles from "shared/ShowCandles/ShowCandles";

type Props = {
  bearishOB?: dataType[]
  bullishOB?: dataType[]
}

const SummaryOB = ({bearishOB = [], bullishOB = []}: Props) => {
  console.log('bear', bearishOB)
  console.log('bull', bullishOB)

  const a = [...bearishOB, ...bullishOB]

  console.log('aqaq',a)

  const orderBlocks = [...bearishOB, ...bullishOB].sort((a, b) => a.openTime - b.openTime)

  return (
    <div>
      <ShowCandles candles={orderBlocks}/>
      {/*<OpenTrade orderBlocksIndexes={orderBlocksIndexes} candlesNumber={candlesNumber}/>*/}
    </div>

  );
};

export default SummaryOB;
