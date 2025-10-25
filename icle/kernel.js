import { constants } from './system.js'

export default class Kernel {
    _type = constants.type.Kernel
    _v = constants.v.V1
    id
    brain

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignBrain(brain) {
        this.brain = brain
    }

    input(experience) {
        /*  
        *  ToDo: Examine how actions feel and use previous knowledge of bad actions (for given cursor)
        *  in order to pick an action that does not incurr those negative feelings.
        */

        const actionTotal = experience.perception.percepts.actionSpace.actions
        const actionChoice = Math.floor(Math.random() * actionTotal.length)

        return actionChoice
    }
}
