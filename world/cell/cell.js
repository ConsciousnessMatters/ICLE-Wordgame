export default class Cell {

    constructor({ 
        canvasContext,
        parent,
        rowIndex,
        columnIndex,
        gridOffsetX, 
        gridOffsetY,
        rowHeight,
        columnWidth,
    }) {
        this.canvasContext = canvasContext
        this.parent = parent
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

    getColumnIndex() {
        return this.columnIndex
    }

    getRowIndex() {
        return this.rowIndex
    }

    getColumn() {
        return this.parent.getColumn(this.columnIndex)
    }

    getRow() {
        return this.parent.getRow(this.rowIndex)
    }

    getIntersectingWords() {
        const columnWord = this.getColumn().getWordAtIndex(this.rowIndex)
        const rowWord = this.getRow().getWordAtIndex(this.columnIndex)

        return [
            columnWord,
            rowWord,
        ]
    }

    render() {
        const centerCell = this.columnIndex === 7 && this.rowIndex === 7

        this.canvasContext.lineWidth = 1

        if (centerCell) {
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
