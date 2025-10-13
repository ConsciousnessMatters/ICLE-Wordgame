import Column from '../grid/column.js'
import Row from '../grid/row.js'

export default class Grid {
    getCellAtPixelLocation({ x, y }) {
        return this.cells.find((cell) => {
            return cell.isAtPixelLocation({ x, y })
        })
    }

    getColumn(columnIndex) {
        return new Column(this.cells.filter((cell) => cell.isAtColumnIndex(columnIndex)))
    }

    getRow(rowIndex) {
        return new Row(this.cells.filter((cell) => cell.isAtRowIndex(rowIndex)))
    }

    getColumns() {
        return Array.from({ length: this.columns }).map((_, column) => {
            return this.getColumn(column)
        })
    }

    getRows() {
        return Array.from({ length: this.rows }).map((_, row) => {
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
