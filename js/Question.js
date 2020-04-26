export class Question {

    constructor(el) {
        this.el = el
        this.collection = undefined; // undefinded | []
        this.currentQuestion = undefined;
    }

    setCollection(collection) {
        this.collection = collection
    }

    next() {
        if (this.collection.length) {
            const randomIndex = Math.floor(Math.random() * this.collection.length);
            this.currentQuestion = this.collection[randomIndex]
            this.collection.splice(randomIndex, 1) // removes question from list
            this.el.innerHTML = this.currentQuestion.question
            console.log(this.currentQuestion)
        }
    }

    validate(answer) {
        return answer.toLocaleLowerCase() === this.currentQuestion.answer.toLocaleLowerCase()
    }
}
