import { constants } from './system.js'

export default class IcleExperience {
    _type = constants.type.IcleExperience
    _v = constants.v.V1
    id
    lastExperience
    perception
    happiness = 0

    constructor({
        lastExperience,
        perception,
    }) {
        this.id = crypto.randomUUID()
        this.lastExperience = lastExperience
        this.perception = perception

        this.constructEmotions()
    }

    constructEmotions() {
        // If an experience makes us feel sad or happy, then we pay attention to it. We can do pattern matching and abstraction on emotional events.
    }

    /*  
     *  ToDo: If no change occurs from an action (if it was an invalid button for the situation), 
     *  then assign negative emotion to the action and to the cursor. ICLE's intelligence SHOULD
     *  be able to handle the correlation and not be afraid of the cursor and that action, but
     *  only if it's in the right state.
     */
}
