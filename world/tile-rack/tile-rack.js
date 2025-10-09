import Cell from '../grid-cell/grid-cell.js'

export default class TileRack {
    rows = 1
    columns = 7
    rowHeight = 40
    columnWidth = 40

    constructor(canvasContext) {
        const canvasWidth = canvasContext.canvas.width / 2
        const canvasHeight = canvasContext.canvas.height / 2
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
                    gridOffsetY: canvasHeight - 60,
                    rowHeight: this.rowHeight,
                    columnWidth: this.columnWidth,
                })
            })
        })
    }

    addLetters(newLetters) {
        newLetters.forEach((newLetter) => {
            this.cells.forEach((row) => {
                row.some((cell) => {
                    if (! cell.hasLetter()) {
                        cell.addLetter(newLetter)
                        return true
                    }
                })
            })
        })
    }

    render() {
        console.debug('Grid render() method.')
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                cell.render()
            })
        })
    }
}
