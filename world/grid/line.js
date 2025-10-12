export default class Line {
    cells = null

    constructor(cells) {
        this.cells = cells
        this.rowIndices = this.cells.map((cell) => cell.getRowIndex())
        this.columnIndices = this.cells.map((cell) => cell.getColumnIndex())

        if (this.rowIndices.length === 0 || this.columnIndices.length === 0) {
            throw new Error('Unable to instantiate line with zero rows or zero columns.')
        }
    }

    getProvisionalLetters() {
        return this.cells.filter((cell) => cell.hasProvisionalLetter())
    }

    containsProvisionalLetters() {
        return this.getProvisionalLetters().length !== 0
    }

    isRow() {
        return new Set(this.rowIndices).size === 1
    }

    isColumn() {
        return ! this.isRow()
    }

    areProvisionalLettersContinuous() {
        const rowIndices = this.getProvisionalLetters().map((cell) => cell.getRowIndex())
        const columnIndices = this.getProvisionalLetters().map((cell) => cell.getColumnIndex())

        if (rowIndices.length === 0 || columnIndices.length === 0) {
            throw new Error('Unable to check if provisional letters are continuous if there are none.')
        }

        const changingIndices = this.isRow() ? columnIndices : rowIndices
        const changingIndicesContinuous = changingIndices.every((value, index, array) => index === 0 || value === array[index - 1] + 1)

        return changingIndicesContinuous
    }

    getWords() {
        const words = []
        let workingWord = []

        for (const cell of this.cells) {
            if (cell.hasLetter()) {
                workingWord.push(cell)
            } else if (workingWord.length) {
                words.push(new Line(workingWord))
                workingWord = []
            }
        }

        if (workingWord.length) {
            words.push(workingWord)
        }

        return words
    }

    getWordAtIndex(index) {
        const words = this.getWords()
        return words.find((word) => word.startsLineIndex(index))
    }

    startsLineIndex(lineIndex) {
        if (! this.cells) {
            return false
        }

        const [ firstCell ] = this.cells

        if (this.isRow()) {
            return firstCell.getColumnIndex() === lineIndex
        } else {
            return firstCell.getRowIndex() === lineIndex
        }
    }

    toText() {
        return this.cells.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
    }
}
