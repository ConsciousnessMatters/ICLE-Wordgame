export default class GridCell {

    constructor({ 
        canvasContext, 
        row, 
        column, 
        gridOffsetX, 
        gridOffsetY,
        rowHeight,
        columnWidth,
    }) {
        this.canvasContext = canvasContext
        this.row = row
        this.column = column
        this.gridOffsetX = gridOffsetX
        this.gridOffsetY = gridOffsetY
        this.rowHeight = rowHeight
        this.columnWidth = columnWidth
        this.letter = null
    }

    hasLetter() {
        return this.letter !== null
    }

    addLetter(letter) {
        this.letter = letter
    }

    render() {
        console.debug('GridCell render() method.')
        const xOffset = (this.column * this.columnWidth) + this.gridOffsetX
        const yOffset = (this.row * this.rowHeight) + this.gridOffsetY
        const centerCell = this.column === 7 && this.row === 7

        this.canvasContext.lineWidth = 1

        if (centerCell) {
            this.canvasContext.strokeStyle = '#ffffff88'
            this.canvasContext.fillStyle = '#ffffff22';
            this.canvasContext.fillRect(xOffset + 1, yOffset + 1, this.columnWidth - 2, this.rowHeight - 2);
            this.canvasContext.strokeRect(xOffset + 1, yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        } else {
            this.canvasContext.strokeStyle = '#ffffff44'
            this.canvasContext.strokeRect(xOffset + 1, yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)
        }

        if (this.hasLetter()) {
            this.letter.setLocation({
                x: xOffset + 1,
                y: yOffset + 1,
                width: this.columnWidth - 2,
                height: this.rowHeight - 2
            })
            this.letter.render()
        }

        console.debug({
            xOffset,
            yOffset,
        })
    }
}
