import Percept from './percept.js'

export default class ChoicePercept extends Percept {
    choice

    constructor({ choice }) {
        super()
        this.choice = choice
    }
}
