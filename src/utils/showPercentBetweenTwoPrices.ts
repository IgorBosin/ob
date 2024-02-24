export const showPercentToTopPrice = (highPrice: number, lowPrice: number) => {
  return +((highPrice - lowPrice) / lowPrice *100 ).toFixed(2)
}


export const showPercentToLowerPrice = (highPrice: number, lowPrice: number) => {
  return +((highPrice - lowPrice) / highPrice*100 ).toFixed(2)
}

