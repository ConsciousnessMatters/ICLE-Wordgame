export const lineType = {
    ROW: 'Row',
    COLUMN: 'Column',
}

export default class Line {
    static Word

    static registerWordClass(wordClass) {
        this.Word = wordClass
    }

    cells = null

    constructor({ columnIndex = false, rowIndex = false, cells }) {
        this.columnIndex = columnIndex
        this.rowIndex = rowIndex
        this.cells = cells
        this.rowIndices = this.cells.map((cell) => cell.getRowIndex())
        this.columnIndices = this.cells.map((cell) => cell.getColumnIndex())
        this.text = cells.reduce((accumulator, cell) => accumulator + (cell.getLetterType() ?? '_'), '')

        if (this.rowIndices.length === 0 || this.columnIndices.length === 0) {
            throw new Error('Unable to instantiate line with zero rows or zero columns.')
        }
    }

    getProvisionalLetters() {
        return this.cells.filter((cell) => cell.hasProvisionalLetter())
    }

    getWordFromProvisionalLetters() {
        const firstProvisionalLetterIndex = this.cells.findIndex((cell) => cell.hasProvisionalLetter())
        return this.getWordAtIndex(firstProvisionalLetterIndex)
    }

    containsProvisionalLetters() {
        return this.getProvisionalLetters().length !== 0
    }

    isRow() {
        return false
    }

    isColumn() {
        return false
    }

    getColumnIndex() {
        return this.columnIndex
    }

    getRowIndex() {
        return this.rowIndex
    }

    getKey() {
        return `c${this.columnIndex}r${this.rowIndex}`
    }

    areProvisionalLettersContinuous() {
        const rowIndices = this.getWordFromProvisionalLetters().toArray().map((cell) => cell.getRowIndex())
        const columnIndices = this.getWordFromProvisionalLetters().toArray().map((cell) => cell.getColumnIndex())

        if (rowIndices.length === 0 || columnIndices.length === 0) {
            throw new Error('Unable to check if provisional letters are continuous if there are none.')
        }

        const changingIndices = this.isRow() ? columnIndices : rowIndices
        const changingIndicesContinuous = changingIndices.every((value, index, array) => index === 0 || value === array[index - 1] + 1)

        return changingIndicesContinuous
    }

    areProvisionalLettersGameContinuous() {
        return this.getProvisionalLetters().some((cell) => cell.isGameContinuous())
    }

    getWords() {
        const words = []
        const Word = this.constructor.Word
        let workingWord = []

        const pushNewWord = () => {
            words.push(new Word({
                cells: workingWord,
                lineType: this.isRow() ? lineType.ROW : lineType.COLUMN
            }))
            workingWord = []
        }

        for (const cell of this.cells) {
            if (cell.hasLetter()) {
                workingWord.push(cell)
            } else if (workingWord.length) {
                pushNewWord()
            }
        }

        if (workingWord.length) {
            pushNewWord()
        }

        return words
    }

    getWordAtIndex(index) {
        const words = this.getWords()
        const word = words.find((word) => word.containsLineIndex(index))

        return word
    }

    containsLineIndex(lineIndex) {
        if (! this.cells) {
            return false
        }

        if (this.isRow()) {
            return this.cells.some((cell) => cell.getColumnIndex() === lineIndex)
        } else {
            return this.cells.some((cell) => cell.getRowIndex() === lineIndex)
        }
    }

    toArray() {
        return this.cells
    }

    toText() {
        return this.cells.reduce((accumulator, cell) => accumulator + (cell.getLetterType() ?? '_'), '')
    }
}
