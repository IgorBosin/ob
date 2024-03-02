const today = new Date()
today.setHours(0, 0, 0, 0) // Устанавливаем часы, минуты, секунды и миллисекунды в начало дня
// Получаем начало текущего дня в миллисекундах
const startOfDayInMillis = today.getTime()

export const importantDates = {
  today: startOfDayInMillis,
  novemb20year2023: 1700413200000,
  october10year23: 1696525200000,
  september27year23: 1695747600000,
  january01year24: 1704042000000,
  december01year23: 1701363600000,
}
