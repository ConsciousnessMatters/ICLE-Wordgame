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

    hasComittedLetter() {
        return this.letter !== null && this.letter.isComitted()
    }

    hasLetterAdjacent({ columnOffset, rowOffset }) {
        const cell = this.getAdjacentCell({ columnOffset, rowOffset })

        if (cell) {
            return cell.hasComittedLetter()
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
        const cellMultiplier = this.isQuadLetterCell() ? 4 : 1
        return this.letter ? (this.letter.getValue() * cellMultiplier) : null
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
        return columnIndex <= this.board.columnQuantity &&
            columnIndex >= 0
    }

    isValidRowIndex(rowIndex) {
        return rowIndex <= this.board.rowQuantity &&
            rowIndex >= 0
    }

    isStartCell() {
        return this.columnIndex === 7 && this.rowIndex === 7
    }

    isQuadWordCell() {
        return [
            '0x0',
            '7x0',
            '14x0',
            '0x7',
            '14x7',
            '0x14',
            '7x14',
            '14x14',
        ].includes(`${this.columnIndex}x${this.rowIndex}`)
    }

    isDoubleWordCell() {
        return [
            '2x5',
            '3x4',
            '4x3',
            '5x2',
            '2x9',
            '3x10',
            '4x11',
            '5x12',
            '12x5',
            '11x4',
            '10x3',
            '9x2',
            '12x9',
            '11x10',
            '10x11',
            '9x12',
            '7x7',
        ].includes(`${this.columnIndex}x${this.rowIndex}`)
    }

    isQuadLetterCell() {
        return [
            '5x6',
            '6x5',
            '8x5',
            '9x6',
            '5x8',
            '6x9',
            '8x9',
            '9x8',
        ].includes(`${this.columnIndex}x${this.rowIndex}`)
    }

    isGameContinuous() {
        return this.isStartCell()
            || this.hasLetterAbove()
            || this.hasLetterBelow()
            || this.hasLetterToLeft()
            || this.hasLetterToRight()
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

    getCellLocationKey() {
        return `${this.columnIndex}x${this.rowIndex}`
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

        if (this.isStartCell()) {
            this.canvasContext.strokeStyle = '#ffffff88'
            this.canvasContext.fillStyle = '#ffffff22'
            this.canvasContext.fillRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
            this.canvasContext.strokeRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        } else if (this.isQuadWordCell()) {
            this.canvasContext.strokeStyle = '#00ff0088'
            this.canvasContext.fillStyle = '#00ff0044'
            this.canvasContext.fillRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
            this.canvasContext.strokeRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        } else if (this.isDoubleWordCell()) {
            this.canvasContext.strokeStyle = '#00880088'
            this.canvasContext.fillStyle = '#00880044'
            this.canvasContext.fillRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
            this.canvasContext.strokeRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        } else if (this.isQuadLetterCell()) {
            this.canvasContext.strokeStyle = '#ff00ff88'
            this.canvasContext.fillStyle = '#ff00ff22'
            this.canvasContext.fillRect(this.xOffset + 1, this.yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
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
