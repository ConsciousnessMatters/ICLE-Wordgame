import GridPercept from './grid-percpt.js'
import { constants } from '../system.js'

export default class BoardPercept extends GridPercept {
    _type = constants.type.BoardPercept
    columnQuantity = 15

    constructor({
        sensoryData,
    }) {
        super({
            sensoryData,
        })

        this.input = sensoryData.board.map(this.cellDataTransformer)
    }

    cellDataTransformer(cell, index) {
        return {
            ...cell,
            column: index % this.columnQuantity,
            row: Math.floor(index / this.columnQuantity),
        }
    }
}
