import React, {useState} from 'react';
import {coins} from "features/coinSelection/coins";
import {getCoinInfo, SummaryInfo} from "features/coinSelection/getCoinInfo";
import {setAppError} from "app/app.slice";
import {ErrorType} from "features/data/data.slice";
import {useDispatch} from "react-redux";
import axios from "axios";
import {formattedDate} from "shared/Date/formattedDate";
import * as XLSX from 'xlsx';

type Props = {
  timeFrame: string
  initialTime: number | null
}
const CoinSelection = ({timeFrame, initialTime}: Props) => {
  const [tableData, setTableData] = useState<SummaryInfo[] | null>(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [openTime, setOpenTime] = useState(0)
  const [closeTime, setCloseTime] = useState(0)


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const iterCoin = async () => {
    setLoading(true)
    try {
      setLoading(false)
      const data: SummaryInfo[] = [];

      for (const coin of coins) {
        const info = await getCoinInfo(coin, timeFrame, initialTime);
        data.push(info);
        setOpenTime(info.openTime)
        setCloseTime(info.closeTime)
        await delay(100);  // Добавляем задержку в 100 миллисекунд между вызовами
      }

      // Сохраняем данные для отображения в состоянии
      setTableData(data);
    } catch (e) {
      setLoading(false)
      if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response ? e.response.data.msg : e.message;
        dispatch(setAppError({error: error}));
      }
      dispatch(setAppError({error: (e as Error).message}));
    }
  };

  const renderTable = (data: SummaryInfo[] | null) => {
    if (!data || data.length === 0) {
      return null;
    }


    return (
      <table style={{border: '1px solid #ddd', textAlign: 'center', width: '100%'}}>
        <thead>
        <tr>
          <th>Монета</th>
          <th>Всего сделок</th>
          <th>Выиграл</th>
          <th>Проиграл</th>
          <th>Заработал очков</th>
          <th>Процент выигрышных сделок</th>
          <th>Макс кол-во сделок проиграл подряд</th>
          <th>Оценка монеты</th>
          <th>Комиссия</th>
          <th>Итого</th>
          <th>Начало графика</th>
          <th>Конец графика</th>
        </tr>
        </thead>
        <tbody>
        {data.map((info, index) => (
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
            <td>{formattedDate(info.openTime)}</td>
            <td>{formattedDate(info.closeTime)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  };

  const exportToExcel = () => {
    if (!tableData) {
      return;
    }

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table.xlsx');
  };


  return (
    <div style={{margin: 'auto', maxWidth: '600px'}}>
      <button disabled={loading} onClick={iterCoin}>Show Info</button>
      <button disabled={!tableData} onClick={exportToExcel}>
        Export to Excel
      </button>
      {renderTable(tableData)}
    </div>
  );
};

export default CoinSelection;
