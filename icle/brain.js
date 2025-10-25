import Perception from './perception.js'
import Experience from './experience.js'
import { constants, helpers } from './system.js'
import { sharedSystem } from '../world/shared-system.js'

export default class Brain {
    _type = constants.type.Brain
    _v = constants.v.V1
    id
    kernel
    icleRoot
    lastExperience = null
    experience = null
    lastPerception = null
    perception = null
    cursor = {}

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignKernel(kernel) {
        this.kernel = kernel
    }

    assignIcle(icleRoot) {
        this.icleRoot = icleRoot
    }
    
    input(sensoryData) {
        this.perception = new Perception({
            lastPerception: this.lastPerception,
            sensoryData,
            cursor: this.cursor,
        })
        this.experience = new Experience({
            lastExperience: this.lastExperience,
            perception: this.perception,
        })
        
        const actionChoice = this.kernel.input(this.experience)
        this.perception.recordChoice(actionChoice)

        this.lastPerception = this.perception
        this.lastExperience = this.experience
        this.output(actionChoice)
    }

    output(actionChoice) {
        const tileRackCount = 7
        const boardCount = 225
        const endTurnCount = 1
        const actions = this.perception.percepts.actionSpace.actions

        if (actions.length === 0) {
            // Do Nothing
        } else if (actionChoice < tileRackCount) {
            if (helpers.isDeeplyEqual(this.cursor, {})) {
                this.cursor = actions[actionChoice]
                console.debug('Cursor Now Occupied')
            } else {
                // Do Nothing
                console.debug('Nothing: Cannot fill occupied cursor.')
            }
        } else if (actionChoice < (tileRackCount + boardCount)) {
            if (! helpers.isDeeplyEqual(this.cursor, {})) {
                const moveFrom = this.cursor
                const moveTo = actions[actionChoice]
                this.cursor = {}

                this.icleRoot.output({
                    action: sharedSystem.actions.Move,
                    move: [
                        [ 
                            [ moveFrom.column, moveFrom.row, moveFrom.grid ],
                            [ moveTo.column, moveTo.row, moveTo.grid  ],
                        ],
                    ],
                })
            } else {
                // Do Nothing
                console.debug('Nothing: Cannot place empty cursor.')
            }
        } else if (actionChoice < (tileRackCount + boardCount + endTurnCount)) {
            this.icleRoot.output({
                action: sharedSystem.actions.EndTurn,
                move: [],
            })
        } else {
            debugger
            throw new Error('Action Choice out of bounds.')
        }
    }
}
