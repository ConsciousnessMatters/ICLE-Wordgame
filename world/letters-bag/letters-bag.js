import Letter from '../letter/letter.js'

export default class LettersBag {
    constructor({ canvasContext }) {
        this.canvasContext = canvasContext
        this.resetContents()
    }

    resetContents() {
        this.letters = [
            ...Array.from({ length: 10 }).map((_) => new Letter(this.canvasContext, 'A')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'B')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'C')),
            ...Array.from({ length: 4 }).map((_) => new Letter(this.canvasContext, 'D')),
            ...Array.from({ length: 12 }).map((_) => new Letter(this.canvasContext, 'E')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'F')),
            ...Array.from({ length: 3 }).map((_) => new Letter(this.canvasContext, 'G')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'H')),
            ...Array.from({ length: 9 }).map((_) => new Letter(this.canvasContext, 'I')),
            ...Array.from({ length: 1 }).map((_) => new Letter(this.canvasContext, 'J')),
            ...Array.from({ length: 1 }).map((_) => new Letter(this.canvasContext, 'K')),
            ...Array.from({ length: 4 }).map((_) => new Letter(this.canvasContext, 'L')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'M')),
            ...Array.from({ length: 6 }).map((_) => new Letter(this.canvasContext, 'N')),
            ...Array.from({ length: 8 }).map((_) => new Letter(this.canvasContext, 'O')),
            ...Array.from({ length: 3 }).map((_) => new Letter(this.canvasContext, 'P')),
            ...Array.from({ length: 1 }).map((_) => new Letter(this.canvasContext, 'Q')),
            ...Array.from({ length: 6 }).map((_) => new Letter(this.canvasContext, 'R')),
            ...Array.from({ length: 5 }).map((_) => new Letter(this.canvasContext, 'S')),
            ...Array.from({ length: 6 }).map((_) => new Letter(this.canvasContext, 'T')),
            ...Array.from({ length: 4 }).map((_) => new Letter(this.canvasContext, 'U')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'V')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'W')),
            ...Array.from({ length: 1 }).map((_) => new Letter(this.canvasContext, 'X')),
            ...Array.from({ length: 2 }).map((_) => new Letter(this.canvasContext, 'Y')),
            ...Array.from({ length: 1 }).map((_) => new Letter(this.canvasContext, 'Z')),
        ]
    }

    getRandomLetter() {
        const randomIndex = Math.floor(Math.random() * this.letters.length)
        const [ randomLetter ] = this.letters.splice(randomIndex, 1)
        return randomLetter
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
