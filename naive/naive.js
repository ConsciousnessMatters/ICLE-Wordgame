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

        const [ firstTileRackCell ] = tileRackCells
        const [ firstPlayableSpace ] = playableSpaces

        this.world.moveLetter(firstTileRackCell, firstPlayableSpace)

        const startingOptionIndex = playableSpaces.findIndex((cell) => cell === startingOption)

        this.attemptPlay({
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

    attemptPlay({ playableSpaces, tileRackCells, startingIndex, playLength, offset }) {
        const attemptSpaces = playableSpaces.slice(startingIndex)
        const simplifiedTileRackCells = tileRackCells.slice(4)

        if (attemptSpaces.length < playLength) {
            return false
        }
        
        for (const combination of this.yieldCombination(simplifiedTileRackCells)) {
            const text = combination.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')
            console.debug(text)
        }
    }

    *yieldCombination(array) {
        const totalCombinations = (1 << array.length)
        for (let combinationIndex = 0; combinationIndex < totalCombinations; combinationIndex++) {
            yield array.filter((_, i) => combinationIndex & (1 << i))
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
