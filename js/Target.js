import gsap from "../node_modules/gsap/all.js";

export class Target {

    constructor(el) {
        this.el = el
    }

    getAnswer(words) {

        const answers = []

        words
            .filter(word => word.el.classList.contains("is-answer"))
            .forEach(word => {
                debugger
                const groupX = gsap.getProperty(word.el.closest(".word-group"), "x")
                const dX = gsap.getProperty(word.el, "x")
                const finalX = groupX + dX
                const index = (finalX / (word.width + word.gutterX))
                answers[index] = word.text.trim()
            })

        const answer = answers
            .join(" ")
            .replace(/\s+/g, " ")

        return answer;
    }
}
