import React, { useState } from 'react'
import { formattedDate } from 'shared/Date/formattedDate'

export type Column<DataRow> = {
  label: string
  prop: keyof DataRow
  date?: boolean
  style?: React.CSSProperties
}

export type Props<DataRowType> = {
  columns: Column<DataRowType>[]
  data: DataRowType[]
  setData: React.Dispatch<React.SetStateAction<DataRowType[]>>
}

const DynamicTable = <DataRowType extends Record<string, string | number>>({ columns, data, setData }: Props<DataRowType>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataRowType | null
    direction: 'asc' | 'desc'
  }>({
    key: null,
    direction: 'asc',
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
    setSortConfig({ key, direction })
  }

  const renderHeaders = () => (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th onClick={() => sortByColumn(column.prop)} key={index}>
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
            <td key={colIndex} style={{ color: row[column.prop] === 'BTC' ? 'red' : 'inherit' }}>
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
