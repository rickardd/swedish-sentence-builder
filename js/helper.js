function getAllWords() {
    return collection.collection.reduce((acc, group) => {
        return [...acc, group.wordCollection]
    }, []).flat()
}

function next() {
    question.next()
    groupCollection.reset()
}

export function skip(groupCollection, question) {
    next(groupCollection, question)
}

export function submit(target, question, score) {
    const words = getAllWords()
    const answer = target.getAnswer(words)
    if (question.validate(answer)) {
        alert("Yay!")
        score.addSuccess(question)
        next(groupCollection, question)
    }
    else {
        alert("Nope!")
        score.addFailed(question)
    }
}
