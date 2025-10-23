import { constants } from '../system.js'

export default class Percept {
    _type = constants.type.Percept
    _v = constants.v.V1

    constructor() {
        this.id = crypto.randomUUID()
    }
}
