import IcleKernel from './icle-kernel'
import IcleInterface from './icle-interface'
import { constants } from './system.js'

export default class Icle {
    _type = constants.type.Icle
    _v = constants.v.V1
    icleKernel
    icleInterface

    constructor() {
        this.icleKernel = new IcleKernel()
        this.icleInterface = new IcleInterface()

        this.icleKernel.assignInterface(this.icleInterface)
        this.icleInterface.assignKernel(this.icleKernel)
    }

    input() {
        this.icleInterface.input()
    }
}
