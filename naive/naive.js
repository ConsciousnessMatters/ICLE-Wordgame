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
        })

        const scoreIfValid = this.calculateScoreIfPlayValid()

        if (scoreIfValid !== false) {
            // Record possible option to state.
        }

        this.world.reRender()

        debugger

        this.world.board.rollbackBoardTiles()
    }

    attemptPlay({ column, playableSpaces, tileRackCells, startingIndex }) {
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

            for (const permutation of this.yieldPermutation(combination)) {
                permutations++

                for (const attemptSpaces of this.yieldPlacement(combination, playableSpaces, startingIndex)) {
                    const permutationPlacementAttempt = permutation.slice()
                    // const text = permutation.reduce((accumulator, cell) => accumulator + cell.getLetterType(), '')

                    attemptSpaces.some((attemptSpace) => {
                        const tileRackCell = permutationPlacementAttempt.shift()
                        if (tileRackCell) {
                            this.world.moveLetter(tileRackCell, attemptSpace)
                        }
                        return tileRackCell ? false : true
                    })

                    // this.world.reRender()

                    const word = column.getWordAtIndex(startingIndex)

                    if (! word) {
                        // debugger
                        // ToDo: This shouldn't fire as often as it did before I commented it out.
                    }

                    if (word) {
                        const dictionaryMatch = word.isDictionaryMatch()

                        if (dictionaryMatch) {
                            this.world.reRender()
                            debugger
                            this.world.board.rollbackBoardTiles()
                            // this.world.reRender()
                            words++
                        }
                    }

                    this.world.board.rollbackBoardTiles()
                    // this.world.reRender()
                    // console.debug(`- ${text}`)
                }
            }
        }

        console.debug({
            combinations,
            permutations,
            words,
        })
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

        if (newStartingIndex < 0) {
            debugger
        }

        for (let i = newStartingIndex; i < playableSpaces.length; i++) {
            const attemptSpaces = playableSpaces.slice(i)
            if (attemptSpaces.length >= provisionalWord.length) {
                yield attemptSpaces
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
