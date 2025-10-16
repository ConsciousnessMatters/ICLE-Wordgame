export default class Option {
    moves = []
    score = 0
    key = null

    constructor({
        moves,
        score,
    }) {
        this.moves = moves ?? this.moves
        this.score = score ?? this.score
        this.key = this.moves.reduce((accumulator, move) => {
            return accumulator + `s${move.tileRackCell.getCellLocationKey()}d${move.attemptSpace.getCellLocationKey()}`
        }, '')
    }

    getKey() {
        return this.key
    }
}
