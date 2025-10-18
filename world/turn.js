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

    getRoundNumber() {
        return this.isHuman() ? ((this.turnNumber + 1) / 2) : this.turnNumber / 2
    }

    isHuman() {
        return this.turnNumber % 2 === 1
    }

    isNaive() {
        return this.turnNumber % 2 === 0
    }

    returnNewTurn() {
        return new Turn(this.turnNumber + 1)
    }
}
