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
    }

    setupTileRacks() {
        const newLetters = this.lettersBag.getRandomLetters(7)
        this.tileRack.addLetters(newLetters)
    }

    render() {
        console.debug('World render() method.')
        this.grid.render()
        this.tileRack.render()
        this.lettersBag.render()
    }
}
