import Board from './board/board.js'
import TileRack from './tile-rack/tile-rack.js'
import LettersBag from './letters-bag/letters-bag.js'
import Turn from './turn.js'

export default class World {
    turns
    scores = []
    players = []
    canvasContext
    board
    humanTileRack
    naiveTileRack
    lettersBag
    words
    scoreUpdateFunction
    naive
    shadowMoves = []
    bestMoves = []
    shadowQueueAnimationFrameId

    constructor({ 
        canvasContext = null, 
        words, 
        scoreUpdateFunction = () => {}, 
        naive = null 
    }) {
        this.canvasContext = canvasContext
        this.board = new Board({ canvasContext, words, world: this })
        this.humanTileRack = new TileRack({ canvasContext })
        this.naiveTileRack = new TileRack({ canvasContext })
        this.lettersBag = new LettersBag({ canvasContext })
        this.turns = [new Turn(1)]
        this.words = words
        this.scoreUpdateFunction = scoreUpdateFunction
        this.naive = naive ?? null
        this.processShadowMoveQueue = this.processShadowMoveQueue.bind(this)

        this.setupTileRacks()
        if (this.canvasContext) {
            this.setupDragAndDrop()
            this.setupControls()
            this.setupWorkerMessaging()
        }
    }

    setupTileRacks() {
        const newHumanLetters = this.lettersBag.getRandomLetters(7)
        const newNaiveLetters = this.lettersBag.getRandomLetters(7)
        this.humanTileRack.addLetters(newHumanLetters)
        this.naiveTileRack.addLetters(newNaiveLetters)
    }

    refreshTileRacks() {
        const tilesHumanShort = this.humanTileRack.countTilesShort()
        const newHumanLetters = this.lettersBag.getRandomLetters(tilesHumanShort)
        const tilesNaiveShort = this.naiveTileRack.countTilesShort()
        const newNaiveLetters = this.lettersBag.getRandomLetters(tilesNaiveShort)

        this.humanTileRack.addLetters(newHumanLetters)
        this.naiveTileRack.addLetters(newNaiveLetters)
    }

    setupDragAndDrop() {
        let movingLetter,
            moveOriginCell

        const cancelDrag = () => {
            if (movingLetter) {
                moveOriginCell.addLetter(movingLetter)
                movingLetter = null
                this.reRender()
            }
        }

        const updateMovingLetter = (e) => {
            if (movingLetter) {
                movingLetter.setLocation({
                    x: e.x,
                    y: e.y,
                    origin: 'center',
                })
                movingLetter.render()
            }
        }

        const handleClickDown = (e) => {
            const boardCell = this.board.getCellAtPixelLocation({
                x: e.x,
                y: e.y,
            })

            const tileRackCell = this.humanTileRack.getCellAtPixelLocation({
                x: e.x,
                y: e.y,
            })

            if (tileRackCell && tileRackCell.hasLetter()) {
                moveOriginCell = tileRackCell
                movingLetter = tileRackCell.removeLetter()
                movingLetter.setTurnRollBackCell(tileRackCell)
            }

            if (boardCell && boardCell.hasProvisionalLetter()) {
                moveOriginCell = boardCell
                movingLetter = boardCell.removeLetter()
            }

            this.reRender()
            updateMovingLetter(e)
        }

        const handlePointerMove = (e) => {
            if (movingLetter) {
                this.reRender()
                updateMovingLetter(e)
            }
        }

        const handleClickUp = (e) => {
            const boardCell = this.board.getCellAtPixelLocation({
                x: e.x,
                y: e.y,
            })

            const tileRackCell = this.humanTileRack.getCellAtPixelLocation({
                x: e.x,
                y: e.y,
            })

            if (movingLetter && boardCell && ! boardCell.hasLetter()) {
                boardCell.addLetter(movingLetter)
                movingLetter = null
                this.reRender()
            }

            if (movingLetter && tileRackCell && ! tileRackCell.hasLetter()) {
                tileRackCell.addLetter(movingLetter)
                tileRackCell.commit()
                movingLetter = null
                this.reRender()
            }

            cancelDrag()
        }

        this.canvasContext.canvas.addEventListener('pointerdown', handleClickDown)
        this.canvasContext.canvas.addEventListener('pointermove', handlePointerMove)
        this.canvasContext.canvas.addEventListener('pointerup', handleClickUp)
        this.canvasContext.canvas.addEventListener('pointercancel', cancelDrag)
        this.canvasContext.canvas.addEventListener('pointerout', cancelDrag)
    }

    moveLetter(oldCell, newCell) {
        const movingLetter = oldCell.removeLetter()
        movingLetter.setTurnRollBackCell(oldCell)
        newCell.addLetter(movingLetter)
    }

    queueShadowMove(moveData) {
        this.shadowMoves.push(moveData)
    }

    queueBestMove(moveData) {
        this.bestMoves.push(moveData)

        if (this.bestMoves.length === Object.entries(this.naive).length) {
            const bestMove = this.bestMoves.reduce((accumulator, option) => (option.score > accumulator.score ? option : accumulator))

            this.makeMove(bestMove)
            this.bestMoves = []
            this.endTurn()
        }
    }

    processShadowMoveQueue() {
        this.shadowQueueAnimationFrameId = true

        if (this.shadowMoves.length > 0) {
            const nextShadowMove = this.shadowMoves.shift()
            this.makeMove(nextShadowMove)
            this.shadowQueueAnimationFrameId = requestAnimationFrame(this.processShadowMoveQueue)
        } else {
            this.shadowQueueAnimationFrameId = false
        }
    }

    makeMove({ move: letterMoves, type }) {
        const sourceRack = this.returnTurn().isHuman() ? this.humanTileRack : this.naiveTileRack

        letterMoves.forEach((letterMove) => {
            const [ source, destination ] = letterMove
            const oldCell = sourceRack.getCell({ 
                columnIndex: source[0],
                rowIndex: source[1],
            })
            const newCell = this.board.getCell({ 
                columnIndex: destination[0],
                rowIndex: destination[1],
            })
            this.moveLetter(oldCell, newCell)
        })

        if (type === 'shadow') {
            this.reRender()
            this.board.rollbackBoardTiles()
        } else if (type === 'normal') {
            this.shadowMoves = []
        }
    }

    handOverToNaive() {
        const tileRackExport = this.naiveTileRack.export()
        const boardExport = this.board.export()
        this.messageNaive({
            command: 'takeTurn',
            tileRackExport,
            boardExport,
        })
    }

    setupControls() {
        const endTurn = (e) => {
            this.endTurn()
        }

        document.getElementById('end-turn').addEventListener('click', endTurn)
    }

    setupWorkerMessaging() {
        const onWorkerMessage = (event) => {
            switch(event.data?.command) {
                case 'makeMove':
                    // this.makeMove()
                    this.queueBestMove({
                        move: event.data?.move,
                        type: 'normal',
                        score: event.data?.score,
                    })
                    // this.endTurn()
                    break
                case 'showMove':
                    this.queueShadowMove({
                        move: event.data?.move,
                        type: 'shadow',
                        score: event.data?.score,
                    })
                    if (! this.shadowQueueAnimationFrameId) {
                        this.processShadowMoveQueue()
                    }
                    break
            }
        }
        Object.entries(this.naive).forEach(([key, worker]) => {
            worker.onmessage = onWorkerMessage
        })
    }

    messageNaive(message) {
        if (this.naive) {
            Object.entries(this.naive).forEach(([workerKey, worker]) => {
                worker.postMessage({
                    ...message,
                    workerKey,
                    workerQuantity: Object.entries(this.naive).length,
                })
            })
        }
    }

    returnTurn() {
        const [ currentTerm ] = this.turns
        return currentTerm
    }

    endTurn() {
        const newScore = this.board.endTurn()
        const newHumanScore = this.returnTurn().isHuman() ? newScore : 0
        const newNaiveScore = this.returnTurn().isNaive() ? newScore : 0
        this.scores.push([newHumanScore, newNaiveScore])
        this.refreshTileRacks()
        this.scoreUpdateFunction({
            roundNumber: this.returnTurn().getRoundNumber(),
            isHuman: this.returnTurn().isHuman(),
            humanWordPoints: newHumanScore,
            naiveWordPoints: newNaiveScore,
            totalHumanPoints: this.scores.reduce((accumulator, [ newHumanScore, newNaiveScore ]) => accumulator + newHumanScore, 0),
            totalNaivePoints: this.scores.reduce((accumulator, [ newHumanScore, newNaiveScore ]) => accumulator + newNaiveScore, 0),
        })
        this.reRender()
        this.turns = [
            this.returnTurn().returnNewTurn(),
            ...this.turns,
        ]

        if (this.returnTurn().isNaive()) {
            this.handOverToNaive()
        }
    }

    clear() {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height)
    }

    render() {
        this.board.render()
        this.humanTileRack.render()
        this.lettersBag.render()
    }

    reRender() {
        this.clear()
        this.render()
    }
}
