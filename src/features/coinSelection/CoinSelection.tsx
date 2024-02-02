import React, {useState} from 'react';
import {coins} from "features/coinSelection/coins";
import {getCoinInfo, SummaryInfo} from "features/coinSelection/getCoinInfo";
import {setAppError} from "app/app.slice";
import {ErrorType} from "features/data/data.slice";
import {useDispatch} from "react-redux";
import axios from "axios";
import * as XLSX from 'xlsx';
import {formattedDate} from "shared/Date/formattedDate";

type Props = {
  timeFrame: string
  initialTime: number | null
};

const CoinSelection = ({timeFrame, initialTime}: Props) => {
  const [tableData, setTableData] = useState<SummaryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: string }>({
    key: null,
    direction: 'asc'
  });
  const dispatch = useDispatch();


  const iterCoin = async () => {
    setLoading(true);
    try {
      //------ДЛЯ ПАРАЛЛЕЛЬНОГО ЗАПРОСА---------------
      // const coinPromises = coins.map((coin) => getCoinInfo(coin, timeFrame, initialTime));
      // const data: SummaryInfo[] = await Promise.all(coinPromises);
      //--------------------------------------------------

      setLoading(false);

      //------ДЛЯ ПОСЛЕДОВАТЕЛЬНОГО ЗАПРОСА---------------
      const data: SummaryInfo[] = [];
      for (const coin of coins) {
        const info = await getCoinInfo(coin, timeFrame, initialTime);
        data.push(info);
      }
      //--------------------------------------------------

      // Сохраняем данные для отображения в состоянии
      setTableData(data);
    } catch (e) {
      setLoading(false);
      if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response ? e.response.data.msg : e.message;
        dispatch(setAppError({error: error}));
      }
      dispatch(setAppError({error: (e as Error).message}));
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

    return (
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
            <td>{info.persentWinningTrades}</td>
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
