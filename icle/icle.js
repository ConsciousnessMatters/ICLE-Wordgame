import Kernel from './kernel.js'
import Brain from './brain.js'
import { constants } from './system.js'

export default class Icle {
    _type = constants.type.Icle
    _v = constants.v.V1
    kernel
    brain

    constructor() {
        this.kernel = new Kernel()
        this.brain = new Brain()

        this.kernel.assignBrain(this.brain)
        this.brain.assignKernel(this.kernel)
        this.brain.assignIcle(this)

        this.listen()
    }

    input(sensoryData) {
        this.brain.input(sensoryData)
    }

    output(actionMessage) {
        self.postMessage(actionMessage)
    }
    
    listen() {
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
self.icle = icle
