import Grid from '../grid/grid.js'
import Cell from '../cell/cell.js'

export default class TileRack extends Grid {
    rowQuantity = 1
    columnQuantity = 7
    rowHeight = 40
    columnWidth = 40

    constructor({ canvasContext }) {
        super()
        const canvasWidth = canvasContext.canvas.width / 2
        const canvasHeight = canvasContext.canvas.height / 2
        const gridWidth = this.columnQuantity * this.columnWidth
        const gridOffsetX = (canvasWidth / 2) - (gridWidth / 2)

        this.canvasContext = canvasContext
        this.cells = Array.from({ length: this.rowQuantity * this.columnQuantity }).map((_, position) => {
            const rowIndex = Math.floor(position / this.columnQuantity)
            const columnIndex = position % this.columnQuantity

            return new Cell({
                canvasContext: this.canvasContext,
                board: this,
                rowIndex,
                columnIndex,
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

    countTilesShort() {
        return this.cells.filter((cell) => {
            if (! cell.hasLetter()) {
                return true
            }
        }).length
    }
}
