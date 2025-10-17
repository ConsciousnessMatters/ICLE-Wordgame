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
    tileRack
    lettersBag
    words
    scoreUpdateFunction
    naive
    shadowMoves = []
    shadowQueueAnimationFrameId

    constructor({ 
        canvasContext = null, 
        words, 
        scoreUpdateFunction = () => {}, 
        naive = null 
    }) {
        this.canvasContext = canvasContext
        this.board = new Board({ canvasContext, words, world: this })
        this.tileRack = new TileRack({ canvasContext })
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
        const newLetters = this.lettersBag.getRandomLetters(7)
        this.tileRack.addLetters(newLetters)
    }

    refreshTileRacks() {
        const tilesShort = this.tileRack.countTilesShort()
        const newLetters = this.lettersBag.getRandomLetters(tilesShort)
        this.tileRack.addLetters(newLetters)
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

            const tileRackCell = this.tileRack.getCellAtPixelLocation({
                x: e.x,
                y: e.y,
            })

            if (tileRackCell && tileRackCell.hasLetter()) {
                moveOriginCell = tileRackCell
                movingLetter = tileRackCell.removeLetter()
                movingLetter.setTurnRollBackCell(tileRackCell)
            }

            if (boardCell && boardCell.hasLetter()) {
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

            const tileRackCell = this.tileRack.getCellAtPixelLocation({
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

    queueMove(moveData) {
        this.finalMove = moveData
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
        letterMoves.forEach((letterMove) => {
            const [ source, destination ] = letterMove
            const oldCell = this.tileRack.getCell({ 
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

    setupControls() {
        const forceComputerTurn = (e) => {
            const tileRackExport = this.tileRack.export()
            const boardExport = this.board.export()
            this.messageNaive({
                command: 'takeTurn',
                tileRackExport,
                boardExport,
            })
        }

        const endTurn = (e) => {
            this.endTurn()
        }

        document.getElementById('end-turn').addEventListener('click', endTurn)
        document.getElementById('force-computer-turn').addEventListener('click', forceComputerTurn)
    }

    setupWorkerMessaging() {
        this.naive.onmessage = (event) => {
            switch(event.data?.command) {
                case 'makeMove':
                    this.makeMove({
                        move: event.data?.move,
                        type: 'normal',
                    })
                    this.endTurn()
                    break
                case 'showMove':
                    this.queueShadowMove({
                        move: event.data?.move,
                        type: 'shadow',
                    })
                    if (! this.shadowQueueAnimationFrameId) {
                        this.processShadowMoveQueue()
                    }
                    break
            }
        }
    }

    messageNaive(message) {
        if (this.naive) {
            this.naive.postMessage(message)
        }
    }

    returnTurn() {
        const [ currentTerm ] = this.turns
        return currentTerm
    }

    endTurn() {
        const newScore = this.board.endTurn()
        this.scores.push(newScore)
        this.refreshTileRacks()
        this.scoreUpdateFunction({
            turnNumber: this.returnTurn().getTurnNumber(),
            wordPoints: newScore,
            totalPoints: this.scores.reduce((accumulator, score) => accumulator + score, 0),
        })
        this.reRender()
        this.turns = [
            this.returnTurn().returnNewTurn(),
            ...this.turns,
        ]
    }

    clear() {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height)
    }

    render() {
        this.board.render()
        this.tileRack.render()
        this.lettersBag.render()
    }

    reRender() {
        this.clear()
        this.render()
    }
}
