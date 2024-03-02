import React, {useState} from 'react';
import {coins} from "features/orderBlockStrategy/coinSelection/coins";
import {getCoinInfo, SummaryInfo} from "features/orderBlockStrategy/coinSelection/getCoinInfo";
import {setLoading, setAppError} from "app/app.slice";
import {ErrorType} from "features/orderBlockStrategy/data/data.slice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {
  selectCandlesNumberForInitializeOB,
  selectFactorOB,
  selectIsShowOnlyBearOB,
  selectIsShowOnlyBullOB,
  selectPrevNumberCandleForLiquidityWithdrawal
} from "features/orderBlockStrategy/OrderBlocks/model/orderBlocks.selector";
import DynamicTable, {Column} from "shared/DynamicTable/DynamicTable";
import {exportToExcel} from "shared/exportToExcel/exportToExcel";
import {selectIsLoading} from "app/app.selector";

type Props = {
  timeFrame: string
  initialTime: number | null
};

const CoinSelection = ({timeFrame, initialTime}: Props) => {
  const [tableData, setTableData] = useState<SummaryInfo[]>([]);
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)
  const factorOB = useSelector(selectFactorOB)
  const isLoading = useSelector(selectIsLoading)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)
  const dispatch = useDispatch();


  const iterCoin = async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    dispatch(setLoading({isLoading: true}))
    try {
      //------ДЛЯ ПАРАЛЛЕЛЬНОГО ЗАПРОСА---------------
      const coinPromises = coins.map((coin) => getCoinInfo(
        coin,
        timeFrame,
        initialTime,
        prevNumberCandleForLiquidityWithdrawal,
        factorOB,
        candlesNumberForInitializeOB,
        isShowOnlyBullOB,
        isShowOnlyBearOB
      ));
      const data: SummaryInfo[] = await Promise.all(coinPromises);
      //--------------------------------------------------


      //------ДЛЯ ПОСЛЕДОВАТЕЛЬНОГО ЗАПРОСА---------------
      // const data: SummaryInfo[] = [];
      // for (const coin of coins) {
      //   const info = await getCoinInfo(
      //     coin,
      //     timeFrame,
      //     initialTime,
      //     prevNumberCandleForLiquidityWithdrawal,
      //     factorOB,
      //     candlesNumberForInitializeOB,
      //     isShowOnlyBullOB,
      //     isShowOnlyBearOB
      //   );
      //   data.push(info);
      // }
      //--------------------------------------------------

      // Сохраняем данные для отображения в состоянии
      setTableData(data);
      dispatch(setLoading({isLoading: false}))
    } catch (e) {
      dispatch(setLoading({isLoading: false}))
      if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response?.data.msg ? e.response.data.msg : e.message;
        dispatch(setAppError({error: error}));
      } else {
        dispatch(setAppError({error: (e as Error).message}));
      }
    }
  };

  const columns: Column<SummaryInfo>[] = [
    {label: 'Монета', prop: 'coin'},
    {label: 'Всего сделок', prop: 'allEnteringTrades'},
    {label: 'Выиграл', prop: 'win'},
    {label: 'Проиграл', prop: 'lose'},
    {label: 'Заработал очков', prop: 'earnPoints'},
    {label: 'Процент выигрышных сделок', prop: 'percentWinningTrades'},
    {label: 'Макс кол-во сделок проиграл подряд', prop: 'maxLostTradesInRow'},
    {label: 'Оценка монеты', prop: 'strategyAssessment'},
    {label: 'Комиссия', prop: 'fee'},
    {label: 'Итого', prop: 'total'},
    {label: 'Ближайш бычий ОБ', prop: 'nearestBullOB'},
    {label: 'Ближайш медвеж ОБ', prop: 'nearestBearOB'},
    {label: 'Начало графика', prop: 'openTime', date: true},
    {label: 'Конец графика', prop: 'closeTime', date: true},
  ];

  return (
    <div style={{margin: 'auto', maxWidth: '1500px', marginBottom: '10px'}}>
      <button disabled={isLoading} onClick={iterCoin}>Show Info</button>
      <button disabled={!tableData.length} onClick={() => exportToExcel(tableData)}>
        Export to Excel
      </button>
      <DynamicTable data={tableData} columns={columns} setData={setTableData}/>
    </div>
  );
};

export default CoinSelection;
