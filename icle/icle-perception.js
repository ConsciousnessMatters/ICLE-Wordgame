import ActionPercept from './percepts/action-percept.js'
import BoardPercept from './percepts/board-percept.js'
import CursorPercept from './percepts/cursor-percept.js'
import TileRackPerception from './percepts/tilerack-percept.js'
import { constants } from './system.js'

export default class IclePerception {
    _type = constants.type.IclePerception
    _v = constants.v.V1
    id
    sensoryData
    cursor
    percepts = {}

    constructor({
        lastPerception,
        sensoryData,
        cursor,
    }) {
        this.id = crypto.randomUUID()
        this.lastPerception = lastPerception
        this.sensoryData = sensoryData
        this.cursor = cursor

        this.interpretSensoryData()
    }

    interpretSensoryData() {
        this.percepts.board = new BoardPercept({
            lastPerception: this.lastPerception,
            sensoryData: this.sensoryData,
        })
        this.percepts.tileRack = new TileRackPerception({
            lastPerception: this.lastPerception,
            sensoryData: this.sensoryData,
        })
        this.percepts.cursor = new CursorPercept({
            lastPerception: this.lastPerception,
            cursor: this.cursor,
        })
        this.percepts.actionSpace = new ActionPercept({
            lastPerception: this.lastPerception,
            sensoryData: this.sensoryData,
        })
    }
}
