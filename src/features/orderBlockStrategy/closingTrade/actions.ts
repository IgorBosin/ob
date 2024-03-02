export function showMaxZeroInRow(arr: number[]) {
  let maxZeros = 0
  let currentZeros = 0

  for (let num of arr) {
    if (num === 0) {
      currentZeros++
      maxZeros = Math.max(maxZeros, currentZeros)
    } else {
      currentZeros = 0
    }
  }

  return maxZeros
}
