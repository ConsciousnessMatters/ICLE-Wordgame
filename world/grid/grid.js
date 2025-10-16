import Column from '../grid/column.js'
import Row from '../grid/row.js'

export default class Grid {
    columns = []
    rows = []

    getCellAtPixelLocation({ x, y }) {
        return this.cells.find((cell) => {
            return cell.isAtPixelLocation({ x, y })
        })
    }

    getColumn(columnIndex) {
        if (! this.columns[columnIndex]) {
            this.columns[columnIndex] = new Column({
                columnIndex,
                cells: this.cells.filter((cell) => cell.isAtColumnIndex(columnIndex)),
            })
        }
        return this.columns[columnIndex]
    }

    getRow(rowIndex) {
        if (! this.rows[rowIndex]) {
            this.rows[rowIndex] = new Row({
                rowIndex,
                cells: this.cells.filter((cell) => cell.isAtRowIndex(rowIndex)),
            })
        }
        return this.rows[rowIndex]
    }

    getColumns() {
        return Array.from({ length: this.columnQuantity }).map((_, column) => {
            return this.getColumn(column)
        })
    }

    getRows() {
        return Array.from({ length: this.rowQuantity }).map((_, row) => {
            return this.getRow(row)
        })
    }

    getCell({ columnIndex, rowIndex }) {
        const cell = this.cells.find((cell) => cell.getColumnIndex() === columnIndex && cell.getRowIndex() === rowIndex)
        return cell
    }

    render() {
        this.cells.forEach((cell) => {
            cell.render()
        })
    }
}
