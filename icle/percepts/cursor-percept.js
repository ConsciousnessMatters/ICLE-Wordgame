import Percept from './percept.js'
import { constants } from '../system.js'

export default class CursorPercept extends Percept {
    _type = constants.type.CursorPercept
    lastCursor

    constructor({
        lastPerception,
        cursor,
    }) {
        super({
            cursor,
        })

        this.lastCursor = lastPerception?.percepts?.cursor ?? null
        this.cursor = this.cursorDataTransformer(cursor)
    }

    cursorDataTransformer(newCursor) {
        const lastCursor = this.lastCursor ? this.lastCursor.cursor : null
        const lastCursorWithoutHasChanges = this.getShallowCopyWithoutHasChanged(lastCursor)

        const newCursorWithoutHasChanges = {
            ...newCursor,
        }

        return {
            ...newCursorWithoutHasChanges,
            hasChanged: this.hasChanged(lastCursorWithoutHasChanges, newCursorWithoutHasChanges),
        }
    }
}
