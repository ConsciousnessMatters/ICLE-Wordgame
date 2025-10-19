export default class IcleInterface {
    _type = constants.type.IcleInterface
    _v = constants.v.V1
    id
    icleKernel

    constructor() {
        this.id = crypto.randomUUID()
    }

    assignInterface(icleKernel) {
        this.icleKernel = icleKernel
    }
    
    input({
        board,
        tileRack,
        scores,
    }) {

    }

    output({
        moveLetter,
        endTurn,
    }) {

    }
}
