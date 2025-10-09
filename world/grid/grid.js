import Cell from '../grid-cell/grid-cell.js'

export default class Grid {
    rows = 15
    columns = 15
    rowHeight = 40
    columnWidth = 40

    constructor(canvasContext) {
        const canvasWidth = canvasContext.canvas.width / 2
        const gridWidth = this.columns * this.columnWidth
        const gridOffsetX = (canvasWidth / 2) - (gridWidth / 2)

        this.canvasContext = canvasContext
        this.cells = Array.from({ length: this.rows }).map((_, row) => {
            return Array.from({ length: this.columns }).map((_, column) => {
                return new Cell({
                    canvasContext: this.canvasContext, 
                    row, 
                    column,
                    gridOffsetX,
                    gridOffsetY: 20,
                    rowHeight: this.rowHeight,
                    columnWidth: this.columnWidth,
                })
            })
        })
    }

    render() {
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                cell.render()
            })
        })
    }
}
