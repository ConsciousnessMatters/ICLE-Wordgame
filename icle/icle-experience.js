import { constants } from './system.js'

export default class IcleExperience {
    _type = constants.type.IcleExperience
    _v = constants.v.V1
    id
    lastExperience
    perception

    constructor({
        lastExperience,
        perception,
    }) {
        this.id = crypto.randomUUID()
        this.lastExperience = lastExperience
        this.perception = perception
    }
}
