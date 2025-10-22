import GridPercept from './grid-percpt.js'
import { constants } from '../system.js'

export default class TileRackPercept extends GridPercept {
    _type = constants.type.TileRackPercept

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
            column: index,
        }
    }
}
