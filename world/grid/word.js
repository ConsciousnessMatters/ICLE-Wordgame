import Line, { lineType } from './line.js'

export default class Word extends Line {
    constructor({
        cells,
        lineType,
    }) {
        super(cells)
        this.text = cells.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
        this.lineType = lineType
    }

    isRow() {
        return this.lineType === lineType.ROW
    }

    isColumn() {
        return this.lineType === lineType.COLUMN
    }

    getPlacementId() {
        const [ firstCell ] = this.cells
        return `x${firstCell.getColumnIndex()}-y${firstCell.getRowIndex()}-${this.lineType}`
    }

    toText() {
        return this.cells.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
    }
}
