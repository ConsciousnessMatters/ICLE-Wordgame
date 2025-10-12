export default class Grid {
    getCellAtPixelLocation({ x, y }) {
        return this.cells.find((cell) => {
            return cell.isAtPixelLocation({ x, y })
        })
    }

    render() {
        this.cells.forEach((cell) => {
            cell.render()
        })
    }
}
