'use strict'

import World from './world/world.js'
import { loadWordList } from './world/words/words.js'

const words = await loadWordList()

let canvasContext,
    scaleFactor = window.devicePixelRatio || 1

canvasContext = document.getElementById('icle-wordgame').getContext('2d')
canvasContext.canvas.width = canvasContext.canvas.scrollWidth * scaleFactor;
canvasContext.canvas.height = canvasContext.canvas.scrollHeight * scaleFactor;
canvasContext.scale(scaleFactor, scaleFactor);

const world = new World({ canvasContext, words })
world.render()
