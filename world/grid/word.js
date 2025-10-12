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

    toText() {
        return this.cells.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
    }
}
