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
}
