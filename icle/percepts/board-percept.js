import GridPercept from './grid-percpt.js'
import { constants } from '../system.js'

export default class BoardPercept extends GridPercept {
    _type = constants.type.BoardPercept
    columnQuantity = 15
    lastBoard

    constructor({
        lastPerception,
        sensoryData,
    }) {
        super()

        this.lastBoard = lastPerception?.percepts?.board ?? null
        this.inputs = sensoryData.board.map((input, index) => {
            return this.inputDataTransformer(input, index)
        })
    }

    inputDataTransformer(newInput, index) {
        const lastInput = this.lastBoard ? this.lastBoard.inputs[index] : null
        const lastInputWithoutHasChanges = this.getShallowCopyWithoutHasChanged(lastInput)

        const newInputWithoutHasChanges = {
            ...newInput,
            column: index % this.columnQuantity,
            row: Math.floor(index / this.columnQuantity),
        }

        return {
            ...newInputWithoutHasChanges,
            hasChanged: this.hasChanged(lastInputWithoutHasChanges, newInputWithoutHasChanges),
        }
    }
}
