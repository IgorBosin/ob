import React, {useEffect, useState} from 'react';
import {coins} from "features/orderBlockStrategy/coinSelection/coins";
import {setAppError} from "app/app.slice";
import {ErrorType} from "features/orderBlockStrategy/data/data.slice";
import {useDispatch} from "react-redux";
import axios from "axios";
import {ShowDistanceToLiquidity, showDistanceToLiquidity} from "features/findLiquidityStrategy/showDistanceToLiquidity";
import soundFile from "utils/soundFiles/sound.mp3"
import DynamicTable from "shared/Table/DynamicTable";
import {exportToExcel} from "shared/exportToExcel/exportToExcel";

const NewStrategy = () => {
  const [tableData, setTableData] = useState<ShowDistanceToLiquidity[]>([]);
  const [loading, setLoading] = useState(false);
  const currentDateInMillis = new Date().getTime();
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInFiveDays = 6 * millisecondsInDay;
  const [playSound, setPlaySound] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    if (playSound) {
      const audio = new Audio(soundFile);
      audio.volume = 1
      audio.play();
      setPlaySound(false);
    }
  }, [playSound]);

  useEffect(() => {
    // обновляем каждые 2 минуты
    const intervalId = setInterval(iterCoin, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

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
      if (data.some(item => item.percentCurrentPriceBeforeSellside < 0.2)) {
        // Если есть, устанавливаем флаг для воспроизведения звука
        setPlaySound(true);
      }
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

  const columns: Column<ShowDistanceToLiquidity>[] = [
    {label: 'Coin', prop: "coin"},
    {label: 'Buyside Liquidity', prop: "percentBeforeBuyside"},
    {label: 'Sellside Liquidity', prop: 'percentBeforeSellside'},
    {label: 'Nearest Buyside Liquidity', prop: 'percentCurrentPriceBeforeBuyside'},
    {label: 'Nearest Sellside Liquidity', prop: 'percentCurrentPriceBeforeSellside'}
  ];


  return (
    <div style={{margin: 'auto', maxWidth: '1500px', marginBottom: '10px'}}>
      <button disabled={loading} onClick={iterCoin}>Show nearest liquidity</button>
      <button disabled={!tableData.length} onClick={() => exportToExcel(tableData)}>
        Export to Excel
      </button>
      <DynamicTable data={tableData} columns={columns} setData={setTableData}/>
    </div>
  );
};

export default NewStrategy;


export type Column<DataRow> = {
  label: string;
  prop: keyof DataRow;
  style?: React.CSSProperties;
}
