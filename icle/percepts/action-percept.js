import { constants } from '../system.js'
import Percept from './percept.js'

export default class ActionPercept extends Percept {
    _type = constants.type.ActionPercept
    actions = []

    constructor({
        lastPerception,
        sensoryData,
    }) {
        super()
        this.actions = this.actionDataTransformer(sensoryData.actionSpace)
    }

    actionDataTransformer(actionSpace) {
        return [
            ...actionSpace.moveableLetters,
            ...actionSpace.destinations,
            actionSpace.endTurn,
        ]
    }
}
