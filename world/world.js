import Grid from './grid/grid.js'
import TileRack from './tile-rack/tile-rack.js'
import LettersBag from './letters-bag/letters-bag.js'

export default class World {

    constructor(canvasContext) {
        this.canvasContext = canvasContext
        this.grid = new Grid(this.canvasContext)
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
        this.canvasContext.canvas.addEventListener('pointerdown', (e) => {
            console.debug(e)
        })
        this.canvasContext.canvas.addEventListener('pointermove', (e) => {
            console.debug(e)
        })
        this.canvasContext.canvas.addEventListener('pointerup', (e) => {
            console.debug(e)
        })
        this.canvasContext.canvas.addEventListener('pointercancel', (e) => {
            console.debug(e)
        })
    }

    render() {
        this.grid.render()
        this.tileRack.render()
        this.lettersBag.render()
    }
}
