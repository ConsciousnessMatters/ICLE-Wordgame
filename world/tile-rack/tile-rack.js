import Grid from '../grid/grid.js'
import Cell from '../cell/cell.js'

export default class TileRack extends Grid {
    rows = 1
    columns = 7
    rowHeight = 40
    columnWidth = 40

    constructor({ canvasContext }) {
        super()
        const canvasWidth = canvasContext.canvas.width / 2
        const canvasHeight = canvasContext.canvas.height / 2
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
                gridOffsetY: canvasHeight - 60,
                rowHeight: this.rowHeight,
                columnWidth: this.columnWidth,
            })
        })
    }

    addLetters(newLetters) {
        newLetters.forEach((newLetter) => {
            this.cells.some((cell) => {
                    if (! cell.hasLetter()) {
                        cell.addLetter(newLetter)
                        return true
                    }
                })
        })
    }
}
