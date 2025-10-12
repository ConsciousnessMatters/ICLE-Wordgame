import Grid from '../grid/grid.js'
import Cell from '../cell/cell.js'
import Line, { lineType } from '../grid/line.js'
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
                board: this,
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

        const uniqueWordIds = new Set()
        const words = provisionalLetters.reduce((accumulator, cell) => {
            const intersectingWords = cell.getIntersectingWords()

            const dedupedIntersectingWords = intersectingWords.filter((intersectingWord) => {
                const placementId = intersectingWord.getPlacementId()
                if (! uniqueWordIds.has(placementId)) {
                    uniqueWordIds.add(placementId)
                    return true
                }
                return false
            })

            const filterType = (provisionalLine instanceof Row) ? lineType.COLUMN : lineType.ROW

            const filterOrthogonal = dedupedIntersectingWords.filter((intersectingWord) => {
                // ToDo: Score could be factored in here to allow one word orthogonal plays
                return ! (intersectingWord.lineType === filterType && intersectingWord.cells.length === 1)
            })

            return [
                ...accumulator,
                ...filterOrthogonal,
            ]
        }, [])

        return words
    }

    areAllWordsValid(words) {
        return words.length ? words.every((word) => word.dictionaryMatch) : false
    }

    commitBoardTiles() {
        this.cells.forEach((cell) => cell.commit())
    }

    rollbackBoardTiles() {
        this.cells.forEach((cell) => cell.rollback())
    }

    endTurn() {
        const placementValid = this.isLetterPlacementValid()
        const words = this.getNewWordTries()
        const areAllWordsValid = this.areAllWordsValid(words)

        if (placementValid && areAllWordsValid) {
            this.commitBoardTiles()
            console.debug('Good')
        } else {
            this.rollbackBoardTiles()
            console.debug('Bad')
        }

        console.debug('End Turn')
    }
}
