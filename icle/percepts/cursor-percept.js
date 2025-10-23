import GridPercept from './grid-percpt.js'
import { constants } from '../system.js'

export default class CursorPercept extends Percept {
    _type = constants.type.CursorPercept

    constructor({
        sensoryData,
    }) {
        super({
            sensoryData,
        })

        this.input = sensoryData.board.map((input, index) => {
            return this.inputDataTransformer(input, index)
        })
    }

    inputDataTransformer(input, index) {
        return {
            ...input,
        }
    }
}
