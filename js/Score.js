export class Score {
    constructor(numberEl, totalEl) {
        this.numberEl = numberEl
        this.totalEl = totalEl
        this.success = []
        this.failed = []
        this.total = 0
    }

    reset() {

    }

    updateMarkers() {

    }

    setMarkers() {

    }

    successCount() {
        return this.success.length
    }

    updateNumber() {
        this.numberEl.innerText = this.successCount()
    }

    setMax(value) {
        this.total = value
        this.totalEl.innerText = this.total
    }

    addSuccess(question) {
        this.success.push(question)
        this.updateNumber()
        console.log(this.success)
    }

    addFailed(question) {
        this.failed.push(question)
        console.log(this.failed)
    }

    set setTotal(total) {
        this.total = total
    }

    get getTotal() {

    }
}
