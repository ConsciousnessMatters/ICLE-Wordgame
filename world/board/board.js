import Grid from '../grid/grid.js'
import Cell from '../cell/cell.js'
import Column from '../grid/column.js'
import Row from '../grid/row.js'

export default class Board extends Grid {
    rows = 15
    columns = 15
    rowHeight = 40
    columnWidth = 40
    words = null

    constructor({ canvasContext, words }) {
        super()
        const canvasWidth = canvasContext.canvas.width / 2
        const gridWidth = this.columns * this.columnWidth
        const gridOffsetX = (canvasWidth / 2) - (gridWidth / 2)

        this.canvasContext = canvasContext
        this.cells = Array.from({ length: this.rows * this.columns }).map((_, position) => {
            const row = Math.floor(position / this.columns)
            const column = position % this.columns

            return new Cell({
                canvasContext: this.canvasContext,
                row,
                column,
                gridOffsetX,
                gridOffsetY: 20,
                rowHeight: this.rowHeight,
                columnWidth: this.columnWidth,
            })
        })
        this.words = words
    }

    getColumn(columnNumber) {
        return new Column(this.cells.filter((cell) => cell.isAtColumn(columnNumber)))
    }

    getRow(rowNumber) {
        return new Row(this.cells.filter((cell) => cell.isAtRow(rowNumber)))
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

    getColumnsAndRowsWithProvisionalLetters() {
        const columnsWithProvisionalLetters = this.getColumns().filter((column) => column.containsProvisionalLetters())
        const rowsWithProvisionalLetters = this.getRows().filter((row) => row.containsProvisionalLetters())

        return {
            columnsWithProvisionalLetters,
            rowsWithProvisionalLetters,
        }
    }

    getProvisionalLine() {
        const { columnsWithProvisionalLetters, rowsWithProvisionalLetters } = this.getColumnsAndRowsWithProvisionalLetters()
        const [ provisionalLine ] = columnsWithProvisionalLetters.length === 1 ? columnsWithProvisionalLetters : rowsWithProvisionalLetters
        return provisionalLine
    }

    isLetterPlacementValid() {
        const { columnsWithProvisionalLetters, rowsWithProvisionalLetters } = this.getColumnsAndRowsWithProvisionalLetters()
        const areLettersPlaced = columnsWithProvisionalLetters.length !== 0
        const isLine = ! (columnsWithProvisionalLetters.length > 1 && rowsWithProvisionalLetters.length > 1) &&
            (columnsWithProvisionalLetters.length !== 0 && rowsWithProvisionalLetters.length !== 0)
        const provisionalLine = this.getProvisionalLine()
        const isLineContinuous = isLine && provisionalLine.areProvisionalLettersContinuous()

        // debugger

        return areLettersPlaced && isLine && isLineContinuous
    }

    getWordsAtLocation({ x, y }) {
        const row = this.getRow(y)
        const column = this.getColumn(x)

        return {
            rowWord: row.getWordAtIndex(x),
            columnWord: column.getWordAtIndex(y),
        }
    }

    getNewWordTries() {
        const provisionalLine = this.getProvisionalLine()
        const provisionalLettersCellLocations = provisionalLine.getProvisionalLettersCellGridLocations()

        const wordsAtLocations = provisionalLettersCellLocations.map((location) => this.getWordsAtLocation(location))

        debugger
    }

    endTurn() {
        this.isLetterPlacementValid()
        this.getNewWordTries()
        console.debug('End Turn')
    }
}
