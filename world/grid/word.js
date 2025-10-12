import Line, { lineType } from './line.js'

export default class Word extends Line {
    constructor({
        cells,
        lineType,
    }) {
        super(cells)
        this.text = this.toText()
        this.dictionaryMatch = this.isDictionaryMatch()
        this.score = this.calculateScore()
        this.lineType = lineType
    }

    isRow() {
        return this.lineType === lineType.ROW
    }

    isColumn() {
        return this.lineType === lineType.COLUMN
    }

    getPlacementId() {
        const [ firstCell ] = this.cells
        return `x${firstCell.getColumnIndex()}-y${firstCell.getRowIndex()}-${this.lineType}`
    }

    isDictionaryMatch() {
        const [ firstCell ] = this.cells
        const wordToCheck = this.toText()
        return firstCell.board.words.has(wordToCheck)
    }

    calculateScore() {
        const score = this.cells.reduce((accumulator, cell) => accumulator + cell.getLetterValue(), 0)
        return this.isDictionaryMatch() ? score : 0
    }

    toText() {
        return this.cells.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
    }
}
