export const constants = {
    type: {
        Icle: 0,
        Kernel: 1,
        Brain: 2,
        Experience: 3,
        Perception: 4,
        Percept: 10,
        BoardPercept: 11,
        TileRackPercept: 12,
        ActionPercept: 13,
        GridPercept: 14,
        CursorPercept: 15,
    },
    v: {
        V1: 1,
    },
    emotions: {
        inactionRegret: 0,
    }
}

export const helpers = {
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
}
