import Option from './option.js'

export default class Naive {
    world = null
    optionSpace = []

    constructor({ world }) {
        this.world = world
    }

    takeTurn() {
        const startingOptions = this.world.board.cells.filter((cell) => cell.isGameContinuous())
        startingOptions.forEach((startingOption) => this.evaluateStartingOption(startingOption))

        this.playBestOption()
        this.cleanupOptionSpace()
    }

    evaluateStartingOption(startingOption) {
        const column = startingOption.getColumn()
        const columnPlayableSpaces = column.toArray().filter((cell) => !cell.hasLetter())
        const columnStartingOptionIndex = columnPlayableSpaces.findIndex((cell) => cell === startingOption)
        const row = startingOption.getRow()
        const rowPlayableSpaces = row.toArray().filter((cell) => !cell.hasLetter())
        const rowStartingOptionIndex = rowPlayableSpaces.findIndex((cell) => cell === startingOption)
        const tileRackCells = this.world.tileRack.cells.filter((cell) => cell.hasLetter())

        this.evaluateLine({
            line: column,
            playableSpaces: columnPlayableSpaces,
            tileRackCells,
            startingIndex: columnStartingOptionIndex,
        })

        this.evaluateLine({
            line: row,
            playableSpaces: rowPlayableSpaces,
            tileRackCells,
            startingIndex: rowStartingOptionIndex,
        })
    }

    evaluateLine({ line, playableSpaces, tileRackCells, startingIndex }) {
        let combinations = 0
        let permutations = 0
        let words = 0

        for (const combination of this.yieldCombination(tileRackCells)) {
            combinations++

            // ToDo: Anagram checking of combination + existing placed letters could optimize things here.
            // ToDo: Playlength checking of combination to available space, no point in permutating if it doesn't fit.

            // if (combination.length > attemptSpaces.length) {
            //     continue
            // }

            // ToDo: Right cap play guard! Don't overflow the board.

            const iterator = this.yieldPlacement(combination, playableSpaces, startingIndex)
            const noValidPlacement = iterator.next().done

            if (noValidPlacement) {
                continue
            }

            for (const permutation of this.yieldPermutation(combination)) {
                permutations++

                for (const attemptSpaces of this.yieldPlacement(permutation, playableSpaces, startingIndex)) {
                    const permutationPlacementAttempt = permutation.slice()
                    const attemptedMoves = []
                    // const text = permutation.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')

                    attemptSpaces.some((attemptSpace) => {
                        const tileRackCell = permutationPlacementAttempt.shift()
                        if (tileRackCell) {
                            attemptedMoves.push({ tileRackCell, attemptSpace })
                            this.world.moveLetter(tileRackCell, attemptSpace)
                        }
                        return tileRackCell ? false : true
                    })

                    // this.world.reRender()

                    const word = line.getWordAtIndex(startingIndex)

                    if (! word) {
                        // debugger
                        // ToDo: This shouldn't fire as often as it did before I commented it out.
                    }

                    if (word && word.isDictionaryMatch()) {
                        this.world.reRender()
                        // debugger
                        // this.world.reRender()
                        words++

                        this.addOption({
                            moves: attemptedMoves, 
                            score: this.calculateScoreIfPlayValid(),
                        })
                    }

                    this.world.board.rollbackBoardTiles()
                }
            }
        }

        console.debug({
            combinations,
            permutations,
            words,
        })

        const bestOption = this.getBestOption()
        debugger
    }

    *yieldCombination(array) {
        const totalCombinations = (1 << array.length)
        for (let combinationIndex = 1; combinationIndex < totalCombinations; combinationIndex++) {
            yield array.filter((_, i) => combinationIndex & (1 << i))
        }
    }

    *yieldPermutation(array) {
        if (array.length === 0) {
            yield []
        } else {
            for (let i = 0; i < array.length; i++) {
                const rest = [...array.slice(0, i), ...array.slice(i + 1)]
                for (const permutation of this.yieldPermutation(rest)) {
                    yield [array[i], ...permutation]
                }
            }
        }
    }

    *yieldPlacement(provisionalWord, playableSpaces, startingIndex) {
        const maxCombinationOffset = provisionalWord.length - 1
        const maxPlayableOffset = playableSpaces.slice(0, startingIndex).length
        const maxOperatingOffset = Math.min(maxCombinationOffset, maxPlayableOffset)
        const newStartingIndex = startingIndex - maxOperatingOffset

        if (newStartingIndex >= 0) {
            for (let i = newStartingIndex; i < playableSpaces.length; i++) {
                const attemptSpaces = playableSpaces.slice(i)
                if (attemptSpaces.length >= provisionalWord.length) {
                    yield attemptSpaces
                }
            }
        } else {
            // ToDo: Cleanup the fact that the line below triggers when uncommented.
            // debugger
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

    addOption({ moves, score }) {
        this.optionSpace.push(new Option({
            moves,
            score,
        }))
    }

    getBestOption() {
        return this.optionSpace.length
            ? this.optionSpace.reduce((accumulator, option) => (option.score > accumulator.score ? option : accumulator))
            : null
    }

    playOption(option) {
        option.moves.forEach((move) => this.world.moveLetter(move.tileRackCell, move.attemptSpace))
    }

    cleanupOptionSpace() {
        this.optionSpace = []
    }

    playBestOption() {
        const bestOption = this.getBestOption()
        this.playOption(bestOption)
        // debugger
    }
}
