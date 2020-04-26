function getAllWords() {
    return collection.collection.reduce((acc, group) => {
        return [...acc, group.wordCollection]
    }, []).flat()
}

export function skip(groupCollection, question) {
    question.next()
    groupCollection.reset()
}

export function submit(target, question, score) {
    const words = getAllWords()
    const answer = target.getAnswer(words)
    if (question.validate(answer)) {
        alert("Yay!")
        score.addSuccess(question)
        reset()
    }
    else {
        alert("Nope!")
        score.addFailed(question)
    }
}
