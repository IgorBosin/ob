import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import OpenTrade from "features/openTrade/OpenTrade";
import Input from "shared/Input/Input";
import {isGreenCandle, isRedCandle} from "utils/actions";
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
      <ShowCandles data={orderBlocks}/>
      {/*<OpenTrade orderBlocksIndexes={orderBlocksIndexes} candlesNumber={candlesNumber}/>*/}
    </div>

  );
};

export default SummaryOB;
