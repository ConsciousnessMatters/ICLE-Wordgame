export async function loadWordList(url = '/world/words/wordlist.txt') {
    const text = await fetch(url).then(file => file.text())
    const words = text.split(/\r?\n/).map(word => word.trim()).filter(Boolean)
    return new Set(words.map(word => word.toUpperCase()))
}
