import Board from './board/board.js'
import TileRack from './tile-rack/tile-rack.js'
import LettersBag from './letters-bag/letters-bag.js'

export default class World {

    constructor(canvasContext) {
        this.canvasContext = canvasContext
        this.board = new Board(this.canvasContext)
        this.tileRack = new TileRack(this.canvasContext)
        this.lettersBag = new LettersBag(this.canvasContext)

        this.setupTileRacks()
        this.setupDragAndDrop()
    }

    setupTileRacks() {
        const newLetters = this.lettersBag.getRandomLetters(7)
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

        this.canvasContext.canvas.addEventListener('pointerdown', (e) => {
            const boardCell = this.board.getCellAtLocation({
                x: e.x,
                y: e.y,
            })

            const tileRackCell = this.tileRack.getCellAtLocation({
                x: e.x,
                y: e.y,
            })

            if (tileRackCell && tileRackCell.hasLetter()) {
                moveOriginCell = tileRackCell
                movingLetter = tileRackCell.removeLetter()
            }

            this.reRender()

            if (movingLetter) {
                movingLetter.setLocation({
                    x: e.x,
                    y: e.y,
                    origin: 'center',
                })
                movingLetter.render()
            }
        })

        this.canvasContext.canvas.addEventListener('pointermove', (e) => {
            if (movingLetter) {
                this.reRender()

                movingLetter.setLocation({
                    x: e.x,
                    y: e.y,
                    origin: 'center',
                })
                movingLetter.render()
            }
        })

        this.canvasContext.canvas.addEventListener('pointerup', (e) => {
            const boardCell = this.board.getCellAtLocation({
                x: e.x,
                y: e.y,
            })

            const tileRackCell = this.tileRack.getCellAtLocation({
                x: e.x,
                y: e.y,
            })

            if (movingLetter && boardCell && ! boardCell.hasLetter()) {
                boardCell.addLetter(movingLetter)
                movingLetter = null
                this.reRender()
            }

            cancelDrag()
        })
        
        this.canvasContext.canvas.addEventListener('pointercancel', (e) => {
            cancelDrag()
        })

        this.canvasContext.canvas.addEventListener('pointerout', (e) => {
            cancelDrag()
        })
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
