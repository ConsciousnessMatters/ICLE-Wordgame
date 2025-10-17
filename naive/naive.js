import Option from './option.js'
import World from '../world/world.js'
import { loadWordList } from '../world/words/words.js'

const words = await loadWordList()

export default class Naive {
    world = null
    optionSpace = []
    combinations = 0
    permutations = 0
    placements = 0

    constructor() {
        this.world = new World({ 
            canvasContext: null, 
            words, 
            scoreUpdateFunction: () => {}, 
            naive: null,
        })
    }

    setupMessaging() {
        self.onmessage = (event) => {
            switch (event.data?.command) {
                case 'takeTurn':
                    this.takeTurn({
                        tileRackImport: event.data?.tileRackExport,
                        boardImport: event.data?.boardExport,
                    })
                break
            }
        }
    }

    takeTurn({ tileRackImport, boardImport }) {
        this.world.board.import(boardImport)
        this.world.tileRack.import(tileRackImport)

        const start = performance.now()
        const startingOptions = this.world.board.cells.filter((cell) => cell.isGameContinuous())
        const linesForEvaluation = startingOptions.reduce((accumulator,  startingOption) => {
            const lineKeysSoFar = accumulator.map((line) => line.getKey())
            const column = startingOption.getColumn()
            const row = startingOption.getRow()

            if (! lineKeysSoFar.includes(column.getKey())) {
                accumulator.push(column)
            }

            if (! lineKeysSoFar.includes(row.getKey())) {
                accumulator.push(row)
            }

            return accumulator
        }, [])
        const tileRackCells = this.world.tileRack.cells.filter((cell) => cell.hasLetter())

        linesForEvaluation.forEach((line) => this.evaluateLine({
            line,
            tileRackCells,
        }))

        const end = performance.now()
        console.log({
            naiveTurnTime: `${((end - start) / 1000).toFixed(2)} s`,
            combinations: this.combinations,
            permutations: this.permutations,
            placements: this.placements,
            options: this.optionSpace.length
        })
        // debugger

        this.playBestOption()
        this.cleanupOptionSpace()
        this.cleanupCounters()
    }

    evaluateLine({ line, tileRackCells }) {
        const playableSpaces = line.toArray().filter((cell) => !cell.hasLetter())

        for (const combination of this.yieldCombination(tileRackCells)) {
            this.combinations++

            // ToDo: Anagram checking of combination + existing placed letters could optimize things here.

            const iterator = this.yieldPlacement(combination, playableSpaces)
            const noValidPlacement = iterator.next().done

            if (noValidPlacement) {
                continue
            }

            for (const permutation of this.yieldPermutation(combination)) {
                this.permutations++

                for (const attemptSpaces of this.yieldPlacement(permutation, playableSpaces)) {
                    this.placements++

                    const permutationPlacementAttempt = permutation.slice()
                    const attemptedMoves = []

                    attemptSpaces.some((attemptSpace) => {
                        const tileRackCell = permutationPlacementAttempt.shift()
                        if (tileRackCell) {
                            attemptedMoves.push({ tileRackCell, attemptSpace })
                            this.world.moveLetter(tileRackCell, attemptSpace)
                        }
                        return tileRackCell ? false : true
                    })

                    // this.world.reRender()
                    // debugger

                    const provisionalLine = this.world.board.getProvisionalLine()
                    const firstProvisionalLetterIndex = provisionalLine.getFirstProvisionalLetterIndex()
                    const word = provisionalLine.getWordAtIndex(firstProvisionalLetterIndex)

                    if (! word) {
                        // debugger
                        // ToDo: This shouldn't fire as often as it did before I commented it out.
                    }

                    if (word && word.isDictionaryMatch() && this.calculateScoreIfPlayValid()) {
                        const newOption = {
                            moves: attemptedMoves, 
                            score: this.calculateScoreIfPlayValid(),
                        }
                        this.addOption(newOption)
                        // debugger
                    }

                    this.world.board.rollbackBoardTiles()
                }
            }
        }
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

    *yieldPlacement(provisionalWord, playableSpaces) {
        for (let i = 0; i < playableSpaces.length; i++) {
            const attemptSpaces = playableSpaces.slice(i)
            const attemptHasGameContinuity = attemptSpaces.some((attemptSpace) => attemptSpace.isGameContinuous())
            if (attemptSpaces.length >= provisionalWord.length && attemptHasGameContinuity) {
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

    addOption({ moves, score }) {
        if (score === false || (! score > 0)) {
            return
        }

        const newOption = new Option({
            moves,
            score,
        })
        const newOptionKey = newOption.getKey()

        if (! this.optionSpace.includes((option) => option.getKey() === newOptionKey)) {
            this.optionSpace.push(newOption)
            this.ghostPlayOption(newOption)
            // debugger
        }
    }

    getBestOption() {
        return this.optionSpace.length
            ? this.optionSpace.reduce((accumulator, option) => (option.score > accumulator.score ? option : accumulator))
            : null
    }

    ghostPlayOption(option) {
        const move = option.moves.map((move) => [
            [move.tileRackCell.getColumnIndex(), move.tileRackCell.getRowIndex()],
            [move.attemptSpace.getColumnIndex(), move.attemptSpace.getRowIndex()],
        ])

        self.postMessage({
            command: 'showMove',
            move,
        })
    }

    playOption(option) {
        const move = option.moves.map((move) => [
            [move.tileRackCell.getColumnIndex(), move.tileRackCell.getRowIndex()],
            [move.attemptSpace.getColumnIndex(), move.attemptSpace.getRowIndex()],
        ])

        self.postMessage({
            command: 'makeMove',
            move,
        })
    }

    cleanupOptionSpace() {
        this.optionSpace = []
    }

    cleanupCounters() {
        this.combinations = 0
        this.permutations = 0
        this.placements = 0
    }

    playBestOption() {
        const bestOption = this.getBestOption()
        this.playOption(bestOption)
        // debugger
    }
}

const naive = new Naive()
naive.setupMessaging()
