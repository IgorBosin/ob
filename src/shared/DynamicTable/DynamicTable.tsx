import React, { useEffect, useState } from 'react'

import { formattedDate } from '@/shared/Date/formattedDate'

export type Column<DataRow> = {
  date?: boolean
  label: string
  prop: keyof DataRow
  style?: React.CSSProperties
}

export type Props<DataRowType> = {
  columns: Column<DataRowType>[]
  data: DataRowType[]
  setData: React.Dispatch<React.SetStateAction<DataRowType[]>>
}

const DynamicTable = <DataRowType extends Record<string, number | string>>({
  columns,
  data,
  setData,
}: Props<DataRowType>) => {
  const lastColumnProp = columns[columns.length - 1].prop

  useEffect(() => {
    if (data[0]) {
      if (
        data[0].percentCurrentPriceBeforeSellside > data[1].percentCurrentPriceBeforeSellside ||
        data[1].percentCurrentPriceBeforeSellside > data[2].percentCurrentPriceBeforeSellside
      ) {
        sortByColumn(lastColumnProp)
      }
    }
  })

  const [sortConfig, setSortConfig] = useState<{
    direction: 'asc' | 'desc'
    key: keyof DataRowType | null
  }>({
    direction: 'asc',
    key: lastColumnProp,
  })

  const sortByColumn = (key: keyof DataRowType) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1
      }

      return 0
    })

    setData(sortedData)
    setSortConfig({ direction, key })
  }

  const renderHeaders = () => (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th key={index} onClick={() => sortByColumn(column.prop)}>
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  )

  const renderRows = () => (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              style={{
                color: row[column.prop] === 'BTC' || +row[column.prop] < 0.2 ? 'red' : 'inherit',
              }}
            >
              {column.date ? formattedDate(+row[column.prop]) : row[column.prop]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )

  return (
    <table style={{ border: '1px solid #ddd', textAlign: 'center', width: '100%' }}>
      {renderHeaders()}
      {renderRows()}
    </table>
  )
}

export default DynamicTable
