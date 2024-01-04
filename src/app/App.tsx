import React, {useState} from 'react';
import './App.css';
import {ErrorSnackbar} from "shared/ErrorSnackbar/ErrorSnackbar";
import Data from "features/data/Data";
import FindOb from "features/findOB/findOB";

const App = () => {
  // console.log('Компонент App перерисован')

  const [candlesNumber, setCandlesNumber] = useState(5)



  return (
    <div>
      <Data/>
      <ErrorSnackbar/>
      <FindOb candlesNumber={candlesNumber}/>
    </div>
  );
};

export default App;
