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

        this.inputs = sensoryData.tileRack.map((input, index) => {
            return this.inputDataTransformer(input, index)
        })
    }

    inputDataTransformer(input, index) {
        // ToDo: Implement change detection.

        return {
            ...input,
            column: index,
        }
    }
}
