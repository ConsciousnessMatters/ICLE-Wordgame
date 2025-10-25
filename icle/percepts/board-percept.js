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
        this.inputs = sensoryData.board.map((input, index) => this.addPerceptionsToInput(input, index))
    }

    addPerceptionsToInput(newInput, index) {
        const lastInput = this.lastBoard ? this.lastBoard.inputs[index] : null
        const lastInputWithoutHasChanges = this.getShallowCopyWithoutHasChanged(lastInput)

        const newInputWithoutHasChanges = {
            ...newInput,
            ...this.addCoordinatePerception(index, this.columnQuantity),
        }
        
        return {
            ...newInputWithoutHasChanges,
            hasChanged: this.hasChanged(lastInputWithoutHasChanges, newInputWithoutHasChanges),
        }
    }

    addCoordinatePerception(index, columnQuantity) {
        return {
            column: index % columnQuantity,
            row: Math.floor(index / columnQuantity),
        }
    }

    addShapePerception(index) {

        

        // OMG
        // Include subshapes!!
    }

    addChangePerception(newInput, index) {
        const lastInput = this.lastBoard ? this.lastBoard.inputs[index] : null
        const lastInputWithoutHasChanges = this.getShallowCopyWithoutHasChanged(lastInput)

        const newInputWithoutHasChanges = {
            ...newInput,
            ...this.addCoordinatePerception(index, this.columnQuantity),
        }
        
        return {
            ...newInputWithoutHasChanges,
            hasChanged: this.hasChanged(lastInputWithoutHasChanges, newInputWithoutHasChanges),
        }
    }

    hasChanged() {
        // Implement
    }
}
