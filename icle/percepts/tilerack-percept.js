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

        this.inputs = sensoryData.board.map((input, index) => {
            return this.inputDataTransformer(input, index)
        })
    }

    inputDataTransformer(input, index) {
        return {
            ...input,
            column: index,
        }
    }
}
