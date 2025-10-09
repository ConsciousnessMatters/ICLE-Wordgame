import Grid from '../grid/grid.js'
import Cell from '../board-cell/board-cell.js'

export default class Board extends Grid {
    rows = 15
    columns = 15
    rowHeight = 40
    columnWidth = 40

    constructor(canvasContext) {
        super()
        const canvasWidth = canvasContext.canvas.width / 2
        const gridWidth = this.columns * this.columnWidth
        const gridOffsetX = (canvasWidth / 2) - (gridWidth / 2)

        this.canvasContext = canvasContext
        this.cells = Array.from({ length: this.rows * this.columns }).map((_, position) => {
            const row = Math.floor(position / this.columns)
            const column = position % this.columns

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
    }
}
