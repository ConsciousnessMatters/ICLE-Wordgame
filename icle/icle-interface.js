import { constants } from './system.js'

export default class IcleInterface {
    _type = constants.type.IcleInterface
    _v = constants.v.V1
    id
    icleKernel

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignKernel(icleKernel) {
        this.icleKernel = icleKernel
    }
    
    input({
        board,
        tileRack,
        scores,
        actionSpace,
    }) {
        console.debug({
            board,
            tileRack,
            scores,
            actionSpace,
        })

        const experience = new IcleExperience()
        const output = this.icleKernel.input(experience)

        this.output(output)
    }

    output({
        moveLetter,
        endTurn,
    }) {

    }
}
