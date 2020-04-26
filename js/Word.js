import gsap from "../node_modules/gsap/all.js";

export class Word {
    constructor(template, groupName, text, width, height, gutterX, gutterY) {
        this.groupName = groupName
        this.text = text
        this.template = template
        this.width = width
        this.height = height
        this.gutterX = gutterX
        this.gutterY = gutterY
        this.el = undefined
    }

    cloneSymbol() {
        const clone = this.template.cloneNode(true); // true, clones text. Maybe it should be false. 
        const rectEl = clone.querySelector("rect")
        const textEl = clone.querySelector("text")
        rectEl.classList.add(this.groupName)
        gsap.set(rectEl, {
            width: this.width,
            height: this.height
        })
        textEl.innerHTML = this.text
        return clone
    }

    appendToGroup(group) {
        this.el = this.cloneSymbol()
        group.el.appendChild(this.el)
    }

    resetAnswerClass() {
        if (this.el) {
            this.el.classList.remove("is-answer")
        }
    }

    static setAnswerClassByElement(el) {
        el.closest(".word-wrapper").classList.add("is-answer")
    }

    static removeAnswerClassByElement(el) {
        el.closest(".word-wrapper").classList.remove("is-answer")
    }

    reset() {
        this.resetAnswerClass()
    }


}

