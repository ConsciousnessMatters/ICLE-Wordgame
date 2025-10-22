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

    input(icpleExperience) {

        // Takes an experience and does things with it to change future perceptions.
        debugger
    }
}
