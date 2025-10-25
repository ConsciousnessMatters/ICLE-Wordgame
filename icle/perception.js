import ActionPercept from './percepts/action-percept.js'
import BoardPercept from './percepts/board-percept.js'
import ChoicePercept from './percepts/choice-percept.js'
import CursorPercept from './percepts/cursor-percept.js'
import TileRackPerception from './percepts/tilerack-percept.js'
import { constants } from './system.js'

export default class Perception {
    _type = constants.type.Perception
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
        this.percepts.choice = undefined
    }

    recordChoice(actionChoice) {
        this.percepts.choice = new ChoicePercept({
            lastPerception: this.lastPerception,
            choice: actionChoice,
        })
    }

    hasChanged() {
        // ToDo: Wire up!
        return this.percepts.board.hasChanged()
            || this.percepts.tileRack.hasChanged()
            || this.percepts.cursor.hasChanged()
            || this.percepts.actionSpace.hasChanged()
            || this.percepts.choice.hasChanged()
    }

    getLastChoice() {
        // ToDo: Did we try and do something last turn? What was it?
        // ToDo: Ensure we can handle an empty action space.
    }
}
