import Grid from '../grid/grid.js'
import Cell from '../cell/cell.js'
import Line, { lineType } from '../grid/line.js'
import Word from '../grid/word.js'
import Row from '../grid/row.js'

Line.registerWordClass(Word)

export default class Board extends Grid {
    rowQuantity = 15
    columnQuantity = 15
    rowHeight = 40
    columnWidth = 40
    words = null
    world = null

    constructor({ canvasContext, words, world }) {
        super()
        const canvasWidth = canvasContext ? (canvasContext.canvas.width / 2) : 1920
        const gridWidth = this.columnQuantity * this.columnWidth
        const gridOffsetX = (canvasWidth / 2) - (gridWidth / 2)

        this.canvasContext = canvasContext
        this.cells = Array.from({ length: this.rowQuantity * this.columnQuantity }).map((_, position) => {
            const rowIndex = Math.floor(position / this.columnQuantity)
            const columnIndex = position % this.columnQuantity

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
        this.world = world
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
        const isGameContinuous = isLine && provisionalLine.areProvisionalLettersGameContinuous()

        return areLettersPlaced && isLine && isLineContinuous && isGameContinuous
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

    scoreWords(words) {
        return words.length ? words.reduce((accumulator, word) => accumulator + word.calculateScore(), 0) : 0
    }

    commitBoardTiles() {
        this.cells.forEach((cell) => cell.commit())
    }

    rollbackBoardTiles() {
        this.cells.forEach((cell) => cell.rollback())
    }

    endTurn() {
        const placementValid = this.isLetterPlacementValid()

        if (placementValid) {
            const words = this.getNewWordTries()
            const areAllWordsValid = this.areAllWordsValid(words)
            const score = this.scoreWords(words)

            if (areAllWordsValid) {
                this.commitBoardTiles()
                console.debug(`Tiles committed for round ${this.world.returnTurn().getRoundNumber()}, turn ${this.world.returnTurn().getTurnNumber()}.`)
                return score
            } else {
                this.rollbackBoardTiles()
                console.debug(`Tiles rejected (Not All Words Valid) for round ${this.world.returnTurn().getRoundNumber()}, turn ${this.world.returnTurn().getTurnNumber()}.`)
                return 0
            }
        } else {
            this.rollbackBoardTiles()
            console.debug(`Tiles rejected (Inavlid Placement) for round ${this.world.returnTurn().getRoundNumber()}, turn ${this.world.returnTurn().getTurnNumber()}.`)
            return 0
        }
    }
}
