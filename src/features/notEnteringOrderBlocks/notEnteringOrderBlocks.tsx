import React from 'react';
import {formattedDate} from "shared/Date/formattedDate";
import {isGreenCandle, isRedCandle} from "utils/actions";
import {useSelector} from "react-redux";
import {selectData} from "features/data/data.selector";
import {TradeEntryAndOrderBlockIndexes} from "features/closingTrade/ClosingTrade";

type Props = {
  enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[]
  orderBlocksIndexes: number[]
}

const NotEnteringOrderBlocks = ({orderBlocksIndexes, enteringCandleIndexes}: Props) => {
  const data = useSelector(selectData)
  if (!data.length) return (<div></div>)

  function findNotEnteringOrderBlocksIndexes(enteringCandleIndexes: TradeEntryAndOrderBlockIndexes[], orderBlocksIndexes: number[]): number[] {
    const result: number[] = [];

    const enteringOrderBlocks = enteringCandleIndexes.map(el => el.orderBlock)
    for (const orderBlockIndex of orderBlocksIndexes) {
      if (enteringOrderBlocks.includes(orderBlockIndex)) {
        continue
      }
      result.push(orderBlockIndex)
    }

    return result;
  }

  const notEnteringOrderBlocksIndexes = findNotEnteringOrderBlocksIndexes(enteringCandleIndexes, orderBlocksIndexes)

  notEnteringOrderBlocksIndexes.forEach(el => {
    // console.log(formattedDate(data[el].openTime))
  })

  const nearestOB = (notEnteringOrderBlocksIndexes: number[]): PercentToEntryPoint => {
    const bearOB: number[] = []
    const bullOB: number[] = []
    const currentPrice = data[data.length - 1].close
    const percentToEntryPoint: PercentToEntryPoint = {
      nearestBearOB: 0,
      nearestBullOB: 0,
    }
    notEnteringOrderBlocksIndexes.forEach(el => {
      const candle = data[el]

      if (isRedCandle(candle)) {
        const nearestBullOB = (candle.high - currentPrice) / currentPrice * 100
        bullOB.push(nearestBullOB)
        console.log('bull OB', nearestBullOB)

      }
      if (isGreenCandle(candle)) {
        const nearestBearOB: number = (candle.low - currentPrice) / currentPrice * 100
        bearOB.push(nearestBearOB)
        console.log('bear OB', nearestBearOB)
      }
    })
    percentToEntryPoint.nearestBullOB = Math.max(...bullOB)
    percentToEntryPoint.nearestBearOB = Math.min(...bearOB)
    return percentToEntryPoint
  }

  nearestOB(notEnteringOrderBlocksIndexes)

  // console.log(nearestOB(notEnteringOrderBlocksIndexes))

  return (
    <div>
    </div>
  );
};

export default NotEnteringOrderBlocks;


export type PercentToEntryPoint = {
  nearestBearOB: number,
  nearestBullOB: number
}
