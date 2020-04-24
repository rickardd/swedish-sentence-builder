export class WordGroup {
    constructor(name) {
        this.name = name
        this.words = []
    }

    addWord(word) { // type word
        this.words.push(word)

    }
}