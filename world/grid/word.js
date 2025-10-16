import Line, { lineType } from './line.js'

export default class Word extends Line {
    constructor({
        cells,
        lineType,
    }) {
        super({
            cells
        })
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
        const letterScore = this.cells.reduce((accumulator, cell) => accumulator + cell.getLetterValue(), 0)
        const doubleWordBonuses = this.cells.filter((cell) => cell.isDoubleWordCell() && cell.hasProvisionalLetter()).length * 2
        const quadWordBonuses = this.cells.filter((cell) => cell.isQuadWordCell() && cell.hasProvisionalLetter()).length * 4
        const fullMultiplier = Math.max(doubleWordBonuses, 1) * Math.max(quadWordBonuses, 1)
        const score = letterScore * fullMultiplier

        return this.isDictionaryMatch() ? score : 0
    }
}
