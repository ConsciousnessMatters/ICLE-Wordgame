export default class IcleExperience {
    _type = constants.type.IcleExperience
    _v = constants.v.V1
    id

    constructor() {
        this.id = crypto.randomUUID()
    }
}
