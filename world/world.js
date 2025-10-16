import Board from './board/board.js'
import TileRack from './tile-rack/tile-rack.js'
import LettersBag from './letters-bag/letters-bag.js'
import Naive from '../naive/naive.js'
import Turn from './turn.js'

export default class World {
    turns
    scores = []
    players = []
    canvasContext
    board
    tileRack
    lettersBag
    naive
    words
    scoreUpdateFunction

    constructor({ canvasContext, words, scoreUpdateFunction }) {
        this.canvasContext = canvasContext
        this.board = new Board({ canvasContext, words, world: this })
        this.tileRack = new TileRack({ canvasContext })
        this.lettersBag = new LettersBag({ canvasContext })
        this.naive = new Naive({ world: this })
        this.turns = [new Turn(1)]
        this.words = words
        this.scoreUpdateFunction = scoreUpdateFunction

        this.setupTileRacks()
        this.setupDragAndDrop()
        this.setupControls()
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

    setupControls() {
        const forceComputerTurn = (e) => {
            this.naive.takeTurn()
            this.endTurn()
        }

        document.getElementById('end-turn').addEventListener('click', this.endTurn)
        document.getElementById('force-computer-turn').addEventListener('click', forceComputerTurn)
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
