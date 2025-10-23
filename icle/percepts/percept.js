import { constants } from '../system.js'

export default class Percept {
    _type = constants.type.Percept
    _v = constants.v.V1

    constructor() {
        this.id = crypto.randomUUID()
    }

    hasChanged(a, b) {
        return ! this.isDeeplyEqual(a, b)
    }

    isDeeplyEqual(a, b) {
        if (a === b) return true
        if (Number.isNaN(a) && Number.isNaN(b)) return true
        if (typeof a !== typeof b || a === null || b === null) return false

        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false
            for (let i = 0; i < a.length; i++) {
                if (! this.isDeeplyEqual(a[i], b[i])) return false
            }
            return true;
        }

        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime()
        }

        if (a instanceof RegExp && b instanceof RegExp) {
            return a.toString() === b.toString()
        }

        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a)
            const keysB = Object.keys(b)
            if (keysA.length !== keysB.length) return false
            for (const key of keysA) {
                if (! Object.prototype.hasOwnProperty.call(b, key)) return false
                if (! this.isDeeplyEqual(a[key], b[key])) return false
            }
            return true
        }

        return false
    }

    getShallowCopyWithoutHasChanged(a) {
        const b = {
            ...a
        }
        delete b.hasChanged
        return b
    }
}
