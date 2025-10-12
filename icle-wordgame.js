'use strict'

import World from './world/world.js'
import { loadWordList } from './world/words/words.js'

const words = await loadWordList()

const scoreUpdateFunction = ({
    turnNumber,
    wordPoints,
    totalPoints,
}) => {
    const entry = document.createElement('div')
    entry.className = 'score-entry'
    entry.innerHTML = `
        <div>Turn ${turnNumber}</div>
        <div>${wordPoints}</div>
        <div>${totalPoints}</div>
    `

    document.getElementById('player-1').appendChild(entry)
}

let canvasContext,
    scaleFactor = window.devicePixelRatio || 1

canvasContext = document.getElementById('icle-wordgame').getContext('2d')
canvasContext.canvas.width = canvasContext.canvas.scrollWidth * scaleFactor
canvasContext.canvas.height = canvasContext.canvas.scrollHeight * scaleFactor
canvasContext.scale(scaleFactor, scaleFactor)

const world = new World({ canvasContext, words, scoreUpdateFunction })
world.render()
