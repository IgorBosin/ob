import React, {useState} from 'react';
import {coins} from "features/coinSelection/coins";
import {getCoinInfo, SummaryInfo} from "features/coinSelection/getCoinInfo";
import {setAppError} from "app/app.slice";
import {ErrorType} from "features/data/data.slice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import * as XLSX from 'xlsx';
import {formattedDate} from "shared/Date/formattedDate";
import {
  selectCandlesNumberForInitializeOB,
  selectFactorOB, selectIsShowOnlyBearOB, selectIsShowOnlyBullOB,
  selectPrevNumberCandleForLiquidityWithdrawal
} from "features/OrderBlocks/model/orderBlocks.selector";

type Props = {
  timeFrame: string
  initialTime: number | null
};

const CoinSelection = ({timeFrame, initialTime}: Props) => {
  const [tableData, setTableData] = useState<SummaryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const prevNumberCandleForLiquidityWithdrawal = useSelector(selectPrevNumberCandleForLiquidityWithdrawal)
  const factorOB = useSelector(selectFactorOB)
  const candlesNumberForInitializeOB = useSelector(selectCandlesNumberForInitializeOB)
  const isShowOnlyBearOB = useSelector(selectIsShowOnlyBearOB)
  const isShowOnlyBullOB = useSelector(selectIsShowOnlyBullOB)

  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: string }>({
    key: null,
    direction: 'asc'
  });
  const dispatch = useDispatch();


  const iterCoin = async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    setLoading(true);
    try {
      setLoading(false);
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
    } catch (e) {
      setLoading(false);
      if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response?.data.msg ? e.response.data.msg : e.message;
        dispatch(setAppError({error: error}));
      } else {
        dispatch(setAppError({error: (e as Error).message}));
      }
    }
  };

  const exportToExcel = () => {
    if (!tableData.length) {
      return;
    }

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table.xlsx');
  };

  const sortByColumn = (key: string) => {
    let direction = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...tableData].sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setTableData(sortedData);
    setSortConfig({key, direction});
  };

  const renderTable = () => {
    if (!tableData.length) {
      return null;
    }

    const calculateTotalEnteringTrades = () => {
      return tableData.reduce((total, info) => total + info.earnPoints, 0);
    };

    return (
      <div>
        <p>Total Earn points: {calculateTotalEnteringTrades()}</p>
        <table style={{border: '1px solid #ddd', textAlign: 'center', width: '100%'}}>
          <thead>
          <tr>
            <th onClick={() => sortByColumn('coin')}>Монета</th>
            <th onClick={() => sortByColumn('allEnteringTrades')}>Всего сделок</th>
            <th onClick={() => sortByColumn('win')}>Выиграл</th>
            <th onClick={() => sortByColumn('lose')}>Проиграл</th>
            <th onClick={() => sortByColumn('earnPoints')}>Заработал очков</th>
            <th onClick={() => sortByColumn('persentWinningTrades')}>Процент выигрышных сделок</th>
            <th onClick={() => sortByColumn('maxLostTradesInRow')}>Макс кол-во сделок проиграл подряд</th>
            <th onClick={() => sortByColumn('strategyAssessment')}>Оценка монеты</th>
            <th onClick={() => sortByColumn('fee')}>Комиссия</th>
            <th onClick={() => sortByColumn('total')}>Итого</th>
            <th onClick={() => sortByColumn('nearestBullOB')}>Ближайш бычий ОБ</th>
            <th onClick={() => sortByColumn('nearestBearOB')}>Ближайш медвеж ОБ</th>
            <th onClick={() => sortByColumn('openTime')}>Начало графика</th>
            <th onClick={() => sortByColumn('closeTime')}>Конец графика</th>
          </tr>
          </thead>
          <tbody>
          {tableData.map((info, index) => (
            <tr key={index}>
              <td>{info.coin}</td>
              <td>{info.allEnteringTrades}</td>
              <td>{info.win}</td>
              <td>{info.lose}</td>
              <td>{info.earnPoints}</td>
              <td>{info.percentWinningTrades}</td>
              <td>{info.maxLostTradesInRow}</td>
              <td>{info.strategyAssessment}</td>
              <td>{info.fee}</td>
              <td>{info.total}</td>
              <td>{info.nearestBullOB}</td>
              <td>{info.nearestBearOB}</td>
              <td>{formattedDate(info.openTime)}</td>
              <td>{formattedDate(info.closeTime)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

    );
  };

  return (
    <div style={{margin: 'auto', maxWidth: '1500px', marginBottom: '10px'}}>
      <button disabled={loading} onClick={iterCoin}>Show Info</button>
      <button disabled={!tableData.length} onClick={exportToExcel}>
        Export to Excel
      </button>
      {renderTable()}
    </div>
  );
};

export default CoinSelection;
