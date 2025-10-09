export default class Grid {
    getCellAtLocation({ x, y }) {
        return this.cells.find((cell) => {
            return cell.isAtLocation({ x, y })
        })
    }

    render() {
        this.cells.forEach((cell) => {
            cell.render()
        })
    }
}
