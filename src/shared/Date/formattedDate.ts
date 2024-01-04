import {format} from "date-fns";

export const formattedDate = (date: number) => {
  const getDate = new Date(date);
  return format(getDate, 'dd.MM.yy HH:mm:ss')
}
