export default class Cell {

    constructor({ 
        canvasContext,
        board,
        rowIndex,
        columnIndex,
        gridOffsetX, 
        gridOffsetY,
        rowHeight,
        columnWidth,
    }) {
        this.canvasContext = canvasContext
        this.board = board
        this.rowIndex = rowIndex
        this.columnIndex = columnIndex
        this.gridOffsetX = gridOffsetX
        this.gridOffsetY = gridOffsetY
        this.rowHeight = rowHeight
        this.columnWidth = columnWidth
        this.letter = null
        this.xOffset = (this.columnIndex * this.columnWidth) + this.gridOffsetX
        this.yOffset = (this.rowIndex * this.rowHeight) + this.gridOffsetY
    }

    hasLetter() {
        return this.letter !== null
    }

    hasLetterAdjacent({ columnOffset, rowOffset }) {
        const cell = this.getAdjacentCell({ columnOffset, rowOffset })

        if (cell) {
            return cell.hasLetter()
        } else {
            return false
        }
    }

    hasLetterAbove() {
        return this.hasLetterAdjacent({ columnOffset: 0, rowOffset: - 1 })
    }

    hasLetterBelow() {
        return this.hasLetterAdjacent({ columnOffset: 0, rowOffset: + 1 })
    }

    hasLetterToLeft() {
        return this.hasLetterAdjacent({ columnOffset: - 1, rowOffset: 0 })
    }

    hasLetterToRight() {
        return this.hasLetterAdjacent({ columnOffset: + 1, rowOffset: 0 })
    }

    hasProvisionalLetter() {
        return this.hasLetter() && this.letter.hasTurnRollBackCell()
    }

    addLetter(letter) {
        this.letter = letter
    }

    removeLetter() {
        const letter = this.letter
        this.letter = null
        return letter
    }

    getLetterType() {
        return this.letter ? this.letter.getType() : null
    }

    getLetterValue() {
        return this.letter ? this.letter.getValue() : null
    }

    isAtPixelLocation({ x, y }) {
        const x1 = this.xOffset
        const x2 = this.xOffset + this.columnWidth
        const y1 = this.yOffset
        const y2 = this.yOffset + this.rowHeight

        const withinX = x >= x1 && x <= x2
        const withinY = y >= y1 && y <= y2

        return withinX && withinY
    }

    isAtColumnIndex(columnIndex) {
        return this.columnIndex === columnIndex
    }

    isAtRowIndex(rowIndex) {
        return this.rowIndex === rowIndex
    }

    isValidColumnIndex(columnIndex) {
        return columnIndex <= this.board.columns &&
            columnIndex >= 0
    }

    isValidRowIndex(rowIndex) {
        return rowIndex <= this.board.rows &&
            rowIndex >= 0
    }

    isStartCell() {
        return this.columnIndex === 7 && this.rowIndex === 7
    }

    isContinuityCell() {
        return 
    }

    getColumnIndex() {
        return this.columnIndex
    }

    getRowIndex() {
        return this.rowIndex
    }

    getColumn() {
        return this.board.getColumn(this.columnIndex)
    }

    getRow() {
        return this.board.getRow(this.rowIndex)
    }

    getAdjacentCell({ columnOffset, rowOffset }) {
        const columnIndex = this.isValidColumnIndex(this.columnIndex + columnOffset) ? this.columnIndex + columnOffset : null
        const rowIndex = this.isValidRowIndex(this.rowIndex + rowOffset) ? this.rowIndex + rowOffset : null

        if (rowIndex === null || columnIndex === null) {
            return null
        } else {
            return this.board.getCell({ columnIndex, rowIndex })
        }
    }

    getIntersectingWords() {
        const rowWord = this.getRow().getWordAtIndex(this.columnIndex)
        const columnWord = this.getColumn().getWordAtIndex(this.rowIndex)

        return [
            rowWord,
            columnWord,
        ]
    }

    commit() {
        if (this.letter) this.letter.commit()
    }

    rollback() {
        if (this.letter) this.letter.rollback(this)
    }

    render() {
        this.canvasContext.lineWidth = 1

        if (this.isStartCell()
            || this.hasLetter()
            || this.hasLetterAbove()
            || this.hasLetterBelow()
            || this.hasLetterToLeft()
            || this.hasLetterToRight()
        ) {
            this.canvasContext.strokeStyle = '#ffffff88'
            this.canvasContext.fillStyle = '#ffffff22';
            this.canvasContext.fillRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2);
            this.canvasContext.strokeRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        } else {
            this.canvasContext.strokeStyle = '#ffffff44'
            this.canvasContext.strokeRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        }

        if (this.hasLetter()) {
            this.letter.setLocation({
                x: this.xOffset + 1,
                y: this.yOffset + 1,
                width: this.columnWidth - 2,
                height: this.rowHeight - 2
            })
            this.letter.render()
        }
    }
}
