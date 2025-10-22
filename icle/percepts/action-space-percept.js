import { constants } from '../system.js'
import Percept from './percept.js'

export default class ActionSpacePercept extends Percept {
    _type = constants.type.ActionSpacePercept
    actionables

    constructor({
        lastPerception,
        sensoryData,
    }) {
        this.actionables
    }
}
