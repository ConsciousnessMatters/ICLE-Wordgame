import IclePerception from './icle-perception.js'
import IcleExperience from './icle-experience.js'
import { constants } from './system.js'
import { sharedSystem } from '../world/shared-system.js'

export default class IcleInterface {
    _type = constants.type.IcleInterface
    _v = constants.v.V1
    id
    icleKernel
    icleRoot
    lastExperience = null
    experience = null
    lastPerception = null
    perception = null
    cursor = {}

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignKernel(icleKernel) {
        this.icleKernel = icleKernel
    }

    assignRoot(icleRoot) {
        this.icleRoot = icleRoot
    }
    
    input(sensoryData) {
        this.perception = new IclePerception({
            lastPerception: this.lastPerception,
            sensoryData,
            cursor: this.cursor,
        })
        this.experience = new IcleExperience({
            lastExperience: this.lastExperience,
            perception: this.perception,
        })
        
        this.lastPerception = this.perception
        this.lastExperience = this.experience
        this.output(this.icleKernel.input(this.experience))
    }

    output(actionChoice) {
        const tileRackCount = 7
        const boardCount = 225
        const endTurnCount = 1
        const actions = this.perception.percepts.actionSpace.actions

        if (actions.length === 0) {
            // Do Nothing
        } else if (actionChoice < tileRackCount) {
            if (this.cursor === null) {
                this.cursor = actions[actionChoice]
                console.debug('Cursor Now Occupied')
            } else {
                // Do Nothing
                console.debug('Nothing: Cannot fill occupied cursor.')
            }
        } else if (actionChoice < (tileRackCount + boardCount)) {
            if (this.cursor !== null) {
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
