import { constants, helpers } from '../system.js'

export default class Percept {
    _type = constants.type.Percept
    _v = constants.v.V1

    constructor() {
        this.id = crypto.randomUUID()
    }

    hasChanged(a, b) {
        return ! helpers.isDeeplyEqual(a, b)
    }

    getShallowCopyWithoutHasChanged(a) {
        const b = {
            ...a
        }
        delete b.hasChanged
        return b
    }
}
