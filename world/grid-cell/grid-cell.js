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
    }

    render() {
        console.debug('GridCell render() method.')
        const xOffset = (this.row * this.columnWidth) + this.gridOffsetX
        const yOffset = (this.column * this.rowHeight) + this.gridOffsetY

        this.canvasContext.lineWidth = 1
        this.canvasContext.strokeStyle = '#ffffff44'
        this.canvasContext.strokeRect(xOffset + 1, yOffset + 1, this.columnWidth - 2, this.rowHeight - 2)

        console.debug({
            xOffset,
            yOffset,
        })
    }
}
