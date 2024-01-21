import React from 'react';
import {useDispatch} from "react-redux";
import {dataType} from "shared/api/getKlines";
import {getBearishOB} from "features/OrderBlocks/model/orderBlocks.slice";

type Props = {
  filteredBearishOB: dataType[]
}

const ResultBearishOBs = ({filteredBearishOB}: Props) => {
  const dispatch = useDispatch()

  dispatch(getBearishOB({bearOB: filteredBearishOB}))

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {/*<ShowCandles candles={filteredBearishOB}/>*/}
      </div>
    </div>
  );
};

export default ResultBearishOBs;
