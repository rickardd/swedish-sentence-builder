import gsap from "../node_modules/gsap/all.js";
// import { InertiaPlugin } from "../node_modules/gsap/InertiaPlugin.js";
import { Draggable } from "../node_modules/gsap/Draggable.js";
import { JsonLoader } from "./JsonLoader.js";

import { Score } from "./Score.js"
import { Level } from "./Level.js"
import { Question } from "./Question.js"
import { Word } from "./Word.js"
import { Group } from "./Group.js"
import { GroupCollection } from "./GroupCollection.js"
import { Category } from "./Category.js"
import { Drag } from "./Drag.js"
import { Grid } from "./Grid.js"

// gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(Draggable);

const scene = document.querySelector("#scene")
const target = document.querySelector("#target")
const resetButton = document.querySelector("#reset-button")
const submitButton = document.querySelector("#submit-button")
const questionEl = document.querySelector("#question")
const wordTemplate = document.querySelector("#word-template g")

const gridWidth = 100;
const gridHeight = 40;
const gridGutterX = 24;
const gridGutterY = 6;

const groupCollection = new GroupCollection()
const jsonLoader = new JsonLoader();

let questions;
let currentQuestion;

let answers = []
let answer = ""

gsap.set(target, {
    width: gridWidth * 7 + gridGutterX * 6,
    height: gridHeight
})

function updateAnswer() {
    const wordEls = scene.querySelectorAll(".is-answer");
    answers = []
    answer = ""

    wordEls.forEach(el => {
        const groupX = gsap.getProperty(el.closest(".word-group"), "x")
        const dX = gsap.getProperty(el, "x")
        const finalX = groupX + dX
        const index = (finalX / (gridWidth + gridGutterX))
        const text = el.querySelector("text").textContent
        answers[index] = text.trim()
    })
    answer = answers.join(" ").replace(/\s+/g, " ")
}

function makeDraggable() {

    const wordWrappers = document.querySelectorAll(".word-wrapper")
    Draggable.create(wordWrappers,
        {
            type: "x,y",
            onDrag: function (e) {
                if (this.hitTest("#target")) {
                    target.classList.add("hit")
                }
                else {
                    target.classList.remove("hit")
                }

            },
            onDragEnd: function (e) {
                // const textEl = e.target.nodeName == "text"
                //     ? e.target.textContent
                //     : e.target.nextSibling.nextElementSibling.textContent

                const wordWrapper = this.target.closest(".word-wrapper")

                if (this.hitTest("#target")) {
                    wordWrapper.classList.add("is-answer")
                }
                else {
                    wordWrapper.classList.remove("is-answer")
                    target.classList.remove("hit")
                }
                updateAnswer()
            },
            liveSnap: {
                x: function (value) {
                    return Math.round(value / (gridWidth + gridGutterX)) * (gridWidth + gridGutterX);
                },
                y: function (value) {
                    return Math.round(value / (gridHeight + gridGutterY)) * (gridHeight + gridGutterY);
                }
            }
        }
    );
}

function reset(e) {
    setQuestion()
    groupCollection.reset()
}

function onSubmit(e) {
    console.log('onsubmit', answer, currentQuestion.answer)
    if (answer.toLocaleLowerCase() === currentQuestion.answer.toLocaleLowerCase()) {
        alert("Yay!")
        reset()
    }
    else {
        alert("Nope!")
    }
}

function setQuestion() {
    const randomIndex = Math.floor(Math.random() * 2);
    currentQuestion = questions[randomIndex]
    questions.splice(randomIndex, 1) // removes question from list
    questionEl.innerHTML = currentQuestion.question
    console.log(currentQuestion)
}



function init(wordData) {

    wordData.forEach(groupData => {
        const groupName = groupData.group
        const group = new Group(scene, groupData.group, groupData.groupSelector, gridWidth, gridGutterX)
        groupCollection.addGroup(group)
        groupData.words.forEach(wordText => {
            const word = new Word(wordTemplate, groupName, wordText, gridWidth, gridHeight, gridGutterX, gridGutterY)
            group.addWord(word);
        })
    })

    // for debugging
    window.collection = groupCollection

    const groupY = target.getBBox().y + target.getBBox().height + gridGutterY
    groupCollection.positionGroups(scene, groupY)

    groupCollection.collection.forEach(group => {
        group.appendWords();
        group.positionWords()
    })
    makeDraggable()
}

const wordsLoader = jsonLoader.load('json/words.json')
const questionLoader = jsonLoader.load('json/questions-answers.json')

Promise.all([wordsLoader, questionLoader])
    .then(([wordsData, questionData]) => {
        console.log(wordsData, questionData)
        init(wordsData)
        questions = questionData
        setQuestion()
    })

resetButton.addEventListener("click", reset)

submitButton.addEventListener("click", onSubmit)
