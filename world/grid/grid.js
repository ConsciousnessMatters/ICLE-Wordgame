import Column from '../grid/column.js'
import Row from '../grid/row.js'
import Cell from '../cell/cell.js'
import Letter from '../letter/letter.js'

export default class Grid {
    columns = []
    rows = []
    canvasContext = null

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

    export() {
        return this.cells.reduce((accumulator, cell) => accumulator + cell.export(), '')
    }

    import(configuration) {
        [...configuration].forEach((letter, index) => {
            this.cells[index].addLetter(letter !== '_'  ? new Letter({ canvasContext: this.canvasContext, type: letter }) : null)
            return 
        })
    }

    render() {
        this.cells.forEach((cell) => {
            cell.render()
        })
    }
}
