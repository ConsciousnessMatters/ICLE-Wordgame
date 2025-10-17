import Letter from '../letter/letter.js'

export default class LettersBag {
    letters
    canvasContext

    constructor({ canvasContext }) {
        this.canvasContext = canvasContext
        this.resetContents()
    }

    resetContents() {
        const canvasContext = this.canvasContext
        this.letters = [
            ...Array.from({ length: 10 }).map((_) => new Letter({ canvasContext, type: 'A'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'B'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'C'})),
            ...Array.from({ length: 4 }).map((_) => new Letter({ canvasContext, type: 'D'})),
            ...Array.from({ length: 12 }).map((_) => new Letter({ canvasContext, type: 'E'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'F'})),
            ...Array.from({ length: 3 }).map((_) => new Letter({ canvasContext, type: 'G'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'H'})),
            ...Array.from({ length: 9 }).map((_) => new Letter({ canvasContext, type: 'I'})),
            ...Array.from({ length: 1 }).map((_) => new Letter({ canvasContext, type: 'J'})),
            ...Array.from({ length: 1 }).map((_) => new Letter({ canvasContext, type: 'K'})),
            ...Array.from({ length: 4 }).map((_) => new Letter({ canvasContext, type: 'L'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'M'})),
            ...Array.from({ length: 6 }).map((_) => new Letter({ canvasContext, type: 'N'})),
            ...Array.from({ length: 8 }).map((_) => new Letter({ canvasContext, type: 'O'})),
            ...Array.from({ length: 3 }).map((_) => new Letter({ canvasContext, type: 'P'})),
            ...Array.from({ length: 1 }).map((_) => new Letter({ canvasContext, type: 'Q'})),
            ...Array.from({ length: 6 }).map((_) => new Letter({ canvasContext, type: 'R'})),
            ...Array.from({ length: 5 }).map((_) => new Letter({ canvasContext, type: 'S'})),
            ...Array.from({ length: 6 }).map((_) => new Letter({ canvasContext, type: 'T'})),
            ...Array.from({ length: 4 }).map((_) => new Letter({ canvasContext, type: 'U'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'V'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'W'})),
            ...Array.from({ length: 1 }).map((_) => new Letter({ canvasContext, type: 'X'})),
            ...Array.from({ length: 2 }).map((_) => new Letter({ canvasContext, type: 'Y'})),
            ...Array.from({ length: 1 }).map((_) => new Letter({ canvasContext, type: 'Z'})),
        ]
    }

    getRandomLetter() {
        const randomIndex = Math.floor(Math.random() * this.letters.length)
        const [ randomLetter ] = this.letters.splice(randomIndex, 1)
        return randomLetter ?? null
    }

    getRandomLetters(number) {
        const letters = []
        for (let step = 0; step < number; step++) {
            letters.push(this.getRandomLetter())
        }
        return letters
    }

    render() {
    }
}
