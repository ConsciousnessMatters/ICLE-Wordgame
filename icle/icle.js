import IcleKernel from './icle-kernel.js'
import IcleInterface from './icle-interface.js'
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

        this.setupMessaging()
    }

    input(sensoryData) {
        this.icleInterface.input(sensoryData)
    }
    
    setupMessaging() {
        self.onmessage = (event) => {
            this.input({
                board: event.data?.boardExport,
                tileRack: event.data?.tileRackExport,
                scores: event.data?.scores,
                actionSpace: event.data?.actionSpace,
            })
        }
    }
}

const icle = new Icle()
icle.setupMessaging()
