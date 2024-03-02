import * as XLSX from 'xlsx'

export const exportToExcel = <T>(tableData: T[]) => {
  if (!tableData.length) {
    return
  }

  const ws = XLSX.utils.json_to_sheet(tableData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, 'table.xlsx')
}
