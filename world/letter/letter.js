export default class Letter {
    x = null
    y = null
    width = null
    height = null

    constructor(canvasContext, type) {
        this.canvasContext = canvasContext

        if (/^[A-Z]$/.test(type)) {
            this.type = type
        } else {
            throw new Error('Invalid Letter type on Letter class initialisation.');
        }
    }

    getValueFromType(type) {
        switch (type) {
            case 'D':
            case 'G':
                return 2
            case 'B':
            case 'C':
            case 'M':
            case 'P':
                return 3
            case 'F':
            case 'H':
            case 'V':
            case 'W':
            case 'Y':
                return 4
            case 'K':
                return 5
            case 'J':
            case 'X':
                return 9
            case 'Q':
            case 'Z':
                return 11
            default:
                return 1
        }
    }

    setLocation({ x, y, width, height }) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    render() {
        console.debug('Letter render() method.')
        console.debug(this.type)

        this.canvasContext.beginPath()
        this.canvasContext.fillStyle = '#eeeeee'
        this.canvasContext.roundRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2, 2)
        this.canvasContext.fill()

        this.canvasContext.fillStyle = '#000000'
        this.canvasContext.textAlign = 'center'
        this.canvasContext.font = '24px sans-serif'
        this.canvasContext.textBaseline = 'middle'
        this.canvasContext.fillText(this.type, this.x + (this.width / 2), this.y + (this.height / 2))

        this.canvasContext.font = '9px sans-serif'
        this.canvasContext.fillText(this.getValueFromType(this.type), this.x + (this.width - 8), this.y + (this.height - 8))
    }
}
