export default class Letter {
    x = null
    y = null
    width = null
    height = null
    type = null
    turnRollBackCell = null

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

    setLocation(parameters) {
        const { x, y, width, height, origin = 'topleft' } = parameters

        switch(origin) {
            case 'topleft':
                return this.setLocationFromTopLeft(parameters)
            case 'center':
                return this.setLocationFromCenter(parameters)
        }
    }

    setLocationFromTopLeft({ x, y, width, height }) {
        this.x = x ?? this.x
        this.y = y ?? this.y
        this.width = width ?? this.width
        this.height = height ?? this.height
    }

    setLocationFromCenter({ x, y, width, height }) {
        this.x = (x ?? this.x) - ((width ?? this.width) / 2)
        this.y = (y ?? this.y) - ((height ?? this.height) / 2)
        this.width = width ?? this.width
        this.height = height ?? this.height
    }

    getTurnRollBackCell() {
        return this.turnRollBackCell = cell
    }

    setTurnRollBackCell(cell) {
        this.turnRollBackCell = cell
    }

    clearTurnRollBackCell() {
        this.turnRollBackCell = null
    }

    hasTurnRollBackCell() {
        debugger
        return this.turnRollBackCell !== null
    }

    render() {
        if (this.turnRollBackCell) {
            this.canvasContext.globalAlpha = 0.5
        }
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
        this.canvasContext.globalAlpha = 1
    }
}
