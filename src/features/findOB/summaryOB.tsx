import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";
import {formattedDate} from "shared/Date/formattedDate";
import OpenTrade from "features/openTrade/OpenTrade";
import Input from "shared/Input/Input";
import {isGreenCandle, isRedCandle} from "utils/actions";

type Props = {

}

const SummaryOB = ({}: Props) => {
  const candles = useSelector<AppRootStateType, dataType[]>(state => state.data.data)

  // const orderBlocks = candles.sort((a, b) => a.openTime - b.openTime)


  return (
    <div>
      {/*<OpenTrade orderBlocksIndexes={orderBlocksIndexes} candlesNumber={candlesNumber}/>*/}
    </div>

  );
};

export default SummaryOB;
