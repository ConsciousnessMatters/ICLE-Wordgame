export default class Letter {
    constructor(canvasContext, type) {
        this.canvasContext = canvasContext

        if (/^[A-Z]$/.test(type)) {
            this.type = type
        } else {
            throw new Error('Invalid Letter type on Letter class initialisation.');
        }
    }

    getValueFromType(type) {

        switch (ch.toUpperCase()) {
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

    render() {
        console.debug('Letter render() method.')
    }
}
