import Grid from './grid/grid.js'
import TileRack from './tile-rack/tile-rack.js'

export default class World {

    constructor(canvasContext) {
        this.canvasContext = canvasContext
        this.grid = new Grid(this.canvasContext)
        this.tileRack = new TileRack(this.canvasContext)
    }

    render() {
        console.debug('World render() method.')
        this.grid.render()
        this.tileRack.render()
    }
}
