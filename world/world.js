import Grid from './grid/grid.js'

export default class World {

    constructor(canvasContext) {
        this.canvasContext = canvasContext
        this.grid = new Grid(this.canvasContext)
    }

    render() {
        console.debug('World render() method.')
        this.grid.render()
    }
}
