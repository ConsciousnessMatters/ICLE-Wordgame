import Percept from './percept.js'
import { constants } from '../system.js'

export default class CursorPercept extends Percept {
    _type = constants.type.CursorPercept

    constructor({
        cursor,
    }) {
        super({
            cursor,
        })

        this.input = cursor
    }
}
