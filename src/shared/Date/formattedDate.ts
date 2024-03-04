import dayjs from 'dayjs'

export const formattedDate = (date: number) => {
  return dayjs(date).format('DD.MM.YY HH:mm')
}
