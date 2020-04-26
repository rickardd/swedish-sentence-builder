import gsap from "../node_modules/gsap/all.js";

export class Group {
    constructor(scene, name, selector, width, gutterX) {
        this.scene = scene
        this.name = name
        this.selector = selector
        this.width = width
        this.gutterX = gutterX
        this.el = scene.querySelector(selector)
        this.wordCollection = []
    }

    /**
     * 
     * @param {Word} word 
     */
    addWord(word) {
        this.wordCollection.push(word)
    }

    appendWords() {
        this.wordCollection.forEach(word => {
            word.appendToGroup(this)
        });
    }

    positionWords() {
        this.wordCollection.forEach((word, i) => {
            if (word.el) {
                gsap.to(word.el, {
                    delay: 1,
                    x: 0,
                    y: i * (word.height + word.gutterY),
                })
            }
        })
    }

    reset() {
        this.positionWords()

        this.wordCollection.forEach(word => {
            word.reset()
        })
    }
}



