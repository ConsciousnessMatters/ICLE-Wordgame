export default class Turn {
    id
    turnNumber

    constructor(turnNumber) {
        this.id = crypto.randomUUID()
        this.turnNumber = turnNumber
    }

    getTurnNumber() {
        return this.turnNumber
    }

    returnNewTurn() {
        return new Turn(this.turnNumber + 1)
    }
}
