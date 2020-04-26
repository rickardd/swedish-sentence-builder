function getAllWords() {
    return collection.collection.reduce((acc, group) => {
        return [...acc, group.wordCollection]
    }, []).flat()
}

export function skip(groupCollection, question) {
    question.next()
    groupCollection.reset()
}

export function submit(target, question) {
    const words = getAllWords()
    const answer = target.getAnswer(words)
    if (question.validate(answer)) {
        alert("Yay!")
        reset()
    }
    else {
        alert("Nope!")
    }
}
