import Grid from '../grid/grid.js'
import Cell from '../cell/cell.js'
import Line from '../grid/line.js'
import Word from '../grid/word.js'
import Column from '../grid/column.js'
import Row from '../grid/row.js'

Line.registerWordClass(Word)

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
            const rowIndex = Math.floor(position / this.columns)
            const columnIndex = position % this.columns

            return new Cell({
                canvasContext: this.canvasContext,
                parent: this,
                rowIndex,
                columnIndex,
                gridOffsetX,
                gridOffsetY: 20,
                rowHeight: this.rowHeight,
                columnWidth: this.columnWidth,
            })
        })
        this.words = words
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

        return areLettersPlaced && isLine && isLineContinuous
    }

    getNewWordTries() {
        const provisionalLine = this.getProvisionalLine()
        const provisionalLetters = provisionalLine.getProvisionalLetters()
        const words = provisionalLetters.reduce((accumulator, cell) => [
            ...accumulator,
            ...cell.getIntersectingWords(),
        ], [])

        // Known good point.

        debugger

        // const words = provisionalLettersGridLocations.map((gridLocation) => gridLocation.)

        const wordsAtLocations = provisionalLettersGridLocations.reduce((accumulator, location) => [
            ...accumulator,
            this.getWordsAtLocation(location),
        ], [])

        const wordTextAtLocations = wordsAtLocations.map((line) => ({
            rowWord: line.rowWord?.toText() ?? null,
            columnWord: line.columnWord?.toText() ?? null,
        }))

        const wordsMade = wordTextAtLocations.reduce((accumulator, wordText) => {
            accumulator.push(wordText.rowWord)
            accumulator.push(wordText.columnWord)
            return accumulator
        }, [])

        debugger
    }

    endTurn() {
        this.isLetterPlacementValid()
        this.getNewWordTries()
        console.debug('End Turn')
    }
}
