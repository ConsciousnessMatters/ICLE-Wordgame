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
        let allPossibleActions = []

        for (const [key, possibilities] of Object.entries(actionSpace)) {
            if (Array.isArray(possibilities)) {
                allPossibleActions = [
                    ...allPossibleActions,
                    ...possibilities,
                ]
            } else if (typeof possibilities === 'string') {
                allPossibleActions = [
                    ...allPossibleActions,
                    possibilities,
                ]
            } else {
                throw new Error('Unexpected Action Input')
            }
        }

        return allPossibleActions
    }
}
