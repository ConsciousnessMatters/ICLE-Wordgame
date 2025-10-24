import IcleExperience from './icle-experience.js'
import { constants } from './system.js'

export default class IcleKernel {
    _type = constants.type.IcleKernel
    _v = constants.v.V1
    id
    icleInterface

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignInterface(icleInterface) {
        this.icleInterface = icleInterface
    }

    input(icleExperience) {
        /*  
        *  ToDo: Examine how actions feel and use previous knowledge of bad actions (for given cursor)
        *  in order to pick an action that does not incurr those negative feelings.
        */

        const actionTotal = icleExperience.perception.percepts.actionSpace.actions
        const actionChoice = Math.floor(Math.random() * actionTotal.length)

        return actionChoice
    }
}
