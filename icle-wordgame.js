'use strict'

import World from './world/world.js'
import { loadWordList } from './world/words/words.js'

const words = await loadWordList()

const naive = {}
// const workerQuantity = window.navigator.hardwareConcurrency
const workerQuantity = 30 // Simulataneous processing of all rows and columns is visually

for (let i = 0; i < workerQuantity; i++) {
    naive[`t${i}`] = new Worker(`./naive/naive.js?v=${Date.now()}`, { type: 'module' })
}

const scoreUpdateFunction = ({
    roundNumber,
    isHuman,
    humanWordPoints,
    naiveWordPoints,
    totalHumanPoints,
    totalNaivePoints,
}) => {
    const entry = isHuman ? document.createElement('tr') : document.querySelector('#scores > table tr:last-child')
    entry.className = 'score-entry'
    entry.innerHTML = `
        <td>${roundNumber}</td>
        <td>${humanWordPoints}</td>
        <td>${totalHumanPoints}</td>
        <td>${isHuman ? '' : naiveWordPoints}</td>
        <td>${isHuman ? '' : totalNaivePoints}</td>
    `

    document.querySelector('#scores > table > tbody').appendChild(entry)
}

let canvasContext,
    scaleFactor = window.devicePixelRatio || 1

canvasContext = document.getElementById('icle-wordgame').getContext('2d')
canvasContext.canvas.width = canvasContext.canvas.scrollWidth * scaleFactor
canvasContext.canvas.height = canvasContext.canvas.scrollHeight * scaleFactor
canvasContext.scale(scaleFactor, scaleFactor)

const world = new World({ canvasContext, words, scoreUpdateFunction, naive })
world.render()
