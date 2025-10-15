export default class Naive {
    world = null
    optionSpace = null

    constructor({ world }) {
        this.world = world
    }

    takeTurn() {
        const startingOptions = this.world.board.cells.filter((cell) => cell.isGameContinuous())

        const [ startingOption ] = startingOptions
        this.processStartingOption(startingOption)

        debugger
    }

    processStartingOption(startingOption) {
        const columnPlay = this.processVerticalPlay(startingOption)
    }

    processVerticalPlay(startingOption) {
        const column = startingOption.getColumn()
        const playableSpaces = column.toArray().filter((cell) => !cell.hasLetter())
        const tileRackCells = this.world.tileRack.cells.filter((cell) => cell.hasLetter())

        // this.world.moveLetter(firstTileRackCell, firstPlayableSpace)

        const startingOptionIndex = playableSpaces.findIndex((cell) => cell === startingOption)

        this.attemptPlay({
            column,
            playableSpaces,
            tileRackCells,
            startingIndex: startingOptionIndex,
            playLength: 3,
            offset: 0,
        })

        const scoreIfValid = this.calculateScoreIfPlayValid()

        if (scoreIfValid !== false) {
            // Record possible option to state.
        }

        this.world.reRender()

        debugger

        this.world.board.rollbackBoardTiles()
    }

    attemptPlay({ column, playableSpaces, tileRackCells, startingIndex, playLength, offset }) {
        const attemptSpaces = playableSpaces.slice(startingIndex)

        if (attemptSpaces.length < playLength) {
            return false
        }
        
        for (const combination of this.yieldCombination(tileRackCells)) {
            const text = combination.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
            console.debug(text)

            // ToDo: Anagram checking of combination + existing placed letters could optimize things here.

            for (const permutation of this.yieldPermutations(combination)) {
                const text = permutation.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
                console.debug(`- ${text}`)
            }
        }
    }

    *yieldCombination(array) {
        const totalCombinations = (1 << array.length)
        for (let combinationIndex = 0; combinationIndex < totalCombinations; combinationIndex++) {
            yield array.filter((_, i) => combinationIndex & (1 << i))
        }
    }

    *yieldPermutations(array) {
        if (array.length === 0) {
            yield []
        } else {
            for (let i = 0; i < array.length; i++) {
                const rest = [...array.slice(0,i), ...array.slice(i+1)]
                for (const p of this.yieldPermutations(rest)) {
                    yield [array[i], ...p]
                }
            }
        }
    }

    calculateScoreIfPlayValid() {
        const placementValid = this.world.board.isLetterPlacementValid()

        if (placementValid) {
            const words = this.world.board.getNewWordTries()
            const areAllWordsValid = this.world.board.areAllWordsValid(words)

            if (areAllWordsValid) {
                return this.world.board.scoreWords(words)
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
