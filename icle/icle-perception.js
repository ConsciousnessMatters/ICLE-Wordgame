import ActionSpacePercept from './percepts/action-space-percept.js'
import BoardPercept from './percepts/board-percept.js'
import TileRackPerception from './percepts/grid-percpt.js'
import { constants } from './system.js'

export default class IclePerception {
    _type = constants.type.IclePerception
    _v = constants.v.V1
    id
    sensoryData
    percepts
    boardPerception
    tileRackPerception
    actionSpacePerception

    constructor({
        lastPerception,
        sensoryData,
    }) {
        this.id = crypto.randomUUID()
        this.lastPerception = lastPerception
        this.sensoryData = sensoryData

        this.interpretSensoryData()
    }

    interpretSensoryData() {
        this.percepts.board = new BoardPercept({
            sensoryData: this.sensoryData,
        })
        this.percepts.tileRack = new TileRackPerception({
            sensoryData: this.sensoryData,
        })
        this.percepts.actionables = new ActionSpacePercept({
            lastPerception: this.lastPerception,
            sensoryData: this.sensoryData,
        })
    }
}
