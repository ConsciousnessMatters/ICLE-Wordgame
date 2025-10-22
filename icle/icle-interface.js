import IclePerception from './icle-perception.js'
import IcleExperience from './icle-experience.js'
import { constants } from './system.js'

export default class IcleInterface {
    _type = constants.type.IcleInterface
    _v = constants.v.V1
    id
    icleKernel
    lastExperience = null
    experience = null
    lastPerception = null
    perception = null
    output = null

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignKernel(icleKernel) {
        this.icleKernel = icleKernel
    }
    
    input(sensoryData) {
        this.perception = new IclePerception({
            lastPerception: this.lastPerception,
            sensoryData,
        })
        this.experience = new IcleExperience({
            lastExperience: this.lastExperience,
            perception: this.perception,
        })
        this.output = this.icleKernel.input(this.experience)

        if (output) {
            this.output()
        }

        this.lastPerception = this.perception
        this.lastExperience = this.experience
    }

    output({
        moveLetter,
        endTurn,
    }) {
        this.output
    }

    inputToPerceptionConverter() {

    }
}
