import React from 'react';
import {useDispatch} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {getBullishOB} from "features/OrderBlocks/model/orderBlocks.slice";

type Props = {
  filteredBullishOB: dataType[]
}

const ResultBullishOBs = ({filteredBullishOB}: Props) => {
  const dispatch = useDispatch()

  dispatch(getBullishOB({bullOB: filteredBullishOB}))

  return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {/*<ShowCandles candles={filteredBullishOB}/>*/}
      </div>
  );
};

export default ResultBullishOBs;
