import React, {useState} from 'react';
import {coins} from "features/coinSelection/coins";
import {setAppError} from "app/app.slice";
import {ErrorType} from "features/data/data.slice";
import {useDispatch} from "react-redux";
import axios from "axios";
import * as XLSX from 'xlsx';
import {ShowDistanceToLiquidity, showDistanceToLiquidity} from "app/newStrategy/showDistanceToLiquidity";

type Props = {
  initialTime: number | null
};

const NewStrategy = ({}: Props) => {
  const [tableData, setTableData] = useState<ShowDistanceToLiquidity[]>([]);
  const [loading, setLoading] = useState(false);
  const currentDateInMillis = new Date().getTime();
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInFiveDays = 6 * millisecondsInDay;

  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: string }>({
    key: null,
    direction: 'asc'
  });
  const dispatch = useDispatch();


  const iterCoin = async () => {
    setLoading(true);
    try {
      setLoading(false);
      //------ДЛЯ ПАРАЛЛЕЛЬНОГО ЗАПРОСА---------------
      const coinPromises = coins.map((coin) => showDistanceToLiquidity(coin, currentDateInMillis - millisecondsInFiveDays));
      const data = await Promise.all(coinPromises);
      //--------------------------------------------------

      //------ДЛЯ ПОСЛЕДОВАТЕЛЬНОГО ЗАПРОСА---------------
      // const data: ShowDistanceToLiquidity[] = [];
      // for (const coin of coins) {
      //   const info = await showDistanceToLiquidity(coin, currentDateInMillis - millisecondsInFiveDays);
      //   data.push(info);
      // }
      //--------------------------------------------------

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

    return (
      <table style={{border: '1px solid #ddd', textAlign: 'center', width: '100%'}}>
        <thead>
        <tr>
          <th onClick={() => sortByColumn('coin')}>Монета</th>
          <th onClick={() => sortByColumn('percentBeforeBuyside')}>Buyside liquidity</th>
          <th onClick={() => sortByColumn('percentBeforeSellside')}>Sellside liquidity</th>
          <th onClick={() => sortByColumn('percentCurrentPriceBeforeBuyside')}>Nearest buyside liquidity</th>
          <th onClick={() => sortByColumn('percentCurrentPriceBeforeSellside')}>Nearest sellside liquidity</th>
        </tr>
        </thead>
        <tbody>
        {tableData.map((info, index) => (
          <tr key={index}>
            <td style={info.coin == 'BTC' ? {color: 'red'} : {color: 'inherit'}}>{info.coin}</td>
            <td
              style={info.percentBeforeBuyside < 0.3 ? {color: 'red'} : {color: 'inherit'}}>{info.percentBeforeBuyside}
            </td>
            <td
              style={info.percentBeforeSellside < 0.3 ? {color: 'red'} : {color: 'inherit'}}>{info.percentBeforeSellside}
            </td>
            <td
              style={info.percentCurrentPriceBeforeBuyside < 0.3 ? {color: 'red'} : {color: 'inherit'}}>{info.percentCurrentPriceBeforeBuyside}
            </td>
            <td
              style={info.percentCurrentPriceBeforeSellside < 0.3 ? {color: 'red'} : {color: 'inherit'}}>{info.percentCurrentPriceBeforeSellside}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{margin: 'auto', maxWidth: '1500px', marginBottom: '10px'}}>
      <button disabled={loading} onClick={iterCoin}>Show nearest liquidity</button>
      <button disabled={!tableData.length} onClick={exportToExcel}>
        Export to Excel
      </button>
      {renderTable()}
    </div>
  );
};

export default NewStrategy;
